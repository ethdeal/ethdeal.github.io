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

export interface ShowcaseContentItem {
  title: string
  date: string
  summary: string
  tags: string[]
  link?: string
  imageKey: string
  imageAlt: string
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

export type DesignItem = ShowcaseContentItem

export interface ShowcaseImageAsset {
  src: string
  width: number
  height: number
  alt: string
  renderMode?: 'default' | 'cutout'
}

export interface ShowcaseCard
  extends Omit<ShowcaseContentItem, 'imageKey' | 'imageAlt'> {
  image: ShowcaseImageAsset
}
