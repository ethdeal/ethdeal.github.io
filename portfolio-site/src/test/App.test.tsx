import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { act, render, screen } from '@testing-library/react'
import App from '../App'
import { siteContent } from '../content/data'

const mockState = {
  positions: {
    about: 0,
    experience: 680,
    projects: 1320,
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

describe('App', () => {
  beforeEach(() => {
    mockMatchMedia()
    mockState.positions.about = 0
    mockState.positions.experience = 680
    mockState.positions.projects = 1320

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
    vi.restoreAllMocks()
  })

  it('renders portfolio content from JSON data', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'ETHAN DEAL', level: 1 }),
    ).toBeInTheDocument()
    expect(screen.getByText('BRIYA')).toBeInTheDocument()
    expect(screen.getByText('RAG Fact-Checking Extension')).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Visit BRIYA' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'View RAG Fact-Checking Extension' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('navigation', { name: 'Primary navigation' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'Brittany Chiang' }),
    ).toHaveAttribute('href', 'https://brittanychiang.com/')
  })

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
    expect(screen.queryByText("Hi, I'm Ethan")).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('clears the primary nav active state once scrolling passes the final section', () => {
    render(<App />)

    act(() => {
      mockState.positions.about = -1700
      mockState.positions.experience = -1020
      mockState.positions.projects = -240
      window.dispatchEvent(new Event('scroll'))
    })

    expect(
      screen
        .getByRole('navigation', { name: 'Primary navigation' })
        .querySelector('[aria-current="page"]'),
    ).toBeNull()
  })
})
