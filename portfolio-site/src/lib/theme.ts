export type SiteTheme = 'light' | 'dark'

export const SITE_THEME: SiteTheme =
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
export const DESKTOP_BREAKPOINT = 960
