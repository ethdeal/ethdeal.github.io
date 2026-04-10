import type { MouseEvent } from 'react'
import type { NavItem } from '../../content/types'
import { scrollToHashTarget } from '../../lib/scrollToHashTarget'
import styles from './SectionNav.module.css'

interface SectionNavProps {
  items: NavItem[]
  activeSection: string
  ariaLabel: string
  variant: 'hero' | 'sidebar' | 'mobile'
}

export function SectionNav({
  items,
  activeSection,
  ariaLabel,
  variant,
}: SectionNavProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return
    }

    const targetId = href.slice(1)
    const target = document.getElementById(targetId)

    if (!target) {
      return
    }

    event.preventDefault()
    scrollToHashTarget(href)
  }

  return (
    <nav
      className={[styles.nav, styles[variant]].join(' ')}
      aria-label={ariaLabel}
    >
      <ul className={styles.list}>
        {items.map((item) => {
          const sectionId = item.href.replace('#', '')
          const isCurrent = activeSection === sectionId

          return (
            <li key={item.href} className={styles.item}>
              <a
                href={item.href}
                onClick={(event) => handleClick(event, item.href)}
                aria-current={isCurrent ? 'page' : undefined}
                className={[
                  styles.link,
                  isCurrent ? styles.current : '',
                ].join(' ')}
              >
                {item.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
