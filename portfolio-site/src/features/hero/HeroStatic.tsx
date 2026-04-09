import type { SocialLink } from '../../content/types'
import { SocialLinks } from '../../components/ui/SocialLinks'
import styles from './hero.module.css'

interface HeroStaticProps {
  sectionId: string
  className?: string
  eyebrow: string
  intro: string
  name: string
  paragraphs: string[]
  socialLinks: SocialLink[]
}

export function HeroStatic({
  sectionId,
  className = '',
  eyebrow,
  intro,
  name,
  paragraphs,
  socialLinks,
}: HeroStaticProps) {
  return (
    <section
      id={sectionId}
      aria-labelledby={`${sectionId}-title`}
      className={[styles.staticHero, className].join(' ')}
    >
      <div className={styles.staticMeta}>
        <SocialLinks links={socialLinks} variant="static" />
        <p className={styles.heroEyebrow}>{eyebrow}</p>
      </div>

      <div className={styles.staticBody}>
        <h1 id={`${sectionId}-title`} className={styles.staticTitle}>
          {name}
        </h1>

        <div className={styles.staticCopy}>
          <p className={styles.heroIntro}>{intro}</p>
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
