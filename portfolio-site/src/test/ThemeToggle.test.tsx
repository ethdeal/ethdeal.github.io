import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ThemeToggle } from '../components/ui/ThemeToggle'

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses a short activation to toggle the theme', () => {
    const onToggle = vi.fn()
    const onUseAutomaticTheme = vi.fn()
    render(
      <ThemeToggle
        theme="light"
        preference="auto"
        hidden={false}
        onToggle={onToggle}
        onUseAutomaticTheme={onUseAutomaticTheme}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /theme/i }))

    expect(onToggle).toHaveBeenCalledOnce()
    expect(onUseAutomaticTheme).not.toHaveBeenCalled()
  })

  it.each([
    ['pointer', 'pointerdown', 'pointerup'],
    ['keyboard', 'keydown', 'keyup'],
  ])('uses a completed %s hold to restore automatic mode', (_type, down, up) => {
    const onToggle = vi.fn()
    const onUseAutomaticTheme = vi.fn()
    render(
      <ThemeToggle
        theme="dark"
        preference="dark"
        hidden={false}
        onToggle={onToggle}
        onUseAutomaticTheme={onUseAutomaticTheme}
      />,
    )
    const button = screen.getByRole('button', { name: /theme/i })

    if (down === 'pointerdown') {
      fireEvent.pointerDown(button, { button: 0, pointerId: 1 })
    } else {
      fireEvent.keyDown(button, { key: ' ' })
    }

    expect(button).toHaveAttribute('data-holding', 'true')

    act(() => {
      vi.runOnlyPendingTimers()
    })

    expect(button).not.toHaveAttribute('data-holding')

    if (up === 'pointerup') {
      fireEvent.pointerUp(button, { button: 0, pointerId: 1 })
      fireEvent.click(button)
    } else {
      fireEvent.keyUp(button, { key: ' ' })
    }

    expect(onUseAutomaticTheme).toHaveBeenCalledOnce()
    expect(onToggle).not.toHaveBeenCalled()
  })

  it('removes the control from interaction while the music details are open', () => {
    const { rerender } = render(
      <ThemeToggle
        theme="light"
        preference="auto"
        hidden={false}
        onToggle={vi.fn()}
        onUseAutomaticTheme={vi.fn()}
      />,
    )
    const button = screen.getByRole('button', { name: /theme/i })

    expect(button).toHaveAttribute('tabindex', '0')

    rerender(
      <ThemeToggle
        theme="light"
        preference="auto"
        hidden
        onToggle={vi.fn()}
        onUseAutomaticTheme={vi.fn()}
      />,
    )

    expect(button).toHaveAttribute('tabindex', '-1')
    expect(button.parentElement).toHaveAttribute('aria-hidden', 'true')
  })
})
