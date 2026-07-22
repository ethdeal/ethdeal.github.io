import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const EVENTS = {
  ERROR: 'error',
  FINISH: 'finish',
  PAUSE: 'pause',
  PLAY: 'play',
  PLAY_PROGRESS: 'play-progress',
  READY: 'ready',
  SEEK: 'seek',
} as const

const soundCloudMock = vi.hoisted(() => ({
  bind: vi.fn(),
  createSoundCloudPlayerUrl: vi.fn(() => 'about:blank'),
  getCurrentSound: vi.fn(),
  getDuration: vi.fn(),
  getPosition: vi.fn(),
  isPaused: vi.fn(),
  listeners: {} as Record<
    string,
    (data?: { currentPosition?: number }) => void
  >,
  loadSoundCloudWidgetApi: vi.fn(),
  pause: vi.fn(),
  play: vi.fn(),
  seekTo: vi.fn(),
  unbind: vi.fn(),
  widgetFactory: vi.fn(),
}))

vi.mock('../lib/soundCloudWidget', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../lib/soundCloudWidget')>()

  return {
    ...actual,
    createSoundCloudPlayerUrl: soundCloudMock.createSoundCloudPlayerUrl,
    loadSoundCloudWidgetApi: soundCloudMock.loadSoundCloudWidgetApi,
  }
})

import { CurrentlyListening } from '../components/ui/CurrentlyListening'

const TRACK = {
  soundCloudUrl: 'https://soundcloud.com/lizzymcalpine/erase-me-feat-jacob-collier',
}

const SOUND = {
  duration: 214_000,
  permalink_url: TRACK.soundCloudUrl,
  title: 'erase me (feat. Jacob Collier)',
  user: {
    permalink_url: 'https://soundcloud.com/lizzymcalpine',
    username: 'Lizzy McAlpine',
  },
}

function emit(event: string, data?: { currentPosition?: number }) {
  act(() => {
    soundCloudMock.listeners[event]?.(data)
  })
}

