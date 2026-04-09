import rawExperience from './experience.json'
import rawProjects from './projects.json'
import rawSite from './site.json'
import type {
  ExperienceItem,
  ProjectCard,
  ProjectItem,
  SiteContent,
} from './types'
import { projectImageRegistry } from '../lib/projectImageRegistry'

export const siteContent = rawSite as SiteContent
export const experienceItems = rawExperience as ExperienceItem[]

const projectItems = rawProjects as ProjectItem[]

export const projectCards: ProjectCard[] = projectItems.map((project) => {
  const image = projectImageRegistry[project.imageKey]

  if (!image) {
    throw new Error(`Missing project image for key "${project.imageKey}"`)
  }

  return {
    ...project,
    image: {
      ...image,
      alt: project.imageAlt || image.alt,
    },
  }
})

export const sectionIds = siteContent.navItems.map((item) =>
  item.href.replace('#', ''),
)
