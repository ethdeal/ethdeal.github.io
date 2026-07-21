import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import App from '../App'
import starBackground from '../assets/star-background.svg'
import waterBackground from '../assets/water-background.svg'
import { getThemeForDate } from '../lib/theme'
import {
  designCards,
  experienceItems,
  projectCards,
  siteContent,
} from '../content/data'

const mockState = {
  positions: {
    about: 0,
    experience: 680,
    projects: 1320,
    design: 1960,
  },
}

function mockMatchMedia({
  desktop = false,
  reducedMotion = false,
}: {
  desktop?: boolean
  reducedMotion?: boolean
} = {}) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('min-width')
      ? desktop
      : query.includes('prefers-reduced-motion')
        ? reducedMotion
        : false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
}

function dispatchKeyDown(init: KeyboardEventInit) {
  const event = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    ...init,
  })

  window.dispatchEvent(event)
  return event
}

describe('App', () => {
  beforeEach(() => {
    mockMatchMedia()
    mockState.positions.about = 0
    mockState.positions.experience = 680
    mockState.positions.projects = 1320
    mockState.positions.design = 1960

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})

    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function mockBounds(this: HTMLElement) {
        if (this.id === 'about') {
          return {
            top: mockState.positions.about,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: mockState.positions.about + 520,
            x: 0,
            y: mockState.positions.about,
            toJSON: () => '',
          }
        }

        if (this.id === 'experience') {
          return {
            top: mockState.positions.experience,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: mockState.positions.experience + 520,
            x: 0,
            y: mockState.positions.experience,
            toJSON: () => '',
          }
        }

        if (this.id === 'projects') {
          return {
            top: mockState.positions.projects,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: mockState.positions.projects + 520,
            x: 0,
            y: mockState.positions.projects,
            toJSON: () => '',
          }
        }

        if (this.id === 'design') {
          return {
            top: mockState.positions.design,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: mockState.positions.design + 520,
            x: 0,
            y: mockState.positions.design,
            toJSON: () => '',
          }
        }

        return {
          top: 0,
          left: 0,
          width: 100,
          height: 40,
          right: 100,
          bottom: 40,
          x: 0,
          y: 0,
          toJSON: () => '',
        }
      },
    )
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('renders portfolio content from JSON data', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: siteContent.name, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.queryByText("Hi, I'm")).not.toBeInTheDocument()

    for (const item of experienceItems) {
      const company = screen.getByText(item.company)

      expect(company).toBeInTheDocument()
      expect(company.closest('article')).toHaveAttribute('data-hover-dim-card')
      expect(
        screen.getByRole('link', { name: `Visit ${item.company}` }),
      ).toHaveAttribute('href', item.link)
    }

    for (const item of [...projectCards, ...designCards]) {
      const heading = screen.getByRole('heading', {
        name: item.title,
        level: 3,
      })

      expect(heading).toBeInTheDocument()
      expect(heading.closest('article')).toHaveAttribute('data-hover-dim-card')

      if (item.link) {
        expect(
          screen.getByRole('link', { name: `View ${item.title}` }),
        ).toHaveAttribute('href', item.link)
      }
    }

    expect(
      screen.getByRole('navigation', { name: 'Primary navigation' }),
    ).toBeInTheDocument()

    for (const item of siteContent.navItems) {
      expect(screen.getByRole('link', { name: item.label })).toHaveAttribute(
        'href',
        item.href,
      )
    }

    expect(
      screen.getByRole('contentinfo', { name: 'Site footnote' }),
    ).toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })

  it('uses the dark star texture behind portfolio content', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 22, 0))
    document.documentElement.dataset.theme = 'dark'
    const { container } = render(<App />)

    expect(container.querySelector('img[aria-hidden="true"]')).toHaveAttribute(
      'src',
      starBackground,
    )
    expect(container.querySelector('canvas')).toHaveAttribute(
      'aria-hidden',
      'true',
    )
    expect(
      screen.getByRole('link', { name: 'View Full Resume' }),
    ).toBeInTheDocument()
  })

  it.each([
    [
      'dark at 9 p.m.',
      new Date(2026, 0, 1, 20, 59, 59),
      waterBackground,
      starBackground,
    ],
    [
      'light at 6 a.m.',
      new Date(2026, 0, 2, 5, 59, 59),
      starBackground,
      waterBackground,
    ],
  ])(
    'switches the background texture to %s',
    (_label, startTime, initialTexture, expectedTexture) => {
      vi.useFakeTimers()
      vi.setSystemTime(startTime)
      document.documentElement.dataset.theme = getThemeForDate(startTime)
      const { container } = render(<App />)
      const underlay = container.querySelector('img[aria-hidden="true"]')

      expect(underlay).toHaveAttribute('src', initialTexture)

      act(() => {
        vi.advanceTimersByTime(1000)
      })

      expect(underlay).toHaveAttribute('src', expectedTexture)
    },
  )

  it('marks the about link as the current section by default', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('skips the animated hero on desktop when reduced motion is preferred', () => {
    mockMatchMedia({ desktop: true, reducedMotion: true })

    render(<App />)

    expect(
      screen.queryByRole('navigation', { name: 'Hero navigation' }),
    ).not.toBeInTheDocument()
    expect(screen.getByText(siteContent.sidebarSubtitle)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: siteContent.name, level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })

  it('clears the primary nav active state once scrolling passes the final section', () => {
    render(<App />)

    act(() => {
      mockState.positions.about = -1700
      mockState.positions.experience = -1020
      mockState.positions.projects = -860
      mockState.positions.design = -240
      window.dispatchEvent(new Event('scroll'))
    })

    expect(
      screen
        .getByRole('navigation', { name: 'Primary navigation' })
        .querySelector('[aria-current="page"]'),
    ).toBeNull()
  })

  it.each([
    ['Ctrl+P', { ctrlKey: true }],
    ['Command+P', { metaKey: true }],
  ])('opens the configured resume for %s', (_label, modifiers) => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const resumeHref = siteContent.socialLinks.find(
      ({ icon }) => icon === 'resume',
    )?.href

    render(<App />)

    const event = dispatchKeyDown({ key: 'p', ...modifiers })

    expect(event.defaultPrevented).toBe(true)
    expect(openSpy).toHaveBeenCalledOnce()
    expect(openSpy).toHaveBeenCalledWith(
      resumeHref,
      '_blank',
      'noopener,noreferrer',
    )
  })

  it.each([
    ['plain P', { key: 'p' }],
    ['another Ctrl shortcut', { key: 'x', ctrlKey: true }],
    ['Ctrl+Shift+P', { key: 'p', ctrlKey: true, shiftKey: true }],
    ['Command+Alt+P', { key: 'p', metaKey: true, altKey: true }],
    ['Ctrl+Command+P', { key: 'p', ctrlKey: true, metaKey: true }],
  ])('leaves %s unchanged', (_label, init) => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)

    render(<App />)

    const event = dispatchKeyDown(init)

    expect(event.defaultPrevented).toBe(false)
    expect(openSpy).not.toHaveBeenCalled()
  })

  it('prevents repeat openings and removes the shortcut on unmount', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    const { unmount } = render(<App />)

    dispatchKeyDown({ key: 'p', ctrlKey: true })
    const repeatEvent = dispatchKeyDown({
      key: 'p',
      ctrlKey: true,
      repeat: true,
    })

    expect(repeatEvent.defaultPrevented).toBe(true)
    expect(openSpy).toHaveBeenCalledOnce()

    unmount()

    const unmountedEvent = dispatchKeyDown({ key: 'p', ctrlKey: true })

    expect(unmountedEvent.defaultPrevented).toBe(false)
    expect(openSpy).toHaveBeenCalledOnce()
  })
})
