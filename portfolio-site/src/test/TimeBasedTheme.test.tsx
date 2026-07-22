import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeBasedTheme } from '../hooks/useTimeBasedTheme'
import {
  getMillisecondsUntilNextThemeChange,
  getStoredThemePreference,
  getThemeForDate,
  THEME_COLORS,
  THEME_STORAGE_KEY,
} from '../lib/theme'

const LIGHT_START = Number(document.documentElement.dataset.lightStart)
const DARK_START = Number(document.documentElement.dataset.darkStart)

function dateAt(hour: number, minute = 0, second = 0) {
  return new Date(2026, 0, 1, hour, minute, second)
}

function ThemeProbe() {
  const { theme, preference, toggleTheme, useAutomaticTheme } =
    useTimeBasedTheme()

  return (
    <>
      <output data-testid="theme">{theme}</output>
      <output data-testid="preference">{preference}</output>
      <button type="button" onClick={toggleTheme}>
        Toggle theme
      </button>
      <button type="button" onClick={useAutomaticTheme}>
        Use automatic theme
      </button>
    </>
  )
}

describe('time-based theme', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    localStorage.clear()
    document.documentElement.dataset.theme = 'light'
    document.documentElement.dataset.themePreference = 'auto'

    const themeColor = document.createElement('meta')
    themeColor.name = 'theme-color'
    document.head.append(themeColor)
  })

  afterEach(() => {
    document.querySelector('meta[name="theme-color"]')?.remove()
    delete document.documentElement.dataset.theme
    delete document.documentElement.dataset.themePreference
    delete document.documentElement.dataset.themeTransitioning
    localStorage.clear()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('resolves the configured schedule boundaries', () => {
    expect(getThemeForDate(dateAt(LIGHT_START, 0))).toBe('light')
    expect(getThemeForDate(dateAt(DARK_START, 0))).toBe('dark')
    expect(getThemeForDate(dateAt(LIGHT_START - 1, 59))).toBe('dark')
    expect(getThemeForDate(dateAt(DARK_START - 1, 59))).toBe('light')
  })

  it('schedules each automatic change for the next configured boundary', () => {
    for (const now of [
      dateAt(LIGHT_START - 1, 59, 59),
      dateAt(LIGHT_START),
      dateAt(DARK_START - 1, 59, 59),
      dateAt(DARK_START),
    ]) {
      const nextChange = new Date(
        now.getTime() + getMillisecondsUntilNextThemeChange(now),
      )

      expect(nextChange.getTime()).toBeGreaterThan(now.getTime())
      expect([LIGHT_START, DARK_START]).toContain(nextChange.getHours())
      expect(nextChange.getMinutes()).toBe(0)
      expect(nextChange.getSeconds()).toBe(0)
    }
  })

  it('switches at the next threshold and updates the browser theme color', () => {
    vi.setSystemTime(dateAt(DARK_START - 1, 59, 59))
    render(<ThemeProbe />)

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      THEME_COLORS.dark,
    )
  })

  it('starts from a stored override without scheduling an automatic change', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    delete document.documentElement.dataset.theme
    delete document.documentElement.dataset.themePreference
    vi.setSystemTime(dateAt(LIGHT_START + 1))

    render(<ThemeProbe />)

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('preference')).toHaveTextContent('dark')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('falls back to automatic mode for invalid or unavailable storage', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'invalid')
    expect(getStoredThemePreference()).toBe('auto')

    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(getStoredThemePreference()).toBe('auto')
  })

  it('persists toggles and keeps the override fixed across schedule changes', () => {
    vi.setSystemTime(dateAt(LIGHT_START + 1))
    render(<ThemeProbe />)

    fireEvent.click(screen.getByRole('button', { name: 'Toggle theme' }))

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(screen.getByTestId('preference')).toHaveTextContent('dark')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    act(() => {
      vi.setSystemTime(dateAt(LIGHT_START + 2))
      vi.advanceTimersByTime(24 * 60 * 60 * 1000)
    })

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  })

  it('clears an override and immediately resumes automatic scheduling', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark')
    document.documentElement.dataset.theme = 'dark'
    document.documentElement.dataset.themePreference = 'dark'
    vi.setSystemTime(dateAt(LIGHT_START + 1))
    render(<ThemeProbe />)

    fireEvent.click(
      screen.getByRole('button', { name: 'Use automatic theme' }),
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(screen.getByTestId('preference')).toHaveTextContent('auto')
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull()
    expect(document.documentElement).toHaveAttribute(
      'data-theme-preference',
      'auto',
    )
  })

  it.each(['focus', 'visibilitychange'])(
    'corrects a missed automatic threshold on %s',
    (eventName) => {
      vi.setSystemTime(dateAt(DARK_START - 1))
      render(<ThemeProbe />)

      vi.setSystemTime(dateAt(DARK_START + 1))

      act(() => {
        const target = eventName === 'focus' ? window : document
        target.dispatchEvent(new Event(eventName))
      })

      expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    },
  )

  it('clears its scheduled change when unmounted', () => {
    vi.setSystemTime(dateAt(LIGHT_START + 1))
    const { unmount } = render(<ThemeProbe />)

    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
