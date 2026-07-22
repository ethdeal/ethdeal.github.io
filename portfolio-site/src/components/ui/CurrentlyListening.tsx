import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import type { CurrentlyListeningTrack } from '../../content/types'
import {
  createSoundCloudPlayerUrl,
  loadSoundCloudWidgetApi,
  type SoundCloudProgress,
  type SoundCloudSound,
  type SoundCloudWidgetController,
} from '../../lib/soundCloudWidget'
import styles from './CurrentlyListening.module.css'

interface CurrentlyListeningProps {
  track: CurrentlyListeningTrack | null
}

function PlayIcon() {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5.4v13.2L18.5 12 8 5.4Z" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg className={styles.actionIcon} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 5.5h3.4v13H7v-13Zm6.6 0H17v13h-3.4v-13Z" />
    </svg>
  )
}

function Waveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <span
      className={[
        styles.waveform,
        isPlaying ? styles.waveformPlaying : '',
      ].join(' ')}
      data-state={isPlaying ? 'playing' : 'paused'}
      aria-hidden="true"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={styles.waveformBar} />
      ))}
    </span>
  )
}

function SoundCloudMark() {
  return (
    <svg className={styles.soundCloudMark} viewBox="0 0 34 16" aria-hidden="true">
      <path d="M1 10.1h1.4v3.2H1v-3.2Zm2.5-2h1.4v5.2H3.5V8.1Zm2.5-1.6h1.4v6.8H6V6.5Zm2.5-2.2h1.4v9H8.5v-9Zm2.5.7h1.4v8.3H11V5Zm2.5-1.4h1.4v9.7h-1.4V3.6Zm2.5 1.7h1.4v8H16V5.3Z" />
      <path d="M20.8 13.3h9.1a3.6 3.6 0 0 0 .4-7.2 5.2 5.2 0 0 0-9.9 1.5 3 3 0 0 0 .4 5.7Z" />
    </svg>
  )
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  return `${minutes}:${seconds}`
}

const CurrentlyListeningControl = forwardRef<
  HTMLDivElement,
  { track: CurrentlyListeningTrack }
