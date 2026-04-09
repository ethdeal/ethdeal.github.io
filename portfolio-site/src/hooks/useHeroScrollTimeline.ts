import { useLayoutEffect } from 'react'
import type { RefObject } from 'react'
import { ensureGsapPlugins, gsap, ScrollTrigger } from '../lib/gsap'

const HERO_TITLE_START = 0.04
const HERO_TITLE_DURATION = 0.3
const HERO_TITLE_END = HERO_TITLE_START + HERO_TITLE_DURATION
const SIDEBAR_BODY_MOVE_START = 0.07
// Keep the sidebar body locked to the title handoff end so both settle together.
const SIDEBAR_BODY_MOVE_DURATION = HERO_TITLE_END - SIDEBAR_BODY_MOVE_START

const HERO_EXIT_TWEENS = {
  topNav: {
    start: 0.15,
    autoAlpha: 0,
    y: -18,
    duration: 0.05,
  },
  // Tune these values to change how quickly the hero eyebrow/socials clear out.
  heroMeta: {
    start: 0.04, // 0.02
    autoAlpha: 0,
    y: -156, // -40
    duration: 0.14,
  },
  // Tune these values to change how quickly the intro/body copy gets out of the way.
  heroCopy: {
    start: 0.04, // 0.05
    autoAlpha: 0,
    y: -156, // -56
    duration: 0.16,
  },
  backdrop: {
    start: 0.1,
    autoAlpha: 0,
    duration: 0.12,
  },
} as const

interface UseHeroScrollTimelineOptions {
  enabled: boolean
  stageRef: RefObject<HTMLElement | null>
  overlayRef: RefObject<HTMLDivElement | null>
  backdropRef: RefObject<HTMLDivElement | null>
  topNavRef: RefObject<HTMLElement | null>
  heroMetaRef: RefObject<HTMLDivElement | null>
  heroCopyRef: RefObject<HTMLDivElement | null>
  heroTitleRef: RefObject<HTMLHeadingElement | null>
  sidebarTitleAnchorRef: RefObject<HTMLParagraphElement | null>
  sidebarBodyRef: RefObject<HTMLDivElement | null>
}

