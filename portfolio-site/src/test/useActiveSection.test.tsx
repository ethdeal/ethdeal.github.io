import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useActiveSection } from '../hooks/useActiveSection'

const mockState = vi.hoisted(() => ({
  positions: {
    about: 0,
    experience: 560,
    projects: 1120,
  },
}))

function getMockRect(id: keyof typeof mockState.positions) {
  const top = mockState.positions[id]

  return {
    top,
    left: 0,
    width: 100,
    height: 240,
    right: 100,
    bottom: top + 240,
    x: 0,
    y: top,
    toJSON: () => '',
  }
}

function bindRect(
  node: HTMLElement | null,
  id: keyof typeof mockState.positions,
) {
  if (!node) {
    return
  }

  Object.defineProperty(node, 'getBoundingClientRect', {
    configurable: true,
    value: () => getMockRect(id),
  })
}

function ActiveSectionHarness() {
  const activeSection = useActiveSection(['about', 'experience', 'projects'])

  return (
    <>
      <section
        id="about"
        ref={(node) => bindRect(node, 'about')}
        style={{ scrollMarginTop: '0px' }}
      />
      <section
        id="experience"
        ref={(node) => bindRect(node, 'experience')}
        style={{ scrollMarginTop: '96px' }}
      />
      <section
        id="projects"
        ref={(node) => bindRect(node, 'projects')}
        style={{ scrollMarginTop: '96px' }}
      />
      <output data-testid="active-section">{activeSection}</output>
    </>
  )
}

describe('useActiveSection', () => {
  beforeEach(() => {
    mockState.positions.about = 0
    mockState.positions.experience = 560
    mockState.positions.projects = 1120

    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 1000,
    })

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('tracks the section closest to the viewport anchor while scrolling', () => {
    render(<ActiveSectionHarness />)

    expect(screen.getByTestId('active-section')).toHaveTextContent('about')

    act(() => {
      mockState.positions.about = -640
      mockState.positions.experience = 420
      mockState.positions.projects = 980
      window.dispatchEvent(new Event('scroll'))
    })

    expect(screen.getByTestId('active-section')).toHaveTextContent(
      'experience',
    )

    act(() => {
      mockState.positions.about = -1180
      mockState.positions.experience = -120
      mockState.positions.projects = 360
      window.dispatchEvent(new Event('scroll'))
    })

    expect(screen.getByTestId('active-section')).toHaveTextContent('projects')
  })

  it('re-resolves section elements after a layout swap and resize', () => {
    function LayoutSwapHarness({ mobile }: { mobile: boolean }) {
      const activeSection = useActiveSection(['about', 'experience', 'projects'])

      if (mobile) {
        return (
          <>
            <section
              key="mobile-about"
              id="about"
              ref={(node) => bindRect(node, 'about')}
              style={{ scrollMarginTop: '0px' }}
            />
            <section
              key="mobile-experience"
              id="experience"
              ref={(node) => bindRect(node, 'experience')}
              style={{ scrollMarginTop: '96px' }}
            />
            <section
              key="mobile-projects"
              id="projects"
              ref={(node) => bindRect(node, 'projects')}
              style={{ scrollMarginTop: '96px' }}
            />
            <output data-testid="active-section">{activeSection}</output>
          </>
        )
      }

      return (
        <>
          <section
            key="desktop-about"
            id="about"
            ref={(node) => bindRect(node, 'about')}
            style={{ scrollMarginTop: '0px' }}
          />
          <section
            key="desktop-experience"
            id="experience"
            ref={(node) => bindRect(node, 'experience')}
            style={{ scrollMarginTop: '96px' }}
          />
          <section
            key="desktop-projects"
            id="projects"
            ref={(node) => bindRect(node, 'projects')}
            style={{ scrollMarginTop: '96px' }}
          />
          <output data-testid="active-section">{activeSection}</output>
        </>
      )
    }

    const { rerender } = render(<LayoutSwapHarness mobile={false} />)

    expect(screen.getByTestId('active-section')).toHaveTextContent('about')

    act(() => {
      mockState.positions.about = -980
      mockState.positions.experience = 140
      mockState.positions.projects = 860
      rerender(<LayoutSwapHarness mobile />)
      window.dispatchEvent(new Event('resize'))
    })

    expect(screen.getByTestId('active-section')).toHaveTextContent(
      'experience',
    )
  })
})
