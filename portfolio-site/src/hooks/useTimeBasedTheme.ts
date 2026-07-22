import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import {
  getInitialTheme,
  getInitialThemePreference,
  getMillisecondsUntilNextThemeChange,
  getThemeForDate,
  storeThemePreference,
  THEME_COLORS,
  THEME_TRANSITION_DURATION,
  type SiteTheme,
  type ThemePreference,
} from '../lib/theme'

function applyTheme(theme: SiteTheme, preference: ThemePreference) {
  document.documentElement.dataset.theme = theme
  document.documentElement.dataset.themePreference = preference
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
}

export function useTimeBasedTheme() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [preference, setPreference] = useState(getInitialThemePreference)
  const themeRef = useRef(theme)
  const transitionTimeoutRef = useRef<number | undefined>(undefined)

  const commitTheme = useCallback(
    (
      nextTheme: SiteTheme,
      nextPreference: ThemePreference,
      animate = true,
    ) => {
      const update = () => {
        themeRef.current = nextTheme
        applyTheme(nextTheme, nextPreference)
        setTheme(nextTheme)
        setPreference(nextPreference)
      }

      const shouldAnimate =
        animate &&
        nextTheme !== themeRef.current &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!shouldAnimate) {
        update()
        return
      }

      if (typeof document.startViewTransition === 'function') {
        document.startViewTransition(() => flushSync(update))
        return
      }

      const root = document.documentElement
      root.dataset.themeTransitioning = 'true'
      void root.offsetWidth
      update()

      if (transitionTimeoutRef.current !== undefined) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      transitionTimeoutRef.current = window.setTimeout(() => {
        delete root.dataset.themeTransitioning
        transitionTimeoutRef.current = undefined
      }, THEME_TRANSITION_DURATION)
    },
    [],
  )

  useEffect(() => {
    let timeoutId: number | undefined

    const syncTheme = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }

      const now = new Date()
      const currentTheme = getThemeForDate(now)

      commitTheme(currentTheme, 'auto')
      timeoutId = window.setTimeout(
        syncTheme,
        getMillisecondsUntilNextThemeChange(now),
      )
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        syncTheme()
      }
    }

    if (preference !== 'auto') {
      applyTheme(themeRef.current, preference)
      return undefined
    }

    syncTheme()
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', syncTheme)

    return () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }

      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', syncTheme)
    }
  }, [commitTheme, preference])

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current !== undefined) {
        window.clearTimeout(transitionTimeoutRef.current)
      }

      delete document.documentElement.dataset.themeTransitioning
    },
    [],
  )

  const toggleTheme = useCallback(() => {
    const nextTheme = themeRef.current === 'light' ? 'dark' : 'light'
    storeThemePreference(nextTheme)
    commitTheme(nextTheme, nextTheme)
  }, [commitTheme])

  const useAutomaticTheme = useCallback(() => {
    const nextTheme = getThemeForDate(new Date())
    storeThemePreference('auto')
    commitTheme(nextTheme, 'auto')
  }, [commitTheme])

  return { theme, preference, toggleTheme, useAutomaticTheme }
}
