import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ShowcaseSection } from '../components/ui/ShowcaseSection'
import type { ShowcaseCard } from '../content/types'

function rect(height: number) {
  return {
    top: 0,
    left: 0,
    width: 100,
    height,
    right: 100,
    bottom: height,
    x: 0,
    y: 0,
    toJSON: () => '',
  }
}

describe('ShowcaseSection', () => {
  beforeEach(() => {
    document.documentElement.style.setProperty('--showcase-media-max-width', '232px')
    document.documentElement.style.setProperty(
      '--showcase-media-min-height-desktop',
      '176px',
    )

    class ResizeObserverMock {
      observe = vi.fn()
      disconnect = vi.fn()

      constructor() {}
    }

    Object.defineProperty(window, 'ResizeObserver', {
      configurable: true,
      writable: true,
      value: ResizeObserverMock,
    })

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function mockBounds(this: HTMLElement) {
        if (this.textContent?.includes('Tall summary')) {
          return rect(320)
        }

        if (this.textContent?.includes('Wide summary')) {
          return rect(180)
        }

        if (this.textContent?.includes('Short summary')) {
          return rect(80)
        }

        return rect(40)
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.documentElement.style.removeProperty('--showcase-media-max-width')
    document.documentElement.style.removeProperty(
      '--showcase-media-min-height-desktop',
    )
  })

  it('sizes showcase media with a desktop height floor and a landscape width cap while preserving shared links', async () => {
    const items: ShowcaseCard[] = [
      {
        title: 'Tall example',
        date: '2026',
        summary: 'Tall summary',
        tags: ['Print'],
        link: 'https://example.com/tall',
        image: {
          src: '/tall.webp',
          width: 600,
          height: 900,
          alt: 'Tall artwork',
        },
      },
      {
        title: 'Wide example',
        date: '2026',
        summary: 'Wide summary',
        tags: ['Web'],
        link: 'https://example.com/wide',
        image: {
          src: '/wide.webp',
          width: 1600,
          height: 900,
          alt: 'Wide artwork',
        },
      },
      {
        title: 'Short example',
        date: '2026',
        summary: 'Short summary',
        tags: ['Poster'],
        link: 'https://example.com/short',
        image: {
          src: '/short.webp',
          width: 600,
          height: 900,
          alt: 'Short artwork',
        },
      },
    ]

    render(
      <ShowcaseSection
        sectionId="showcase"
        titleId="showcase-title"
        eyebrow="Showcase"
        title="Sizing behavior"
        items={items}
      />,
    )

    const tallImage = screen.getByAltText('Tall artwork')
    const wideImage = screen.getByAltText('Wide artwork')
    const shortImage = screen.getByAltText('Short artwork')

    Object.defineProperty(tallImage, 'naturalWidth', {
      configurable: true,
      value: 600,
    })
    Object.defineProperty(tallImage, 'naturalHeight', {
      configurable: true,
      value: 900,
    })
    Object.defineProperty(wideImage, 'naturalWidth', {
      configurable: true,
      value: 1600,
    })
    Object.defineProperty(wideImage, 'naturalHeight', {
      configurable: true,
      value: 900,
    })
    Object.defineProperty(shortImage, 'naturalWidth', {
      configurable: true,
      value: 600,
    })
    Object.defineProperty(shortImage, 'naturalHeight', {
      configurable: true,
      value: 900,
    })

    fireEvent.load(tallImage)
    fireEvent.load(wideImage)
    fireEvent.load(shortImage)

    const tallCard = screen
      .getByRole('heading', { name: 'Tall example', level: 3 })
      .closest('article')
    const wideCard = screen
      .getByRole('heading', { name: 'Wide example', level: 3 })
      .closest('article')
    const shortCard = screen
      .getByRole('heading', { name: 'Short example', level: 3 })
      .closest('article')

    expect(screen.getByRole('link', { name: 'Open Tall example' })).toHaveAttribute(
      'href',
      'https://example.com/tall',
    )
    expect(screen.getByRole('link', { name: 'View Tall example' })).toHaveAttribute(
      'href',
      'https://example.com/tall',
    )

    await waitFor(() => {
      expect(tallCard).not.toBeNull()
      expect(wideCard).not.toBeNull()
      expect(shortCard).not.toBeNull()
      expect(
        Number.parseFloat(
          tallCard?.style.getPropertyValue('--showcase-media-width') ?? '',
        ),
      ).toBeLessThan(232)
      expect(
        Number.parseFloat(
          wideCard?.style.getPropertyValue('--showcase-media-width') ?? '',
        ),
      ).toBe(232)
      expect(
        Number.parseFloat(
          shortCard?.style.getPropertyValue('--showcase-media-width') ?? '',
        ),
      ).toBeGreaterThan(100)
    })
  })
})
