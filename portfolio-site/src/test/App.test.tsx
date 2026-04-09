import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

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
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function mockBounds(this: HTMLElement) {
        if (this.id === 'about') {
          return {
            top: 0,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: 520,
            x: 0,
            y: 0,
            toJSON: () => '',
          }
        }

        if (this.id === 'experience') {
          return {
            top: 680,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: 1200,
            x: 0,
            y: 680,
            toJSON: () => '',
          }
        }

        if (this.id === 'projects') {
          return {
            top: 1320,
            left: 0,
            width: 100,
            height: 520,
            right: 100,
            bottom: 1840,
            x: 0,
            y: 1320,
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
    expect(screen.getByText('Fullstack Dev')).toBeInTheDocument()
    expect(screen.queryByText("Hi, I'm Ethan")).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
