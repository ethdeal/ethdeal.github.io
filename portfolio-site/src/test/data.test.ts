import { describe, expect, it } from 'vitest'
import {
  designCards,
  experienceItems,
  projectCards,
  siteContent,
} from '../content/data'

describe('content data', () => {
  it('contains the expected top-level site content shape', () => {
    expect(siteContent.name).toMatch(/\S/)
    expect(siteContent.navItems.map((item) => item.href)).toEqual([
      '#about',
      '#experience',
      '#projects',
      '#design',
    ])
    expect(siteContent.sidebarSubtitle).toMatch(/\S/)
    expect(siteContent.socialLinks.length).toBeGreaterThan(0)

    for (const link of siteContent.socialLinks) {
      expect(link.label).toMatch(/\S/)
      expect(link.href).toMatch(/\S/)
      expect(link.icon).toMatch(/\S/)
    }

    expect(
      siteContent.socialLinks.some((link) => link.icon === 'resume'),
    ).toBe(true)
  })

  it('maps every project entry to a bundled image asset', () => {
    expect(projectCards.length).toBeGreaterThan(0)

    for (const project of projectCards) {
      expect(project.title).toMatch(/\S/)
      expect(project.date).toMatch(/\S/)
      expect(project.summary).toMatch(/\S/)
      expect(Array.isArray(project.tags)).toBe(true)
      expect(project.link).toMatch(/^https?:\/\//)

      if (!project.image) {
        throw new Error(`Expected ${project.title} to have an image`)
      }

      expect(project.image.src).toBeTruthy()
      expect(project.image.width).toBeGreaterThan(0)
      expect(project.image.height).toBeGreaterThan(0)
      expect(project.image.alt).toBeTruthy()
    }
  })

  it('maps every design entry to a bundled image asset', () => {
    expect(designCards.length).toBeGreaterThan(0)

    for (const design of designCards) {
      expect(design.title).toMatch(/\S/)
      expect(design.date).toMatch(/\S/)
      expect(design.summary).toMatch(/\S/)
      expect(Array.isArray(design.tags)).toBe(true)

      if (design.link) {
        expect(design.link).toMatch(/^https?:\/\//)
      }

      if (!design.image) {
        throw new Error(`Expected ${design.title} to have an image`)
      }

      expect(design.image.src).toBeTruthy()
      expect(design.image.width).toBeGreaterThan(0)
      expect(design.image.height).toBeGreaterThan(0)
      expect(design.image.alt).toBeTruthy()
    }
  })

  it('keeps experience entries complete and editable', () => {
    expect(experienceItems.length).toBeGreaterThan(0)

    for (const item of experienceItems) {
      expect(item.company).toMatch(/\S/)
      expect(item.role).toMatch(/\S/)
      expect(item.date).toMatch(/\S/)
      expect(item.summary).toMatch(/\S/)
      expect(Array.isArray(item.tags)).toBe(true)
      expect(item.link).toMatch(/^https?:\/\//)
    }
  })
})