describe('CurrentlyListening', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    soundCloudMock.listeners = {}
    soundCloudMock.bind.mockImplementation(
      (
        event: string,
        listener: (data?: { currentPosition?: number }) => void,
      ) => {
        soundCloudMock.listeners[event] = listener
      },
    )
    soundCloudMock.getCurrentSound.mockImplementation((callback) => {
      callback(SOUND)
    })
    soundCloudMock.getDuration.mockImplementation((callback) => {
      callback(SOUND.duration)
    })
    soundCloudMock.getPosition.mockImplementation((callback) => {
      callback(0)
    })
    soundCloudMock.isPaused.mockImplementation((callback) => {
      callback(true)
    })
    soundCloudMock.widgetFactory.mockImplementation(() => ({
      bind: soundCloudMock.bind,
      getCurrentSound: soundCloudMock.getCurrentSound,
      getDuration: soundCloudMock.getDuration,
      getPosition: soundCloudMock.getPosition,
      isPaused: soundCloudMock.isPaused,
      pause: soundCloudMock.pause,
      play: soundCloudMock.play,
      seekTo: soundCloudMock.seekTo,
      unbind: soundCloudMock.unbind,
    }))
    Object.assign(soundCloudMock.widgetFactory, { Events: EVENTS })
    soundCloudMock.loadSoundCloudWidgetApi.mockResolvedValue({
      Widget: soundCloudMock.widgetFactory,
    })
  })

  it('renders nothing without a configured SoundCloud track', () => {
    render(<CurrentlyListening track={null} />)

    expect(
      screen.queryByRole('button', { name: 'Play current SoundCloud track' }),
    ).not.toBeInTheDocument()
  })

  it('loads lazily and reveals details on hover or focus', async () => {
    const user = userEvent.setup()
    const { container } = render(<CurrentlyListening track={TRACK} />)
    const button = screen.getByRole('button', {
      name: 'Play current SoundCloud track',
    })
    const root = container.querySelector('[data-currently-listening="true"]')
    const details = document.getElementById(button.getAttribute('aria-controls')!)

    expect(details).toHaveAttribute('data-visible', 'false')
    expect(soundCloudMock.loadSoundCloudWidgetApi).not.toHaveBeenCalled()
    expect(screen.queryByTitle('SoundCloud audio player')).not.toBeInTheDocument()

    await user.hover(button)

    await waitFor(() => {
      expect(soundCloudMock.widgetFactory).toHaveBeenCalledWith(
        screen.getByTitle('SoundCloud audio player'),
      )
    })
    expect(screen.getByTitle('SoundCloud audio player')).toHaveAttribute(
      'allow',
      'autoplay; encrypted-media',
    )
    expect(details).toHaveAttribute('data-visible', 'true')

    fireEvent.pointerLeave(root as HTMLElement)
    expect(details).toHaveAttribute('data-visible', 'false')

    fireEvent.focus(button)
    expect(details).toHaveAttribute('data-visible', 'true')
  })

  it('queues initial playback and hides details after leaving while SoundCloud is playing', async () => {
    const user = userEvent.setup()
    const { container } = render(<CurrentlyListening track={TRACK} />)
    const button = screen.getByRole('button', {
      name: 'Play current SoundCloud track',
    })
    const root = container.querySelector('[data-currently-listening="true"]')
    const details = document.getElementById(button.getAttribute('aria-controls')!)

    await user.click(button)
    await waitFor(() => expect(soundCloudMock.bind).toHaveBeenCalled())

    expect(soundCloudMock.play).not.toHaveBeenCalled()
    emit(EVENTS.READY)
    expect(soundCloudMock.play).toHaveBeenCalledOnce()

    emit(EVENTS.PLAY)
    expect(details).toHaveAttribute('data-visible', 'true')

    fireEvent.blur(button, { relatedTarget: null })
    fireEvent.pointerLeave(root as HTMLElement)

    expect(button).toHaveAccessibleName('Pause current SoundCloud track')
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(details).toHaveAttribute('data-visible', 'false')
    expect(container.querySelector('[data-state="playing"]')).toBeInTheDocument()

    await user.click(button)
    expect(soundCloudMock.pause).toHaveBeenCalledOnce()
    emit(EVENTS.PAUSE)
    fireEvent.pointerLeave(root as HTMLElement)
    expect(button).not.toHaveFocus()
    expect(details).toHaveAttribute('data-visible', 'false')
  })

  it('shows linked metadata, tracks progress, seeks, and resets on finish', async () => {
    const user = userEvent.setup()
    render(<CurrentlyListening track={TRACK} />)

    await user.hover(
      screen.getByRole('button', { name: 'Play current SoundCloud track' }),
    )
    await waitFor(() => expect(soundCloudMock.bind).toHaveBeenCalled())
    emit(EVENTS.READY)

    expect(
      screen.getByRole('link', { name: SOUND.title }),
    ).toHaveAttribute('href', SOUND.permalink_url)
    expect(
      screen.getByRole('link', { name: SOUND.user.username }),
    ).toHaveAttribute('href', SOUND.user.permalink_url)
    expect(
      screen.getByRole('link', { name: 'Listen on SoundCloud' }),
    ).toHaveAttribute('rel', 'noreferrer')

    const progress = screen.getByRole('slider', {
      name: `Seek ${SOUND.title}`,
    })
    emit(EVENTS.PLAY_PROGRESS, { currentPosition: 60_000 })
    expect(progress).toHaveValue('60000')
    expect(progress).toHaveAttribute('aria-valuetext', '1:00 of 3:34')

    fireEvent.pointerDown(progress)
    emit(EVENTS.PLAY_PROGRESS, { currentPosition: 90_000 })
    expect(progress).toHaveValue('60000')

    fireEvent.change(progress, { target: { value: '120000' } })
    expect(soundCloudMock.seekTo).toHaveBeenCalledWith(120_000)
    fireEvent.pointerUp(progress)
    emit(EVENTS.PLAY_PROGRESS, { currentPosition: 130_000 })
    expect(progress).toHaveValue('130000')

    emit(EVENTS.FINISH)
    expect(progress).toHaveValue('0')
    expect(soundCloudMock.seekTo).toHaveBeenCalledWith(0)
  })

  it('offers a direct SoundCloud fallback when the widget API fails', async () => {
    const user = userEvent.setup()
    soundCloudMock.loadSoundCloudWidgetApi.mockRejectedValueOnce(
      new Error('blocked'),
    )

    render(<CurrentlyListening track={TRACK} />)
    await user.hover(
      screen.getByRole('button', { name: 'Play current SoundCloud track' }),
    )

    expect(
      await screen.findByRole('link', { name: 'Open on SoundCloud' }),
    ).toHaveAttribute('href', TRACK.soundCloudUrl)
  })
})
