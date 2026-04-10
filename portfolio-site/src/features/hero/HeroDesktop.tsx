import type { RefObject } from 'react'
import type { NavItem, SocialLink } from '../../content/types'
import { SectionNav } from '../../components/navigation/SectionNav'
import { SocialLinks } from '../../components/ui/SocialLinks'
import { HeroScrollCue } from './HeroScrollCue'
import styles from './hero.module.css'

const HERO_SCROLL_CUE_ENABLED = false

interface HeroDesktopProps {
  activeSection: string
  intro: string
  eyebrow: string
  name: string
  navItems: NavItem[]
  paragraphs: string[]
  socialLinks: SocialLink[]
  overlayRef: RefObject<HTMLDivElement | null>
  backdropRef: RefObject<HTMLDivElement | null>
  topNavRef: RefObject<HTMLElement | null>
  heroMetaRef: RefObject<HTMLDivElement | null>
  heroCopyRef: RefObject<HTMLDivElement | null>
  heroTitleRef: RefObject<HTMLHeadingElement | null>
  stageRef: RefObject<HTMLElement | null>
}

export function HeroDesktop({
  activeSection,
  intro,
  eyebrow,
  name,
  navItems,
  paragraphs,
  socialLinks,
  overlayRef,
  backdropRef,
  topNavRef,
  heroMetaRef,
  heroCopyRef,
  heroTitleRef,
  stageRef,
}: HeroDesktopProps) {
  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div ref={backdropRef} className={styles.backdrop} />

      <header className={styles.topBar} ref={topNavRef}>
        <SectionNav
          items={navItems}
          activeSection={activeSection}
          ariaLabel="Hero navigation"
          variant="hero"
        />
      </header>

      <div className={styles.desktopGrid}>
        <div className={styles.heroStack}>
          <div className={styles.heroBody}>
            <div className={styles.titleColumn}>
              <div ref={heroMetaRef} className={styles.heroMeta}>
                <SocialLinks links={socialLinks} variant="hero" />
                <p className={styles.heroEyebrow}>{eyebrow}</p>
              </div>

              <div className={styles.titleSlot}>
                <h1 ref={heroTitleRef} className={styles.heroTitle}>
                  {name}
                </h1>
              </div>
            </div>

            <div ref={heroCopyRef} className={styles.heroCopy}>
              <p className={styles.heroIntro}>{intro}</p>
              {paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {HERO_SCROLL_CUE_ENABLED ? <HeroScrollCue stageRef={stageRef} /> : null}
    </div>
  )
}
