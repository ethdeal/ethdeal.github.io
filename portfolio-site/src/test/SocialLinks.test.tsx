import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { SocialLinks } from '../components/ui/SocialLinks'

const links = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/example',
    icon: 'linkedin' as const,
  },
  {
    label: 'Resume',
    href: '/resume.pdf',
    icon: 'resume' as const,
  },
]

describe('SocialLinks', () => {
  it('applies native tooltips for hero and sidebar variants', () => {
    const { rerender } = render(<SocialLinks links={links} variant="hero" />)

    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'title',
      'LinkedIn',
    )
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'title',
      'Resume',
    )
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'target',
      '_blank',
    )

    rerender(<SocialLinks links={links} variant="sidebar" />)

    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
      'title',
      'LinkedIn',
    )
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'title',
      'Resume',
    )
    expect(screen.getByRole('link', { name: 'Resume' })).toHaveAttribute(
      'target',
      '_blank',
    )
  })
})
