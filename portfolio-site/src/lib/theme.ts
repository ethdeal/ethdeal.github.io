export type SiteTheme = 'light' | 'dark'

const LIGHT_START_HOUR = 6
const DARK_START_HOUR = 21

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

  return initialTheme === 'light' || initialTheme === 'dark'
    ? initialTheme
    : getThemeForDate(new Date())
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
