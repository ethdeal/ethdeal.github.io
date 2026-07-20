import type { SocialLink } from '../../content/types'
import { SocialLinks } from '../../components/ui/SocialLinks'
import profileImage from '../../assets/pfp_placeholder.jpeg'
import styles from './hero.module.css'

interface HeroStaticProps {
  sectionId: string
  className?: string
  intro: string
  name: string
  paragraphs: string[]
  socialLinks: SocialLink[]
}

export function HeroStatic({
  sectionId,
  className = '',
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
        <div className={styles.staticProfileCluster}>
          <img
            className={[
              styles.heroProfileImage,
              styles.heroProfileImageStatic,
            ].join(' ')}
            src={profileImage}
            alt={`Portrait of ${name}`}
          />
          <SocialLinks links={socialLinks} variant="static" />
        </div>
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
