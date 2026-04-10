import type { RefObject } from 'react'
import { useHeroScrollCue } from '../../hooks/useHeroScrollCue'
import { scrollToHashTarget } from '../../lib/scrollToHashTarget'
import styles from './hero.module.css'

interface HeroScrollCueProps {
  stageRef: RefObject<HTMLElement | null>
}

export function HeroScrollCue({ stageRef }: HeroScrollCueProps) {
  const { status, dismissWithFade } = useHeroScrollCue(stageRef)

  if (status === 'dismissed') {
    return null
  }

  const handleClick = () => {
    dismissWithFade()
    scrollToHashTarget('#experience')
  }

  const stateClassName =
    status === 'visible'
      ? styles.scrollCueVisible
      : status === 'fading'
        ? styles.scrollCueFading
        : styles.scrollCueHidden

  return (
    <button
      type="button"
      aria-label="Scroll to experience"
      aria-hidden={status !== 'visible' || undefined}
      className={[styles.scrollCue, stateClassName].join(' ')}
      onClick={handleClick}
      tabIndex={status === 'visible' ? 0 : -1}
    >
      <span aria-hidden="true" className={styles.scrollCueArrow} />
      {/* <span className={styles.scrollCueLabel}>SCROLL</span> */}
    </button>
  )
}
