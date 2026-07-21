import { useEffect, useState } from 'react'
import {
  getInitialTheme,
  getMillisecondsUntilNextThemeChange,
  getThemeForDate,
  THEME_COLORS,
  type SiteTheme,
} from '../lib/theme'

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[theme])
}

export function useTimeBasedTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    let timeoutId: number | undefined

    const syncTheme = () => {
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId)
      }

      const now = new Date()
      const currentTheme = getThemeForDate(now)

      applyTheme(currentTheme)
      setTheme(currentTheme)
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
  }, [])

  return theme
}
