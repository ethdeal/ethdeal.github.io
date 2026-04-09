import { describe, expect, it } from 'vitest'
import { experienceItems, projectCards, siteContent } from '../content/data'

describe('content data', () => {
  it('contains the expected top-level site content shape', () => {
    expect(siteContent.name).toBe('ETHAN DEAL')
    expect(siteContent.navItems.map((item) => item.href)).toEqual([
      '#about',
      '#experience',
      '#projects',
    ])
    expect(siteContent.sidebarSubtitle).toMatch(/\S/)
    expect('sidebarTitle' in siteContent).toBe(false)
    expect(siteContent.socialLinks).toHaveLength(5)
  })

  it('maps every project entry to a bundled image asset', () => {
    expect(projectCards).toHaveLength(2)

    for (const project of projectCards) {
      expect(project.image.src).toBeTruthy()
      expect(project.image.width).toBeGreaterThan(0)
      expect(project.image.height).toBeGreaterThan(0)
      expect(project.image.alt).toBeTruthy()
    }
  })

  it('keeps experience entries complete and editable', () => {
    expect(experienceItems).toHaveLength(3)

    for (const item of experienceItems) {
      expect(item.company).toBeTruthy()
      expect(item.role).toBeTruthy()
      expect(item.date).toBeTruthy()
      expect(item.summary.length).toBeGreaterThan(50)
      expect(item.tags.length).toBeGreaterThan(0)
      expect(item.link).toMatch(/^https?:\/\//)
    }
  })
})
