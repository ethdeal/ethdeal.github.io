export type SocialIconName =
  | 'linkedin'
  | 'resume'
  | 'github'
  | 'instagram'
  | 'email'

export interface NavItem {
  label: string
  href: `#${string}`
}

export interface SocialLink {
  label: string
  href: string
  icon: SocialIconName
}

export interface SiteContent {
  name: string
  eyebrow: string
  heroIntro: string
  heroParagraphs: string[]
  sidebarSubtitle: string
  sidebarDescription: string
  navItems: NavItem[]
  socialLinks: SocialLink[]
}

export interface ExperienceItem {
  company: string
  role: string
  date: string
  summary: string
  tags: string[]
  link: string
}

export interface ProjectItem {
  project: string
  date: string
  summary: string
  tags: string[]
  link: string
  imageKey: string
  imageAlt: string
}

export interface ProjectImageAsset {
  src: string
  width: number
  height: number
  alt: string
}

export interface ProjectCard extends Omit<ProjectItem, 'imageKey'> {
  image: ProjectImageAsset
}
