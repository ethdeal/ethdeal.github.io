import { afterEach, describe, expect, it, vi } from 'vitest'
import type { SoundCloudWidgetApi } from '../lib/soundCloudWidget'

interface SoundCloudWindow extends Window {
  SC?: SoundCloudWidgetApi
}

describe('SoundCloud widget integration', () => {
  afterEach(() => {
    document
      .querySelectorAll('script[data-soundcloud-widget-api="true"]')
      .forEach((script) => script.remove())
    delete (window as SoundCloudWindow).SC
    vi.restoreAllMocks()
    vi.resetModules()
  })

  it('loads the official widget API only once', async () => {
    const appendSpy = vi
      .spyOn(document.head, 'append')
      .mockImplementation(() => undefined)
    const { loadSoundCloudWidgetApi } = await import(
      '../lib/soundCloudWidget'
    )
    const firstLoad = loadSoundCloudWidgetApi()
    const secondLoad = loadSoundCloudWidgetApi()
    const script = appendSpy.mock.calls[0]?.[0] as HTMLScriptElement
    const api = {
      Widget: Object.assign(vi.fn(), { Events: {} }),
    } as unknown as SoundCloudWidgetApi

    expect(firstLoad).toBe(secondLoad)
    expect(appendSpy).toHaveBeenCalledOnce()
    expect(script).toMatchObject({
      async: true,
      src: 'https://w.soundcloud.com/player/api.js',
    })

    ;(window as SoundCloudWindow).SC = api
    script.dispatchEvent(new Event('load'))

    await expect(firstLoad).resolves.toBe(api)
    await expect(secondLoad).resolves.toBe(api)
  })

  it('builds a hidden player URL for the configured track with chrome disabled', async () => {
    const { createSoundCloudPlayerUrl } = await import(
      '../lib/soundCloudWidget'
    )
    const trackUrl = 'https://soundcloud.com/artist/track'
    const playerUrl = new URL(createSoundCloudPlayerUrl(trackUrl))

    expect(`${playerUrl.origin}${playerUrl.pathname}`).toBe(
      'https://w.soundcloud.com/player/',
    )
    expect(playerUrl.searchParams.get('url')).toBe(trackUrl)
    expect(playerUrl.searchParams.get('auto_play')).toBe('false')
    expect(playerUrl.searchParams.get('buying')).toBe('false')
    expect(playerUrl.searchParams.get('sharing')).toBe('false')
    expect(playerUrl.searchParams.get('download')).toBe('false')
    expect(playerUrl.searchParams.get('show_artwork')).toBe('false')
    expect(playerUrl.searchParams.get('show_playcount')).toBe('false')
    expect(playerUrl.searchParams.get('show_comments')).toBe('false')
    expect(playerUrl.searchParams.get('show_user')).toBe('false')
  })
})
