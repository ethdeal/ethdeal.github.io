function getDocumentOffsetTop(element: HTMLElement) {
  let top = 0
  let current: HTMLElement | null = element

  while (current) {
    top += current.offsetTop
    current =
      current.offsetParent instanceof HTMLElement ? current.offsetParent : null
  }

  return top
}

function getScrollMarginTop(element: HTMLElement) {
  const scrollMarginTop = window.getComputedStyle(element).scrollMarginTop
  const parsed = Number.parseFloat(scrollMarginTop)

  return Number.isFinite(parsed) ? parsed : 0
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function scrollToHashTarget(href: string) {
  const targetId = href.replace(/^#/, '')
  const target = document.getElementById(targetId)

  if (!target) {
    return false
  }

  const top = Math.max(
    getDocumentOffsetTop(target) - getScrollMarginTop(target),
    0,
  )

  window.history.pushState(null, '', `#${targetId}`)
  window.scrollTo({
    top,
    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
  })

  return true
}
