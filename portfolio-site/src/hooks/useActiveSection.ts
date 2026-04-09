import { useEffect, useMemo, useState } from 'react'

const VIEWPORT_ANCHOR = 0.35

function getScrollMarginTop(element: HTMLElement) {
  const scrollMarginTop = window.getComputedStyle(element).scrollMarginTop
  const parsed = Number.parseFloat(scrollMarginTop)

  return Number.isFinite(parsed) ? parsed : 0
}

export function useActiveSection(ids: string[]) {
  const stableIds = useMemo(() => ids.filter(Boolean), [ids])
  const [activeSection, setActiveSection] = useState(() => stableIds[0] ?? '')

  useEffect(() => {
    if (!stableIds.length) {
      return undefined
    }

    let frame = 0

    const updateActiveSection = () => {
      const elements = stableIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)

      if (!elements.length) {
        return
      }

      const anchorTop = window.innerHeight * VIEWPORT_ANCHOR
      let nextActiveSection = elements[0].id

      elements.forEach((element) => {
        const sectionTop =
          element.getBoundingClientRect().top - getScrollMarginTop(element)

        if (sectionTop <= anchorTop) {
          nextActiveSection = element.id
        }
      })

      setActiveSection((currentSection) =>
        currentSection === nextActiveSection
          ? currentSection
          : nextActiveSection,
      )
    }

    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [stableIds])

  return activeSection
}
