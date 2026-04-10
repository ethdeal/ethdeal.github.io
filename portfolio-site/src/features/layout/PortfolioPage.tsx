import { useRef } from 'react'
import { ContentFootnote } from '../../components/ui/ContentFootnote'
import { experienceItems, projectCards, sectionIds, siteContent } from '../../content/data'
import { SectionNav } from '../../components/navigation/SectionNav'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useHeroScrollTimeline } from '../../hooks/useHeroScrollTimeline'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { DESKTOP_BREAKPOINT } from '../../lib/theme'
import { ExperienceSection } from '../experience/ExperienceSection'
import { HeroDesktop } from '../hero/HeroDesktop'
import { HeroStatic } from '../hero/HeroStatic'
import { ProjectsSection } from '../projects/ProjectsSection'
import { Sidebar } from '../sidebar/Sidebar'
import styles from './portfolioPage.module.css'

export function PortfolioPage() {
  const isDesktop = useMediaQuery(`(min-width: ${DESKTOP_BREAKPOINT}px)`)
  const prefersReducedMotion = usePrefersReducedMotion()
  const shouldAnimateHero = isDesktop && !prefersReducedMotion

  const aboutStageRef = useRef<HTMLElement>(null)
  const heroOverlayRef = useRef<HTMLDivElement>(null)
  const heroBackdropRef = useRef<HTMLDivElement>(null)
  const heroTopNavRef = useRef<HTMLElement>(null)
  const heroMetaRef = useRef<HTMLDivElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const sidebarTitleAnchorRef = useRef<HTMLParagraphElement>(null)
  const sidebarBodyRef = useRef<HTMLDivElement>(null)

  const activeSection = useActiveSection(sectionIds)

  useHeroScrollTimeline({
    enabled: shouldAnimateHero,
    stageRef: aboutStageRef,
    overlayRef: heroOverlayRef,
    backdropRef: heroBackdropRef,
    topNavRef: heroTopNavRef,
    heroMetaRef,
    heroCopyRef,
    heroTitleRef,
    sidebarTitleAnchorRef,
    sidebarBodyRef,
  })

  if (!isDesktop) {
    return (
      <div className={styles.page}>
        <div className={styles.mobileNavBar}>
          <SectionNav
            items={siteContent.navItems}
            activeSection={activeSection}
            ariaLabel="Primary navigation"
            variant="mobile"
          />
        </div>

        <main className={styles.mobileMain}>
          <HeroStatic
            sectionId="about"
            eyebrow={siteContent.eyebrow}
            intro={siteContent.heroIntro}
            name={siteContent.name}
            paragraphs={siteContent.heroParagraphs}
            socialLinks={siteContent.socialLinks}
          />
          <ExperienceSection items={experienceItems} />
          <ProjectsSection items={projectCards} />
          <ContentFootnote />
        </main>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Sidebar
        activeSection={activeSection}
        animateIn={shouldAnimateHero}
        description={siteContent.sidebarDescription}
        name={siteContent.name}
        navItems={siteContent.navItems}
        socialLinks={siteContent.socialLinks}
        subtitle={siteContent.sidebarSubtitle}
        sidebarTitleAnchorRef={sidebarTitleAnchorRef}
        sidebarBodyRef={sidebarBodyRef}
      />

      <main className={styles.desktopMain}>
        {shouldAnimateHero ? (
          <section
            id="about"
            ref={aboutStageRef}
            className={styles.aboutStage}
            aria-hidden="true"
          />
        ) : (
          <HeroStatic
            sectionId="about"
            className={styles.desktopHeroFallback}
            eyebrow={siteContent.eyebrow}
            intro={siteContent.heroIntro}
            name={siteContent.name}
            paragraphs={siteContent.heroParagraphs}
            socialLinks={siteContent.socialLinks}
          />
        )}

        <div className={styles.desktopContentTrigger}>
          <div className={styles.desktopContent}>
            {/* CONTENT COMPONENTS HERE ============================================= */}
            <ExperienceSection items={experienceItems} />
            <ProjectsSection items={projectCards} />
            <ContentFootnote />
          </div>
        </div>
      </main>

      {shouldAnimateHero ? (
        <HeroDesktop
          activeSection={activeSection}
          intro={siteContent.heroIntro}
          eyebrow={siteContent.eyebrow}
          name={siteContent.name}
          navItems={siteContent.navItems}
          paragraphs={siteContent.heroParagraphs}
          socialLinks={siteContent.socialLinks}
          overlayRef={heroOverlayRef}
          backdropRef={heroBackdropRef}
          topNavRef={heroTopNavRef}
          heroMetaRef={heroMetaRef}
          heroCopyRef={heroCopyRef}
          heroTitleRef={heroTitleRef}
          stageRef={aboutStageRef}
        />
      ) : null}
    </div>
  )
}
