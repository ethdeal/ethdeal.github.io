import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SectionNav } from '../components/navigation/SectionNav'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('SectionNav', () => {
  it('uses one shared scroll target calculation for section links', async () => {
    const user = userEvent.setup()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const target = document.createElement('section')
    const originalGetComputedStyle = window.getComputedStyle.bind(window)

    target.id = 'projects'
    document.body.appendChild(target)

    Object.defineProperty(target, 'offsetTop', {
      configurable: true,
      value: 640,
    })

    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const computedStyle = originalGetComputedStyle(element)

      if (element !== target) {
        return computedStyle
      }

      return new Proxy(computedStyle, {
        get(style, property, receiver) {
          if (property === 'scrollMarginTop') {
            return '96px'
          }

          if (property === 'getPropertyValue') {
            return (name: string) =>
              name === 'scroll-margin-top'
                ? '96px'
                : computedStyle.getPropertyValue(name)
          }

          return Reflect.get(style, property, receiver)
        },
      }) as CSSStyleDeclaration
    })

    render(
      <SectionNav
        items={[
          { label: 'About', href: '#about' },
          { label: 'Projects', href: '#projects' },
        ]}
        activeSection="about"
        ariaLabel="Primary navigation"
        variant="hero"
      />,
    )

    await user.click(screen.getByRole('link', { name: 'Projects' }))

    expect(scrollToSpy).toHaveBeenCalledWith({
      top: 544,
      behavior: 'smooth',
    })
    expect(window.location.hash).toBe('#projects')
  })
})