export function useHeroScrollTimeline({
  enabled,
  stageRef,
  overlayRef,
  backdropRef,
  topNavRef,
  heroMetaRef,
  heroCopyRef,
  heroTitleRef,
  sidebarTitleAnchorRef,
  sidebarBodyRef,
}: UseHeroScrollTimelineOptions) {
  useLayoutEffect(() => {
    const stage = stageRef.current
    const overlay = overlayRef.current
    const backdrop = backdropRef.current
    const topNav = topNavRef.current
    const heroMeta = heroMetaRef.current
    const heroCopy = heroCopyRef.current
    const heroTitle = heroTitleRef.current
    const sidebarTitleAnchor = sidebarTitleAnchorRef.current
    const sidebarBody = sidebarBodyRef.current

    if (
      !stage ||
      !overlay ||
      !backdrop ||
      !topNav ||
      !heroMeta ||
      !heroCopy ||
      !heroTitle ||
      !sidebarTitleAnchor ||
      !sidebarBody
    ) {
      return undefined
    }

    if (!enabled) {
      gsap.set(overlay, { autoAlpha: 0 })
      gsap.set(backdrop, { autoAlpha: 0 })
      gsap.set(sidebarBody, { y: 0 })
      return undefined
    }

    ensureGsapPlugins()

    let timeline: gsap.core.Timeline | null = null
    let refreshFrame = 0

    const context = gsap.context(() => {
      const syncTimelineToCurrentScroll = () => {
        if (!timeline) {
          return
        }

        timeline.scrollTrigger?.update()
        timeline.progress(timeline.scrollTrigger?.progress ?? 0)
      }

      const resetMeasuredElements = () => {
        gsap.set(overlay, { autoAlpha: 1 })
        gsap.set(backdrop, { autoAlpha: 1 })
        gsap.set(topNav, { autoAlpha: 1, y: 0 })
        gsap.set(heroMeta, { autoAlpha: 1, y: 0 })
        gsap.set(heroCopy, { autoAlpha: 1, y: 0 })
        gsap.set(heroTitle, {
          x: 0,
          y: 0,
          scale: 1,
          transformOrigin: 'left top',
          force3D: true,
        })
        gsap.set(sidebarBody, {
          y: 0,
          force3D: true,
        })
      }

      const scheduleRefresh = () => {
        window.cancelAnimationFrame(refreshFrame)
        refreshFrame = window.requestAnimationFrame(() => {
          ScrollTrigger.refresh()
        })
      }

      const buildTimeline = () => {
        timeline?.scrollTrigger?.kill()
        timeline?.kill()

        resetMeasuredElements()

        const heroBounds = heroTitle.getBoundingClientRect()
        const sidebarBounds = sidebarTitleAnchor.getBoundingClientRect()
        const sidebarBodyBounds = sidebarBody.getBoundingClientRect()

        if (
          !heroBounds.width ||
          !sidebarBounds.width ||
          !sidebarBodyBounds.height
        ) {
          return
        }

        const deltaX = sidebarBounds.left - heroBounds.left
        const deltaY = sidebarBounds.top - heroBounds.top
        const scale = sidebarBounds.width / heroBounds.width
        // This is the main left-sidebar handoff distance to tweak if the body starts too low/high.
        const sidebarBodyStartY = Math.max(
          window.innerHeight - sidebarBodyBounds.top + 0,
          620,
        )

        gsap.set(sidebarBody, {
          y: sidebarBodyStartY,
          force3D: true,
        })

        timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        const addExitTween = (
          target: Element,
          config: (typeof HERO_EXIT_TWEENS)[keyof typeof HERO_EXIT_TWEENS],
        ) => {
          const { start, ...vars } = config
          timeline?.to(target, vars, start)
        }

        addExitTween(topNav, HERO_EXIT_TWEENS.topNav)
        addExitTween(heroMeta, HERO_EXIT_TWEENS.heroMeta)
        addExitTween(heroCopy, HERO_EXIT_TWEENS.heroCopy)
        addExitTween(backdrop, HERO_EXIT_TWEENS.backdrop)

        timeline
          .fromTo(
            sidebarBody,
            {
              y: sidebarBodyStartY,
            },
            {
              y: 0,
              duration: SIDEBAR_BODY_MOVE_DURATION,
            },
            SIDEBAR_BODY_MOVE_START,
          )
          .to(
            heroTitle,
            {
              x: deltaX,
              y: deltaY,
              scale,
              duration: HERO_TITLE_DURATION,
            },
            HERO_TITLE_START,
          )
        syncTimelineToCurrentScroll()
      }

      buildTimeline()
      ScrollTrigger.addEventListener('refreshInit', buildTimeline)

      const resizeObserver =
        typeof ResizeObserver !== 'undefined'
          ? new ResizeObserver(() => {
              scheduleRefresh()
            })
          : null

      resizeObserver?.observe(heroTitle)
      resizeObserver?.observe(sidebarTitleAnchor)
      resizeObserver?.observe(sidebarBody)

      window.addEventListener('resize', scheduleRefresh)

      return () => {
        ScrollTrigger.removeEventListener('refreshInit', buildTimeline)
        window.removeEventListener('resize', scheduleRefresh)
        window.cancelAnimationFrame(refreshFrame)
        resizeObserver?.disconnect()
        timeline?.scrollTrigger?.kill()
        timeline?.kill()
      }
    }, stage)

    return () => {
      context.revert()
    }
  }, [
    enabled,
    stageRef,
    overlayRef,
    backdropRef,
    topNavRef,
    heroMetaRef,
    heroCopyRef,
    heroTitleRef,
    sidebarTitleAnchorRef,
    sidebarBodyRef,
  ])
}
