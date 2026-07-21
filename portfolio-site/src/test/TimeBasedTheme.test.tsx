import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTimeBasedTheme } from '../hooks/useTimeBasedTheme'
import {
  getMillisecondsUntilNextThemeChange,
  getThemeForDate,
} from '../lib/theme'

function ThemeProbe() {
  const theme = useTimeBasedTheme()

  return <output>{theme}</output>
}

describe('time-based theme', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.documentElement.dataset.theme = 'light'

    const themeColor = document.createElement('meta')
    themeColor.name = 'theme-color'
    document.head.append(themeColor)
  })

  afterEach(() => {
    document.querySelector('meta[name="theme-color"]')?.remove()
    delete document.documentElement.dataset.theme
    vi.useRealTimers()
  })

  it.each([
    [new Date(2026, 0, 1, 5, 59), 'dark'],
    [new Date(2026, 0, 1, 6, 0), 'light'],
    [new Date(2026, 0, 1, 20, 59), 'light'],
    [new Date(2026, 0, 1, 21, 0), 'dark'],
  ])('resolves %s as %s', (date, expectedTheme) => {
    expect(getThemeForDate(date)).toBe(expectedTheme)
  })

  it.each([
    [new Date(2026, 0, 1, 5, 59, 59), 6],
    [new Date(2026, 0, 1, 6, 0), 21],
    [new Date(2026, 0, 1, 20, 59, 59), 21],
    [new Date(2026, 0, 1, 21, 0), 6],
  ])('schedules the next change after %s for %i:00', (date, nextHour) => {
    const nextChange = new Date(
      date.getTime() + getMillisecondsUntilNextThemeChange(date),
    )

    expect(nextChange.getHours()).toBe(nextHour)
    expect(nextChange.getMinutes()).toBe(0)
    expect(nextChange.getSeconds()).toBe(0)
    expect(nextChange.getTime()).toBeGreaterThan(date.getTime())
  })

  it('switches at the next threshold and updates the browser theme color', () => {
    vi.setSystemTime(new Date(2026, 0, 1, 20, 59, 59))
    render(<ThemeProbe />)

    expect(screen.getByText('light')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(screen.getByText('dark')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    expect(document.querySelector('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#040711',
    )
  })

  it.each(['focus', 'visibilitychange'])(
    'corrects a missed threshold on %s',
    (eventName) => {
      vi.setSystemTime(new Date(2026, 0, 1, 20, 0))
      render(<ThemeProbe />)

      vi.setSystemTime(new Date(2026, 0, 1, 22, 0))

      act(() => {
        const target = eventName === 'focus' ? window : document
        target.dispatchEvent(new Event(eventName))
      })

      expect(screen.getByText('dark')).toBeInTheDocument()
      expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
    },
  )

  it('clears its scheduled change when unmounted', () => {
    vi.setSystemTime(new Date(2026, 0, 1, 12, 0))
    const { unmount } = render(<ThemeProbe />)

    expect(vi.getTimerCount()).toBe(1)

    unmount()

    expect(vi.getTimerCount()).toBe(0)
  })
})
