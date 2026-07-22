export type SiteTheme = 'light' | 'dark'
export type ThemePreference = 'auto' | SiteTheme

const LIGHT_START_HOUR = Number(document.documentElement.dataset.lightStart)
const DARK_START_HOUR = Number(document.documentElement.dataset.darkStart)

export const THEME_STORAGE_KEY = 'portfolio-theme'
export const THEME_TRANSITION_DURATION = 280

export const THEME_COLORS: Record<SiteTheme, string> = {
  light: '#f8f8f8',
  dark: '#040711',
}

export function getThemeForDate(date: Date): SiteTheme {
  const hour = date.getHours()

  return hour >= DARK_START_HOUR || hour < LIGHT_START_HOUR ? 'dark' : 'light'
}

export function getInitialTheme(): SiteTheme {
  const initialTheme = document.documentElement.dataset.theme

  if (initialTheme === 'light' || initialTheme === 'dark') {
    return initialTheme
  }

  const preference = getInitialThemePreference()

  return preference === 'auto' ? getThemeForDate(new Date()) : preference
}

export function getStoredThemePreference(): ThemePreference {
  try {
    const preference = localStorage.getItem(THEME_STORAGE_KEY)

    return preference === 'light' || preference === 'dark'
      ? preference
      : 'auto'
  } catch {
    return 'auto'
  }
}

export function getInitialThemePreference(): ThemePreference {
  const preference = document.documentElement.dataset.themePreference

  return preference === 'auto' || preference === 'light' || preference === 'dark'
    ? preference
    : getStoredThemePreference()
}

export function storeThemePreference(preference: ThemePreference) {
  try {
    if (preference === 'auto') {
      localStorage.removeItem(THEME_STORAGE_KEY)
    } else {
      localStorage.setItem(THEME_STORAGE_KEY, preference)
    }
  } catch {
    // Keep the preference for this session when storage is unavailable.
  }
}

export function getMillisecondsUntilNextThemeChange(date: Date): number {
  const nextChange = new Date(date)
  const hour = date.getHours()

  if (hour < LIGHT_START_HOUR) {
    nextChange.setHours(LIGHT_START_HOUR, 0, 0, 0)
  } else if (hour < DARK_START_HOUR) {
    nextChange.setHours(DARK_START_HOUR, 0, 0, 0)
  } else {
    nextChange.setDate(nextChange.getDate() + 1)
    nextChange.setHours(LIGHT_START_HOUR, 0, 0, 0)
  }

  return nextChange.getTime() - date.getTime()
}

export const DESKTOP_BREAKPOINT = 960
