import { useState } from 'react'
import type { ExperienceItem } from '../../content/types'
import { ExternalLinkIcon } from '../../components/ui/ExternalLinkIcon'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { TagList } from '../../components/ui/TagList'
import styles from './experience.module.css'

interface ExperienceSectionProps {
  items: ExperienceItem[]
  resumeHref: string
}

export function ExperienceSection({ items, resumeHref }: ExperienceSectionProps) {
  const [activeCompany, setActiveCompany] = useState<string | null>(null)

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className={styles.section}
    >
      <SectionHeading
        eyebrow="Experience"
        title="Some of my recent work experience."
        titleId="experience-title"
        // description="Check out some of my roles, ranging from Graphic Design to Fullstack Development."
      />

      <div className={styles.list}>
        {items.map((item) => {
          const isActive = activeCompany === item.company
          const isDimmed = activeCompany !== null && !isActive

          return (
            <article
              key={`${item.company}-${item.role}`}
              className={[
                styles.entry,
                isActive ? styles.active : '',
                isDimmed ? styles.dimmed : '',
              ].join(' ')}
              onMouseEnter={() => setActiveCompany(item.company)}
              onMouseLeave={() => setActiveCompany(null)}
              onFocus={() => setActiveCompany(item.company)}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setActiveCompany(null)
                }
              }}
            >
              <p className={styles.date}>{item.date}</p>

              <div className={styles.axis} aria-hidden="true" />

              <div className={styles.content}>
                <div className={styles.topRow}>
                  <div>
                    <h3 className={styles.role}>{item.role}</h3>
                    <p className={styles.company}>{item.company}</p>
                  </div>

                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit ${item.company}`}
                    title={`Visit`}
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

      <div className={styles.resumeRow}>
        <a
          href={resumeHref}
          target="_blank"
          rel="noreferrer"
          className={[styles.link, styles.resumeLink].join(' ')}
        >
          View Full Resume
          <ExternalLinkIcon className={styles.linkIcon} />
        </a>
      </div>
    </section>
  )
}
