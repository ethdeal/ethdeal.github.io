import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { gsap } from '../lib/gsap'

interface UseOneTimeViewportRevealOptions {
  enabled: boolean
  targetRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
  // Tune this to move the reveal threshold up/down the viewport without using fixed pixels.
  viewportStart?: number
  // Tune this to change how far the section settles upward during the one-time reveal.
  fromY?: number
  // Tune this to make the one-time reveal snappier or softer.
  duration?: number
  ease?: string
}

export function useOneTimeViewportReveal({
  enabled,
  targetRef,
  triggerRef,
  viewportStart = 0.82,
  fromY = 48,
  duration = 0.22,
  ease = 'power2.out',
}: UseOneTimeViewportRevealOptions) {
  useLayoutEffect(() => {
    const target = targetRef.current
    const trigger = triggerRef.current

    if (!target || !trigger) {
      return undefined
    }

    let observer: IntersectionObserver | null = null
    let hasRevealed = false

    const setVisible = () => {
      hasRevealed = true
      gsap.killTweensOf(target)
      gsap.set(target, {
        y: 0,
        clearProps: 'willChange',
      })
    }

    const playReveal = () => {
      if (hasRevealed) {
        return
      }

      hasRevealed = true
      gsap.killTweensOf(target)
      gsap.to(target, {
        y: 0,
        duration,
        ease,
        overwrite: 'auto',
        clearProps: 'willChange',
      })
      observer?.disconnect()
    }

    if (!enabled) {
      setVisible()
      return () => {
        observer?.disconnect()
        gsap.killTweensOf(target)
      }
    }

    const isPastThreshold = () =>
      trigger.getBoundingClientRect().top <= window.innerHeight * viewportStart

    if (isPastThreshold() || typeof IntersectionObserver === 'undefined') {
      setVisible()
      return () => {
        observer?.disconnect()
        gsap.killTweensOf(target)
      }
    }

    gsap.set(target, {
      y: fromY,
      force3D: true,
      willChange: 'transform',
    })

    observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          playReveal()
        }
      },
      {
        rootMargin: `0px 0px -${(1 - viewportStart) * 100}% 0px`,
        threshold: 0,
      },
    )

    observer.observe(trigger)

    return () => {
      observer?.disconnect()
      gsap.killTweensOf(target)
    }
  }, [duration, ease, enabled, fromY, targetRef, triggerRef, viewportStart])
}
