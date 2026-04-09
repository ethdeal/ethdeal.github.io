import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useRef } from 'react'

const mockState = vi.hoisted(() => ({
  observerInstances: [] as MockIntersectionObserver[],
}))

function applyGsapVars(target: unknown, vars: Record<string, unknown>) {
  if (!(target instanceof HTMLElement)) {
    return
  }

  if (typeof vars.autoAlpha === 'number') {
    target.style.opacity = String(vars.autoAlpha)
    target.style.visibility = vars.autoAlpha === 0 ? 'hidden' : 'visible'
  }

  if (typeof vars.y === 'number') {
    target.style.transform = `translate3d(0px, ${vars.y}px, 0px)`
  }

  if (typeof vars.willChange === 'string') {
    target.style.willChange = vars.willChange
  }

  if (typeof vars.clearProps === 'string') {
    const clearProps = vars.clearProps.split(',').map((prop) => prop.trim())

    if (clearProps.includes('willChange')) {
      target.style.willChange = ''
    }
  }
}

class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  options?: IntersectionObserverInit
  observe = vi.fn()
  disconnect = vi.fn()

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.callback = callback
    this.options = options
    mockState.observerInstances.push(this)
  }

  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(entries as IntersectionObserverEntry[], this as never)
  }
}

vi.mock('../lib/gsap', () => ({
  gsap: {
    set: vi.fn((target: unknown, vars: Record<string, unknown>) => {
      applyGsapVars(target, vars)
    }),
    to: vi.fn((target: unknown, vars: Record<string, unknown>) => {
      applyGsapVars(target, vars)
      return {}
    }),
    killTweensOf: vi.fn(),
  },
}))

import { gsap } from '../lib/gsap'
import { useOneTimeViewportReveal } from '../hooks/useOneTimeViewportReveal'

function mockRect(
  element: HTMLElement,
  { top, left = 0, width = 100, height = 1 }: { top: number; left?: number; width?: number; height?: number },
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

function RevealHarness({
  enabled = true,
  duration = 0,
  triggerTop,
  viewportStart = 0.82,
}: {
  enabled?: boolean
  duration?: number
  triggerTop: number
  viewportStart?: number
}) {
  const targetRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useOneTimeViewportReveal({
    enabled,
    targetRef,
    triggerRef,
    duration,
    viewportStart,
  })

  return (
    <>
      <div
        data-testid="trigger"
        ref={(node) => {
          triggerRef.current = node

          if (node) {
            mockRect(node, { top: triggerTop })
          }
        }}
      />
      <div data-testid="target" ref={targetRef}>
        Target
      </div>
    </>
  )
}

describe('useOneTimeViewportReveal', () => {
  beforeEach(() => {
    mockState.observerInstances.length = 0
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: MockIntersectionObserver,
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('shows the final state immediately when mounted past the viewport threshold', () => {
    render(<RevealHarness triggerTop={640} />)

    const target = screen.getByTestId('target')

    expect(target.style.transform).toBe('translate3d(0px, 0px, 0px)')
    expect(target.style.opacity).toBe('')
    expect(mockState.observerInstances).toHaveLength(0)
  })

  it('reveals once on first intersection and does not replay later', () => {
    render(<RevealHarness triggerTop={960} />)

    const target = screen.getByTestId('target')
    const observer = mockState.observerInstances[0]

    expect(observer).toBeDefined()
    expect(target.style.transform).toBe('translate3d(0px, 48px, 0px)')
    expect(target.style.opacity).toBe('')
    expect(observer.observe).toHaveBeenCalledTimes(1)

    observer.trigger([
      {
        isIntersecting: true,
        target: screen.getByTestId('trigger'),
      },
    ])

    expect(target.style.transform).toBe('translate3d(0px, 0px, 0px)')
    expect(observer.disconnect).toHaveBeenCalledTimes(1)
    expect(gsap.to).toHaveBeenCalledTimes(1)

    observer.trigger([
      {
        isIntersecting: true,
        target: screen.getByTestId('trigger'),
      },
    ])

    expect(gsap.to).toHaveBeenCalledTimes(1)
  })

  it('skips the reveal animation when disabled', () => {
    render(<RevealHarness enabled={false} triggerTop={960} />)

    const target = screen.getByTestId('target')

    expect(target.style.transform).toBe('translate3d(0px, 0px, 0px)')
    expect(target.style.opacity).toBe('')
    expect(mockState.observerInstances).toHaveLength(0)
  })
})