>(function CurrentlyListeningControl({ track }, forwardedRef) {
  const detailsId = useId()
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const controllerRef = useRef<SoundCloudWidgetController | null>(null)
  const pendingPlayRef = useRef(false)
  const isDraggingRef = useRef(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasFocus, setHasFocus] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [sound, setSound] = useState<SoundCloudSound | null>(null)
  const [duration, setDuration] = useState(0)
  const [position, setPosition] = useState(0)

  const isDetailsVisible = isHovered || hasFocus || isPlaying
  const title = sound?.title
  const titleUrl = sound?.permalink_url || track.soundCloudUrl
  const uploader = sound?.user?.username
  const uploaderUrl = sound?.user?.permalink_url
  const progressPercent = duration > 0 ? (position / duration) * 100 : 0

  useEffect(() => {
    if (!shouldLoad) {
      return undefined
    }

    const iframe = iframeRef.current

    if (!iframe) {
      return undefined
    }

    let cancelled = false
    let controller: SoundCloudWidgetController | null = null
    let eventNames: string[] = []

    const updatePosition = (data?: SoundCloudProgress) => {
      if (cancelled || isDraggingRef.current) {
        return
      }

      if (typeof data?.currentPosition === 'number') {
        setPosition(data.currentPosition)
        return
      }

      controller?.getPosition((nextPosition) => {
        if (!cancelled && !isDraggingRef.current) {
          setPosition(nextPosition)
        }
      })
    }

    loadSoundCloudWidgetApi()
      .then((api) => {
        if (cancelled) {
          return
        }

        controller = api.Widget(iframe)
        controllerRef.current = controller
        const events = api.Widget.Events
        eventNames = Object.values(events)

        controller.bind(events.READY, () => {
          if (cancelled || !controller) {
            return
          }

          setIsReady(true)
          controller.getCurrentSound((nextSound) => {
            if (!cancelled) {
              setSound(nextSound)
              if (typeof nextSound.duration === 'number') {
                setDuration(nextSound.duration)
              }
            }
          })
          controller.getDuration((nextDuration) => {
            if (!cancelled) {
              setDuration(nextDuration)
            }
          })
          controller.getPosition((nextPosition) => {
            if (!cancelled) {
              setPosition(nextPosition)
            }
          })
          controller.isPaused((isPaused) => {
            if (!cancelled) {
              setIsPlaying(!isPaused)
            }
          })

          if (pendingPlayRef.current) {
            pendingPlayRef.current = false
            controller.play()
          }
        })
        controller.bind(events.PLAY, () => setIsPlaying(true))
        controller.bind(events.PAUSE, () => setIsPlaying(false))
        controller.bind(events.PLAY_PROGRESS, updatePosition)
        controller.bind(events.SEEK, updatePosition)
        controller.bind(events.FINISH, () => {
          setIsPlaying(false)
          setPosition(0)
          controller?.seekTo(0)
        })
        controller.bind(events.ERROR, () => {
          pendingPlayRef.current = false
          setIsPlaying(false)
          setLoadFailed(true)
        })
      })
      .catch(() => {
        if (!cancelled) {
          pendingPlayRef.current = false
          setLoadFailed(true)
        }
      })

    return () => {
      cancelled = true
      pendingPlayRef.current = false
      eventNames.forEach((eventName) => controller?.unbind(eventName))
      if (controllerRef.current === controller) {
        controllerRef.current = null
      }
    }
  }, [shouldLoad, track.soundCloudUrl])

  const beginInteraction = () => {
    setShouldLoad(true)
  }

  const handleToggle = () => {
    beginInteraction()

    if (controllerRef.current && isReady) {
      if (isPlaying) {
        controllerRef.current.pause()
      } else {
        controllerRef.current.play()
      }
    } else if (!loadFailed) {
      pendingPlayRef.current = true
    }
  }

  return (
    <div
      ref={forwardedRef}
      className={[
        styles.root,
        isDetailsVisible ? styles.rootActive : '',
      ].join(' ')}
      data-currently-listening="true"
      onPointerEnter={() => {
        setIsHovered(true)
        beginInteraction()
      }}
      onPointerLeave={(event) => {
        setIsHovered(false)
        setHasFocus(false)
        event.currentTarget.querySelector<HTMLElement>(':focus')?.blur()
      }}
      onFocusCapture={() => {
        setHasFocus(true)
        beginInteraction()
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocus(false)
        }
      }}
    >
      <button
        className={styles.control}
        type="button"
        aria-controls={detailsId}
        aria-expanded={isDetailsVisible}
        aria-label={
          isPlaying
            ? 'Pause current SoundCloud track'
            : 'Play current SoundCloud track'
        }
        aria-pressed={isPlaying}
        onClick={handleToggle}
      >
        <Waveform isPlaying={isPlaying} />
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div
        id={detailsId}
        className={[
          styles.details,
          isDetailsVisible ? styles.detailsVisible : '',
        ].join(' ')}
        aria-hidden={!isDetailsVisible}
        data-visible={isDetailsVisible ? 'true' : 'false'}
      >
        <p className={styles.label}>Currently vibing to</p>

        <p className={styles.metadata}>
          <a href={titleUrl} target="_blank" rel="noreferrer">
            {loadFailed ? 'Open on SoundCloud' : title || 'Loading track…'}
          </a>
          {uploader ? (
            <>
              <span aria-hidden="true"> — </span>
              {uploaderUrl ? (
                <a href={uploaderUrl} target="_blank" rel="noreferrer">
                  {uploader}
                </a>
              ) : (
                <span>{uploader}</span>
              )}
            </>
          ) : null}
        </p>

        <div className={styles.progressRow}>
          <input
            className={styles.progress}
            type="range"
            min="0"
            max={duration || 0}
            step="250"
            value={Math.min(position, duration || 0)}
            disabled={!isReady || duration <= 0 || loadFailed}
            aria-label={`Seek ${title || 'current SoundCloud track'}`}
            aria-valuetext={`${formatTime(position)} of ${formatTime(duration)}`}
            style={
              {
                '--listening-progress': `${progressPercent}%`,
              } as CSSProperties
            }
            onPointerDown={() => {
              isDraggingRef.current = true
            }}
            onPointerUp={() => {
              isDraggingRef.current = false
            }}
            onPointerCancel={() => {
              isDraggingRef.current = false
            }}
            onBlur={() => {
              isDraggingRef.current = false
            }}
            onChange={(event) => {
              const nextPosition = Number(event.currentTarget.value)
              setPosition(nextPosition)
              controllerRef.current?.seekTo(nextPosition)
            }}
          />

          <a
            className={styles.attribution}
            href={titleUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on SoundCloud"
          >
            <SoundCloudMark />
            {/* <span>SoundCloud</span> */}
          </a>
        </div>

        {shouldLoad ? (
          <iframe
            ref={iframeRef}
            className={styles.embed}
            src={createSoundCloudPlayerUrl(track.soundCloudUrl)}
            title="SoundCloud audio player"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            aria-hidden="true"
            data-soundcloud-embed="true"
          />
        ) : null}
      </div>
    </div>
  )
})

export const CurrentlyListening = forwardRef<
  HTMLDivElement,
  CurrentlyListeningProps
>(function CurrentlyListening({ track }, forwardedRef) {
  if (!track?.soundCloudUrl.trim()) {
    return null
  }

  return <CurrentlyListeningControl ref={forwardedRef} track={track} />
})
