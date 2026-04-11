import type { ShowcaseCard } from '../../content/types'
import { ShowcaseSection } from '../../components/ui/ShowcaseSection'

interface DesignSectionProps {
  items: ShowcaseCard[]
}

export function DesignSection({ items }: DesignSectionProps) {
  return (
    <ShowcaseSection
      sectionId="design"
      titleId="design-title"
      eyebrow="Design"
      title="Projects with some extra spice."
      items={items}
    />
  )
}
