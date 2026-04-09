import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useRef } from 'react'

const mockState = vi.hoisted(() => ({
  scrollProgress: 0,
  setCalls: [] as Array<{ target: unknown; vars: Record<string, unknown> }>,
  timelineCalls: [] as Array<
    | {
        method: 'to'
        target: unknown
        vars: Record<string, unknown>
        position: number
      }
    | {
        method: 'fromTo'
        target: unknown
        fromVars: Record<string, unknown>
        toVars: Record<string, unknown>
        position: number
      }
  >,
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

vi.mock('../lib/gsap', () => {
  const ScrollTrigger = {
    refresh: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }

  return {
    ensureGsapPlugins: vi.fn(),
    gsap: {
      set: vi.fn((target: unknown, vars: Record<string, unknown>) => {
        mockState.setCalls.push({ target, vars })
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
        const scrollTrigger: MockScrollTriggerInstance = {
          progress: mockState.scrollProgress,
          kill: vi.fn(),
          update: vi.fn(),
        }

        const applyTimelineProgress = (progress: number) => {
          mockState.timelineCalls.forEach((call) => {
            if (call.method === 'to' && progress >= call.position) {
              applyGsapVars(call.target, call.vars)
            }

            if (call.method === 'fromTo' && progress >= call.position) {
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
              mockState.timelineCalls.push({
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
              fromVars: Record<string, unknown>,
              toVars: Record<string, unknown>,
              position: number,
            ) => {
              mockState.timelineCalls.push({
                method: 'fromTo',
                target,
                fromVars,
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

import { useHeroScrollTimeline } from '../hooks/useHeroScrollTimeline'

function mockRect(
  element: HTMLElement,
  {
    top,
    left = 0,
    width = 100,
    height = 40,
  }: {
    top: number
    left?: number
    width?: number
    height?: number
  },
) {
  Object.defineProperty(element, 'getBoundingClientRect', {
    configurable: true,
    value: () => ({
      top,
      left,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => '',
    }),
  })
}

function HeroTimelineHarness({ enabled = true }: { enabled?: boolean }) {
  const stageRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const topNavRef = useRef<HTMLElement>(null)
  const heroMetaRef = useRef<HTMLDivElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const sidebarTitleAnchorRef = useRef<HTMLParagraphElement>(null)
  const sidebarBodyRef = useRef<HTMLDivElement>(null)

  useHeroScrollTimeline({
    enabled,
    stageRef,
    overlayRef,
    backdropRef,
    topNavRef,
    heroMetaRef,
    heroCopyRef,
    heroTitleRef,
    sidebarTitleAnchorRef,
    sidebarBodyRef,
  })

  return (
    <>
      <section data-testid="stage" ref={stageRef} />
      <div data-testid="overlay" ref={overlayRef} />
      <div data-testid="backdrop" ref={backdropRef} />
      <header data-testid="top-nav" ref={topNavRef} />
      <div data-testid="hero-meta" ref={heroMetaRef} />
      <div data-testid="hero-copy" ref={heroCopyRef} />
      <h1
        data-testid="hero-title"
        ref={(node) => {
          heroTitleRef.current = node

          if (node) {
            mockRect(node, { top: 420, left: 180, width: 420, height: 120 })
          }
        }}
      >
        HERO
      </h1>
      <p
        data-testid="sidebar-title"
        ref={(node) => {
          sidebarTitleAnchorRef.current = node

          if (node) {
            mockRect(node, { top: 120, left: 48, width: 220, height: 72 })
          }
        }}
      >
        HERO
      </p>
      <div
        data-testid="sidebar-body"
        ref={(node) => {
          sidebarBodyRef.current = node

          if (node) {
            mockRect(node, { top: 460, left: 48, width: 280, height: 320 })
          }
        }}
      >
        Sidebar body
      </div>
      <div data-testid="content-reveal">Unrelated content</div>
    </>
  )
}

describe('useHeroScrollTimeline', () => {
  beforeEach(() => {
    mockState.scrollProgress = 0
    mockState.setCalls.length = 0
    mockState.timelineCalls.length = 0
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('keeps the sidebar movement ending with the title and does not touch unrelated content', () => {
    render(<HeroTimelineHarness />)

    const heroTitle = screen.getByTestId('hero-title')
    const sidebarBody = screen.getByTestId('sidebar-body')
    const unrelatedContent = screen.getByTestId('content-reveal')

    const heroTitleTween = mockState.timelineCalls.find(
      (call) => call.method === 'to' && call.target === heroTitle,
    )
    const sidebarMoveTween = mockState.timelineCalls.find(
      (call) => call.method === 'fromTo' && call.target === sidebarBody,
    )

    expect(heroTitleTween).toBeDefined()
    expect(sidebarMoveTween).toBeDefined()

    if (heroTitleTween?.method !== 'to' || sidebarMoveTween?.method !== 'fromTo') {
      return
    }

    expect(
      heroTitleTween.position + Number(heroTitleTween.vars.duration),
    ).toBeCloseTo(
      sidebarMoveTween.position + Number(sidebarMoveTween.toVars.duration),
    )
    expect(
      mockState.setCalls.some((call) => call.target === unrelatedContent),
    ).toBe(false)
    expect(
      mockState.timelineCalls.some((call) => call.target === unrelatedContent),
    ).toBe(false)
  })

  it('syncs the title and sidebar body to the current scroll position on mount', () => {
    mockState.scrollProgress = 0.2

    render(<HeroTimelineHarness />)

    expect(screen.getByTestId('hero-title').style.transform).not.toBe(
      'translate3d(0px, 0px, 0px) scale(1)',
    )
    expect(screen.getByTestId('sidebar-body').style.transform).not.toBe(
      'translate3d(0px, 940px, 0px) scale(1)',
    )
  })
})
