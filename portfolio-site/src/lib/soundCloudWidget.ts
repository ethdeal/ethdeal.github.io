const SOUNDCLOUD_WIDGET_API_URL = 'https://w.soundcloud.com/player/api.js'

export interface SoundCloudSound {
  duration?: number
  permalink_url?: string
  title: string
  user?: {
    permalink_url?: string
    username: string
  }
}

export interface SoundCloudProgress {
  currentPosition?: number
}

export interface SoundCloudWidgetController {
  bind(
    event: string,
    listener: (data?: SoundCloudProgress) => void,
  ): void
  unbind(event: string): void
  play(): void
  pause(): void
  seekTo(milliseconds: number): void
  getCurrentSound(callback: (sound: SoundCloudSound) => void): void
  getDuration(callback: (duration: number) => void): void
  getPosition(callback: (position: number) => void): void
  isPaused(callback: (isPaused: boolean) => void): void
}

export interface SoundCloudWidgetFactory {
  (iframe: HTMLIFrameElement): SoundCloudWidgetController
  Events: {
    ERROR: string
    FINISH: string
    PAUSE: string
    PLAY: string
    PLAY_PROGRESS: string
    READY: string
    SEEK: string
  }
}

export interface SoundCloudWidgetApi {
  Widget: SoundCloudWidgetFactory
}

interface SoundCloudWindow extends Window {
  SC?: SoundCloudWidgetApi
}

let widgetApiPromise: Promise<SoundCloudWidgetApi> | null = null

export function createSoundCloudPlayerUrl(trackUrl: string) {
  const params = new URLSearchParams({
    url: trackUrl,
    auto_play: 'false',
    buying: 'false',
    sharing: 'false',
    download: 'false',
    show_artwork: 'false',
    show_playcount: 'false',
    show_comments: 'false',
    show_user: 'false',
    hide_related: 'true',
    visual: 'false',
  })

  return `https://w.soundcloud.com/player/?${params.toString()}`
}

export function loadSoundCloudWidgetApi(): Promise<SoundCloudWidgetApi> {
  const soundCloudWindow = window as SoundCloudWindow

  if (soundCloudWindow.SC?.Widget) {
    return Promise.resolve(soundCloudWindow.SC)
  }

  if (widgetApiPromise) {
    return widgetApiPromise
  }

  widgetApiPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-soundcloud-widget-api="true"]',
    )
    const script = existingScript ?? document.createElement('script')

    const handleLoad = () => {
      if (soundCloudWindow.SC?.Widget) {
        resolve(soundCloudWindow.SC)
        return
      }

      widgetApiPromise = null
      reject(new Error('SoundCloud player failed to initialize.'))
    }

    const handleError = () => {
      widgetApiPromise = null
      reject(new Error('SoundCloud player failed to load.'))
    }

    script.addEventListener('load', handleLoad, { once: true })
    script.addEventListener('error', handleError, { once: true })

    if (!existingScript) {
      script.src = SOUNDCLOUD_WIDGET_API_URL
      script.async = true
      script.dataset.soundcloudWidgetApi = 'true'
      document.head.append(script)
    }
  })

  return widgetApiPromise
}
