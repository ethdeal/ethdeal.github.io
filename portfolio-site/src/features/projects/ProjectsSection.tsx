import type { ShowcaseCard } from '../../content/types'
import { ShowcaseSection } from '../../components/ui/ShowcaseSection'

interface ProjectsSectionProps {
  items: ShowcaseCard[]
}

export function ProjectsSection({ items }: ProjectsSectionProps) {
  return (
    <ShowcaseSection
      sectionId="projects"
      titleId="projects-title"
      eyebrow="Projects"
      title="A few of my technical projects."
      items={items}
    />
  )
}
