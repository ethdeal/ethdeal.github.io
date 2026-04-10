import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { HeroScrollCue } from '../features/hero/HeroScrollCue'
import {
  HERO_SCROLL_CUE_DELAY_MS,
  HERO_SCROLL_CUE_FADE_MS,
} from '../hooks/useHeroScrollCue'

function setScrollPosition(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value,
  })
}

function bindRect(node: HTMLElement | null, top: number, height: number) {
  if (!node) {
    return
  }

  Object.defineProperty(node, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      top,
      left: 0,
      width: 100,
      height,
      right: 100,
      bottom: top + height,
      x: 0,
      y: top,
      toJSON: () => '',
    }),
  })
}

function CueHarness({
  stageTop = 0,
  stageHeight = 1320,
}: {
  stageTop?: number
  stageHeight?: number
}) {
  const stageRef = useRef<HTMLElement | null>(null)

  return (
    <>
      <section
        id="about"
        ref={(node) => {
          bindRect(node, stageTop, stageHeight)
          stageRef.current = node
        }}
      />
      <section
        id="experience"
        ref={(node) => {
          bindRect(node, 640, 520)

          if (!node) {
            return
          }

          Object.defineProperty(node, 'offsetTop', {
            configurable: true,
            value: 640,
          })
        }}
        style={{ scrollMarginTop: '96px' }}
      />
      <HeroScrollCue stageRef={stageRef} />
    </>
  )
}

describe('HeroScrollCue', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    setScrollPosition(0)

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })

    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('appears after the delay when the page stays at the top of the hero', () => {
    render(<CueHarness />)

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_DELAY_MS)
    })

    expect(
      screen.getByRole('button', { name: 'Scroll to experience' }),
    ).toBeInTheDocument()
    expect(screen.getByText('SCROLL')).toBeInTheDocument()
  })

  it('never appears if the user scrolls before the delay completes', () => {
    render(<CueHarness />)

    act(() => {
      setScrollPosition(124)
      window.dispatchEvent(new Event('scroll'))
      vi.advanceTimersByTime(HERO_SCROLL_CUE_DELAY_MS)
    })

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })

  it('never appears when the page loads away from the top', () => {
    setScrollPosition(180)

    render(<CueHarness />)

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_DELAY_MS)
    })

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })

  it('fades out and disappears when the user scrolls manually after it appears', () => {
    render(<CueHarness />)

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_DELAY_MS)
    })

    const cue = screen.getByRole('button', { name: 'Scroll to experience' })

    act(() => {
      setScrollPosition(132)
      window.dispatchEvent(new Event('scroll'))
    })

    expect(cue).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_FADE_MS)
    })

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })

  it('fades out and scrolls to experience on click', () => {
    const originalGetComputedStyle = window.getComputedStyle.bind(window)

    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const computedStyle = originalGetComputedStyle(element)

      if (!(element instanceof HTMLElement) || element.id !== 'experience') {
        return computedStyle
      }

      return new Proxy(computedStyle, {
        get(style, property, receiver) {
          if (property === 'scrollMarginTop') {
            return '96px'
          }

          if (property === 'getPropertyValue') {
            return (name: string) =>
              name === 'scroll-margin-top'
                ? '96px'
                : computedStyle.getPropertyValue(name)
          }

          return Reflect.get(style, property, receiver)
        },
      }) as CSSStyleDeclaration
    })

    render(<CueHarness />)

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_DELAY_MS)
    })

    fireEvent.click(screen.getByRole('button', { name: 'Scroll to experience' }))

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 544,
      behavior: 'smooth',
    })
    expect(window.location.hash).toBe('#experience')
    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(HERO_SCROLL_CUE_FADE_MS)
    })

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })
})
