import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ContentFootnote } from '../components/ui/ContentFootnote'

describe('ContentFootnote', () => {
  it('renders an accessible footnote with an external Brittany Chiang link', () => {
    render(<ContentFootnote />)

    expect(
      screen.getByRole('contentinfo', { name: 'Site footnote' }),
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
