import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { siteContent } from '../content/data'

const mockState = vi.hoisted(() => ({
  scrollProgress: 0.2,
}))

const transformState = new WeakMap<
  HTMLElement,
  { x: number; y: number; scale: number }
>()

function getTransformState(target: HTMLElement) {
  const existingState = transformState.get(target)

  if (existingState) {
    return existingState
  }

  const initialState = { x: 0, y: 0, scale: 1 }
  transformState.set(target, initialState)
  return initialState
}

function applyTransform(target: HTMLElement) {
  const { x, y, scale } = getTransformState(target)
  target.style.transform = `translate3d(${x}px, ${y}px, 0px) scale(${scale})`
}

function applyGsapVars(target: unknown, vars: Record<string, unknown>) {
  if (!(target instanceof HTMLElement)) {
    return
  }

  const state = getTransformState(target)

  if (typeof vars.autoAlpha === 'number') {
    target.style.opacity = String(vars.autoAlpha)
    target.style.visibility = vars.autoAlpha === 0 ? 'hidden' : 'visible'
  }

  if (typeof vars.x === 'number') {
    state.x = vars.x
  }

  if (typeof vars.y === 'number') {
    state.y = vars.y
  }

  if (typeof vars.scale === 'number') {
    state.scale = vars.scale
  }

  if (
    typeof vars.x === 'number' ||
    typeof vars.y === 'number' ||
    typeof vars.scale === 'number'
  ) {
    applyTransform(target)
  }
}

interface MockScrollTriggerInstance {
  progress: number
  kill: ReturnType<typeof vi.fn>
  update: ReturnType<typeof vi.fn>
}

interface MockTimelineCall {
  method: 'to' | 'fromTo'
  target: unknown
  vars?: Record<string, unknown>
  toVars?: Record<string, unknown>
  position: number
}

vi.mock('../lib/gsap', () => {
  const timelineCalls: MockTimelineCall[] = []

  const ScrollTrigger = {
    refresh: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  return {
    ensureGsapPlugins: vi.fn(),
    gsap: {
      set: vi.fn((target: unknown, vars: Record<string, unknown>) => {
        applyGsapVars(target, vars)
      }),
      to: vi.fn((target: unknown, vars: Record<string, unknown>) => {
        applyGsapVars(target, vars)
        return {}
      }),
      killTweensOf: vi.fn(),
      context: (callback: () => void | (() => void)) => {
        const cleanup = callback()

        return {
          revert: () => {
            cleanup?.()
          },
        }
      },
      timeline: vi.fn(() => {
        timelineCalls.length = 0

        const scrollTrigger: MockScrollTriggerInstance = {
          progress: mockState.scrollProgress,
          kill: vi.fn(),
          update: vi.fn(),
        }

        const applyTimelineProgress = (progress: number) => {
          timelineCalls.forEach((call) => {
            if (progress < call.position) {
              return
            }

            if (call.method === 'to' && call.vars) {
              applyGsapVars(call.target, call.vars)
            }

            if (call.method === 'fromTo' && call.toVars) {
              applyGsapVars(call.target, call.toVars)
            }
          })
        }

        const timeline = {
          scrollTrigger,
          progress: vi.fn((value?: number) => {
            if (typeof value !== 'number') {
              return scrollTrigger.progress
            }

            scrollTrigger.progress = value
            applyTimelineProgress(value)
            return timeline
          }),
          to: vi.fn(
            (
              target: unknown,
              vars: Record<string, unknown>,
              position: number,
            ) => {
              timelineCalls.push({
                method: 'to',
                target,
                vars,
                position,
              })
              return timeline
            },
          ),
          fromTo: vi.fn(
            (
              target: unknown,
              _fromVars: Record<string, unknown>,
              toVars: Record<string, unknown>,
              position: number,
            ) => {
              timelineCalls.push({
                method: 'fromTo',
                target,
                toVars,
                position,
              })
              return timeline
            },
          ),
          kill: vi.fn(),
        }

        return timeline
      }),
    },
    ScrollTrigger,
  }
})

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

function rect({
  top,
  left = 0,
  width = 100,
  height = 40,
}: {
  top: number
  left?: number
  width?: number
  height?: number
}) {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => '',
  }
}

describe('desktop animated page', () => {
  beforeEach(() => {
    mockMatchMedia({ desktop: true })
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: class {
        observe = vi.fn()
        disconnect = vi.fn()
        constructor() {}
      },
    })
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function mockBounds(this: HTMLElement) {
        if (this.matches('h1')) {
          return rect({ top: 420, left: 180, width: 420, height: 120 })
        }

        if (this.tagName === 'P' && this.textContent === 'ETHAN DEAL') {
          return rect({ top: 120, left: 48, width: 220, height: 72 })
        }

        if (
          this.textContent?.includes(siteContent.sidebarSubtitle) &&
          this.textContent?.includes('About')
        ) {
          return rect({ top: 460, left: 48, width: 280, height: 320 })
        }

        if (this.querySelector?.('#experience')) {
          return rect({ top: 640, left: 0, width: 880, height: 1200 })
        }

        return rect({ top: 900, left: 0, width: 160, height: 48 })
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('keeps the sidebar support and right-column content in their visible transform states on a mid-scroll reload', () => {
    render(<App />)

    const sidebarSupporting =
      screen.getByText(siteContent.sidebarSubtitle).closest('header')?.parentElement ?? null
    const desktopContent = document.getElementById('experience')?.parentElement

    expect(sidebarSupporting).not.toBeNull()
    expect(desktopContent).not.toBeNull()
    expect(sidebarSupporting?.style.transform).not.toBe(
      'translate3d(0px, 940px, 0px) scale(1)',
    )
    expect(sidebarSupporting?.style.opacity).toBe('')
    expect(desktopContent?.style.transform).toBe('')
    expect(desktopContent?.style.opacity).toBe('')
  })

  it('does not show the scroll cue immediately on desktop load', () => {
    render(<App />)

    expect(
      screen.queryByRole('button', { name: 'Scroll to experience' }),
    ).not.toBeInTheDocument()
  })
})
