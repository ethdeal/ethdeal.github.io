import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent, PointerEvent } from 'react'
import type { SiteTheme, ThemePreference } from '../../lib/theme'
import styles from './ThemeToggle.module.css'

const HOLD_DURATION = 700

interface ThemeToggleProps {
  theme: SiteTheme
  preference: ThemePreference
  hidden: boolean
  onToggle: () => void
  onUseAutomaticTheme: () => void
}

function SunIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={[styles.icon, active ? styles.iconActive : ''].join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4" />
    </svg>
  )
}

function MoonIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={[styles.icon, active ? styles.iconActive : ''].join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M20.3 15.2A8.4 8.4 0 0 1 8.8 3.7 8.4 8.4 0 1 0 20.3 15.2Z" />
    </svg>
  )
}

export function ThemeToggle({
  theme,
  preference,
  hidden,
  onToggle,
  onUseAutomaticTheme,
}: ThemeToggleProps) {
  const holdTimeoutRef = useRef<number | undefined>(undefined)
  const suppressClickRef = useRef(false)
  const keyboardHoldRef = useRef(false)
  const [announcement, setAnnouncement] = useState('')
  const isAutomatic = preference === 'auto'
  const nextTheme = theme === 'light' ? 'night' : 'day'
  const title = isAutomatic ? 'Theme (automatic) ' : 'Theme (hold for automatic)'

  const clearHold = () => {
    if (holdTimeoutRef.current !== undefined) {
      window.clearTimeout(holdTimeoutRef.current)
      holdTimeoutRef.current = undefined
    }
  }

  const beginHold = () => {
    clearHold()
    suppressClickRef.current = false
    holdTimeoutRef.current = window.setTimeout(() => {
      holdTimeoutRef.current = undefined
      suppressClickRef.current = true
      onUseAutomaticTheme()
      setAnnouncement('Automatic theme schedule restored.')
    }, HOLD_DURATION)
  }

  useEffect(
    () => () => {
      clearHold()
    },
  )

  const handlePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return
    }

    event.currentTarget.setPointerCapture?.(event.pointerId)
    beginHold()
  }

  const handleClick = () => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false
      return
    }

    onToggle()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat) {
      return
    }

    event.preventDefault()
    keyboardHoldRef.current = true
    beginHold()
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (
      (event.key !== ' ' && event.key !== 'Enter') ||
      !keyboardHoldRef.current
    ) {
      return
    }

    event.preventDefault()
    keyboardHoldRef.current = false
    clearHold()

    if (suppressClickRef.current) {
      suppressClickRef.current = false
    } else {
      onToggle()
    }
  }

  return (
    <div
      className={[styles.root, hidden ? styles.rootHidden : ''].join(' ')}
      aria-hidden={hidden || undefined}
    >
      <button
        className={styles.control}
        type="button"
        tabIndex={hidden ? -1 : 0}
        aria-label={`Switch to ${nextTheme} theme`}
        title={title}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerUp={clearHold}
        onPointerCancel={clearHold}
        onPointerLeave={clearHold}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onBlur={() => {
          keyboardHoldRef.current = false
          clearHold()
        }}
      >
        <span className={styles.icons}>
          <SunIcon active={theme === 'light'} />
          <MoonIcon active={theme === 'dark'} />
        </span>
      </button>

      <span className="visually-hidden" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
