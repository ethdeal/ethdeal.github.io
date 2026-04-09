import { useState } from 'react'
import type { ProjectCard } from '../../content/types'
import { ExternalLinkIcon } from '../../components/ui/ExternalLinkIcon'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { TagList } from '../../components/ui/TagList'
import styles from './projects.module.css'

interface ProjectsSectionProps {
  items: ProjectCard[]
}

export function ProjectsSection({ items }: ProjectsSectionProps) {
  const [activeProject, setActiveProject] = useState<string | null>(null)

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className={styles.section}
    >
      <SectionHeading
        eyebrow="Projects"
        title="A few of my technical projects."
        titleId="projects-title"
        // description="This section includes some of my technical projects."
      />

      <div className={styles.list}>
        {items.map((item) => {
          const isActive = activeProject === item.project
          const isDimmed = activeProject !== null && !isActive

          return (
            <article
              key={item.project}
              className={[
                styles.entry,
                isActive ? styles.active : '',
                isDimmed ? styles.dimmed : '',
              ].join(' ')}
              onMouseEnter={() => setActiveProject(item.project)}
              onMouseLeave={() => setActiveProject(null)}
              onFocus={() => setActiveProject(item.project)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setActiveProject(null)
                }
              }}
            >
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className={styles.mediaLink}
                aria-label={`Open ${item.project}`}
              >
                <img
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  loading="lazy"
                  decoding="async"
                  className={styles.image}
                />
              </a>

              <div className={styles.content}>
                <div className={styles.topRow}>
                  <div>
                    <h3 className={styles.project}>{item.project}</h3>
                    <p className={styles.date}>{item.date}</p>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${item.project}`}
                    title="View"
                    className={styles.link}
                  >
                    <ExternalLinkIcon className={styles.linkIcon} />
                  </a>
                </div>

                <p className={styles.summary}>{item.summary}</p>
                <TagList tags={item.tags} />
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
