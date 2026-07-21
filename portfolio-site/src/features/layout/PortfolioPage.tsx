import { useEffect, useRef } from 'react'
import { ContentFootnote } from '../../components/ui/ContentFootnote'
import {
  designCards,
  experienceItems,
  projectCards,
  sectionIds,
  siteContent,
} from '../../content/data'
import { SectionNav } from '../../components/navigation/SectionNav'
import { useActiveSection } from '../../hooks/useActiveSection'
import { useHeroScrollTimeline } from '../../hooks/useHeroScrollTimeline'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { DESKTOP_BREAKPOINT } from '../../lib/theme'
import { DesignSection } from '../design/DesignSection'
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
  const heroSocialsRef = useRef<HTMLDivElement>(null)
  const heroCopyRef = useRef<HTMLDivElement>(null)
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const sidebarTitleAnchorRef = useRef<HTMLParagraphElement>(null)
  const sidebarBodyRef = useRef<HTMLDivElement>(null)
  const desktopContentRef = useRef<HTMLDivElement>(null)

  const activeSection = useActiveSection(sectionIds)
  const resumeHref =
    siteContent.socialLinks.find(({ icon }) => icon === 'resume')?.href ?? ''

  useEffect(() => {
    if (!resumeHref) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const isResumeShortcut =
        event.key.toLowerCase() === 'p' &&
        event.ctrlKey !== event.metaKey &&
        !event.shiftKey &&
        !event.altKey

      if (!isResumeShortcut) {
        return
      }

      event.preventDefault()

      if (!event.repeat) {
        window.open(resumeHref, '_blank', 'noopener,noreferrer')
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [resumeHref])

  useHeroScrollTimeline({
    enabled: shouldAnimateHero,
    stageRef: aboutStageRef,
    overlayRef: heroOverlayRef,
    backdropRef: heroBackdropRef,
    topNavRef: heroTopNavRef,
    heroSocialsRef,
    heroCopyRef,
    heroTitleRef,
    sidebarTitleAnchorRef,
    sidebarBodyRef,
    desktopContentRef,
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
            intro={siteContent.heroIntro}
            name={siteContent.name}
            paragraphs={siteContent.heroParagraphs}
            socialLinks={siteContent.socialLinks}
          />
          <ExperienceSection items={experienceItems} resumeHref={resumeHref} />
          <ProjectsSection items={projectCards} />
          <DesignSection items={designCards} />
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
            intro={siteContent.heroIntro}
            name={siteContent.name}
            paragraphs={siteContent.heroParagraphs}
            socialLinks={siteContent.socialLinks}
          />
        )}

        <div className={styles.desktopContentTrigger}>
          <div ref={desktopContentRef} className={styles.desktopContent}>
            {/* CONTENT COMPONENTS HERE ============================================= */}
            <ExperienceSection items={experienceItems} resumeHref={resumeHref} />
            <ProjectsSection items={projectCards} />
            <DesignSection items={designCards} />
            <ContentFootnote />
          </div>
        </div>
      </main>

      {shouldAnimateHero ? (
        <HeroDesktop
          activeSection={activeSection}
          intro={siteContent.heroIntro}
          name={siteContent.name}
          navItems={siteContent.navItems}
          paragraphs={siteContent.heroParagraphs}
          socialLinks={siteContent.socialLinks}
          overlayRef={heroOverlayRef}
          backdropRef={heroBackdropRef}
          topNavRef={heroTopNavRef}
          heroSocialsRef={heroSocialsRef}
          heroCopyRef={heroCopyRef}
          heroTitleRef={heroTitleRef}
          stageRef={aboutStageRef}
        />
      ) : null}
    </div>
  )
}
