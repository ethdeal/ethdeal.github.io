import rawDesign from './design.json'
import rawExperience from './experience.json'
import rawProjects from './projects.json'
import rawSite from './site.json'
import type {
  DesignItem,
  ExperienceItem,
  ProjectItem,
  ShowcaseCard,
  ShowcaseContentItem,
  SiteContent,
} from './types'
import { showcaseImageRegistry } from '../lib/showcaseImageRegistry'

export const siteContent = rawSite as SiteContent
export const experienceItems = rawExperience as ExperienceItem[]

const projectItems = rawProjects as ProjectItem[]
const designItems = rawDesign as DesignItem[]

function resolveShowcaseCards(items: ShowcaseContentItem[]): ShowcaseCard[] {
  return items.map((item) => {
    const image = showcaseImageRegistry[item.imageKey]

    if (!image) {
      throw new Error(`Missing showcase image for key "${item.imageKey}"`)
    }

    return {
      ...item,
      image: {
        ...image,
        alt: item.imageAlt || image.alt,
      },
    }
  })
}

export const projectCards = resolveShowcaseCards(
  projectItems.map(({ project, ...item }) => ({
    ...item,
    title: project,
  })),
)

export const designCards = resolveShowcaseCards(designItems)

export const sectionIds = siteContent.navItems.map((item) =>
  item.href.replace('#', ''),
)
