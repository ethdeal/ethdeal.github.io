import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentFootnote } from '../components/ui/ContentFootnote'

describe('ContentFootnote', () => {
  it('renders the footnote copy with an external Brittany Chiang link', () => {
    render(<ContentFootnote />)

    expect(
      screen.getByText(
        (_, element) =>
          element?.tagName === 'P' &&
          element?.textContent ===
          'Designed in my head and built with React and Vite, animations with GSAP. Inspired by Brittany Chiang.',
      ),
    ).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Brittany Chiang' })).toHaveAttribute(
      'href',
      'https://brittanychiang.com/',
    )
    expect(screen.getByRole('link', { name: 'Brittany Chiang' })).toHaveAttribute(
      'target',
      '_blank',
    )
    expect(screen.getByRole('link', { name: 'Brittany Chiang' })).toHaveAttribute(
      'rel',
      'noreferrer',
    )
  })
})
