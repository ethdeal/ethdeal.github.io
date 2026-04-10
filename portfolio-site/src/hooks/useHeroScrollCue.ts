import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

export const HERO_SCROLL_CUE_DELAY_MS = 2000
export const HERO_SCROLL_CUE_FADE_MS = 220

const TOP_SCROLL_TOLERANCE = 100

export type HeroScrollCueStatus =
  | 'hidden'
  | 'visible'
  | 'fading'
  | 'dismissed'

function isTopOfPage() {
  return window.scrollY <= TOP_SCROLL_TOLERANCE
}

function isHeroStageActive(stage: HTMLElement | null) {
  if (!stage) {
    return false
  }

  const bounds = stage.getBoundingClientRect()

  return bounds.top <= 0 && bounds.bottom > window.innerHeight
}

export function useHeroScrollCue(stageRef: RefObject<HTMLElement | null>) {
  const [status, setStatus] = useState<HeroScrollCueStatus>(() => {
    if (typeof window === 'undefined') {
      return 'dismissed'
    }

    return isTopOfPage() ? 'hidden' : 'dismissed'
  })

  const statusRef = useRef(status)
  const showTimeoutRef = useRef<number | null>(null)
  const fadeTimeoutRef = useRef<number | null>(null)

  const clearTimers = useCallback(() => {
    if (showTimeoutRef.current !== null) {
      window.clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }

    if (fadeTimeoutRef.current !== null) {
      window.clearTimeout(fadeTimeoutRef.current)
      fadeTimeoutRef.current = null
    }
  }, [])

  const dismissImmediately = useCallback(() => {
    clearTimers()

    if (statusRef.current === 'dismissed') {
      return
    }

    statusRef.current = 'dismissed'
    setStatus('dismissed')
  }, [clearTimers])

  const dismissWithFade = useCallback(() => {
    clearTimers()

    if (
      statusRef.current === 'dismissed' ||
      statusRef.current === 'fading'
    ) {
      return
    }

    if (statusRef.current !== 'visible') {
      statusRef.current = 'dismissed'
      setStatus('dismissed')
      return
    }

    statusRef.current = 'fading'
    setStatus('fading')
    fadeTimeoutRef.current = window.setTimeout(() => {
      statusRef.current = 'dismissed'
      setStatus('dismissed')
      fadeTimeoutRef.current = null
    }, HERO_SCROLL_CUE_FADE_MS)
  }, [clearTimers])

  useEffect(() => {
    statusRef.current = status
  }, [status])

  useEffect(() => {
    if (!isTopOfPage()) {
      dismissImmediately()
      return undefined
    }

    statusRef.current = 'hidden'
    setStatus('hidden')

    const handleScroll = () => {
      if (window.scrollY <= TOP_SCROLL_TOLERANCE) {
        return
      }

      if (statusRef.current === 'visible') {
        dismissWithFade()
        return
      }

      dismissImmediately()
    }

    showTimeoutRef.current = window.setTimeout(() => {
      showTimeoutRef.current = null

      if (!isTopOfPage() || !isHeroStageActive(stageRef.current)) {
        dismissImmediately()
        return
      }

      statusRef.current = 'visible'
      setStatus('visible')
    }, HERO_SCROLL_CUE_DELAY_MS)

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearTimers()
    }
  }, [clearTimers, dismissImmediately, dismissWithFade, stageRef])

  return {
    status,
    dismissWithFade,
  }
}
