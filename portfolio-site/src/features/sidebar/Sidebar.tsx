import type { RefObject } from 'react'
import type { NavItem, SocialLink } from '../../content/types'
import { SectionNav } from '../../components/navigation/SectionNav'
import { SocialLinks } from '../../components/ui/SocialLinks'
import styles from './sidebar.module.css'

interface SidebarProps {
  activeSection: string
  animateIn: boolean
  description: string
  name: string
  navItems: NavItem[]
  socialLinks: SocialLink[]
  subtitle: string
  sidebarTitleAnchorRef: RefObject<HTMLParagraphElement | null>
  sidebarBodyRef: RefObject<HTMLDivElement | null>
}

export function Sidebar({
  activeSection,
  animateIn,
  description,
  name,
  navItems,
  socialLinks,
  subtitle,
  sidebarTitleAnchorRef,
  sidebarBodyRef,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.frame}>
        <div className={styles.titleSlot}>
          <p
            ref={sidebarTitleAnchorRef}
            className={styles.nameAnchor}
            data-animated={animateIn ? 'true' : 'false'}
            aria-hidden={animateIn || undefined}
          >
            {name}
          </p>
        </div>

        <div ref={sidebarBodyRef} className={styles.supporting}>
          <header className={styles.intro}>
            <p className={styles.subtitle}>{subtitle}</p>
            <p className={styles.description}>{description}</p>
          </header>

          <SectionNav
            items={navItems}
            activeSection={activeSection}
            ariaLabel="Section navigation"
            variant="sidebar"
          />

          <footer className={styles.footer}>
            <SocialLinks links={socialLinks} variant="sidebar" />
          </footer>
        </div>
      </div>
    </aside>
  )
}
