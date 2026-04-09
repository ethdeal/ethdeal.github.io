import type { SocialIconName, SocialLink } from '../../content/types'
import styles from './SocialLinks.module.css'

interface SocialLinksProps {
  links: SocialLink[]
  variant: 'hero' | 'sidebar' | 'static'
}

function SocialIcon({ icon }: { icon: SocialIconName }) {
  switch (icon) {
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6.5 8.1A1.6 1.6 0 1 0 6.5 4.9a1.6 1.6 0 0 0 0 3.2Z" />
          <path d="M5.1 9.8h2.8V19H5.1V9.8ZM10.1 9.8h2.7v1.3h.1c.4-.7 1.3-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.7V19h-2.8v-4.2c0-1-.1-2.3-1.5-2.3-1.5 0-1.7 1.1-1.7 2.2V19h-2.8V9.8Z" />
        </svg>
      )
    case 'resume':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 3.5h7l4 4V20a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5H7Z" />
          <path d="M14 3.5V8h4" fill="var(--color-bg)" />
          <path d="M9 11.2h6M9 14.5h6M9 17.8h4.2" stroke="var(--color-bg)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2.8a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.2-3.5-1.2-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.5 2.3 1 2.9.8.1-.6.4-1 .7-1.2-2.3-.3-4.7-1.1-4.7-5a3.9 3.9 0 0 1 1-2.7c-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.8 1a9.7 9.7 0 0 1 5 0c2-1.3 2.8-1 2.8-1 .6 1.4.2 2.4.1 2.7a3.9 3.9 0 0 1 1 2.7c0 3.9-2.4 4.7-4.7 5 .4.3.8 1 .8 2v2.9c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.8Z" />
        </svg>
      )
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7.2 3.8h9.6A3.4 3.4 0 0 1 20.2 7.2v9.6a3.4 3.4 0 0 1-3.4 3.4H7.2a3.4 3.4 0 0 1-3.4-3.4V7.2a3.4 3.4 0 0 1 3.4-3.4Z" />
          <path d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Z" fill="var(--color-bg)" />
          <circle cx="17.1" cy="6.9" r="1.1" fill="var(--color-bg)" />
        </svg>
      )
    case 'email':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4.3 6.3h15.4A1.8 1.8 0 0 1 21.5 8v8a1.8 1.8 0 0 1-1.8 1.7H4.3A1.8 1.8 0 0 1 2.5 16V8a1.8 1.8 0 0 1 1.8-1.7Z" />
          <path d="m4.4 8 7.6 5.3L19.6 8" fill="none" stroke="var(--color-bg)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export function SocialLinks({ links, variant }: SocialLinksProps) {
  return (
    <ul className={[styles.list, styles[variant]].join(' ')}>
      {links.map((link) => {
        const opensInNewTab =
          link.href.startsWith('http://') ||
          link.href.startsWith('https://') ||
          link.href.toLowerCase().endsWith('.pdf')

        return (
          <li key={link.label} className={styles.item}>
            <a
              className={styles.link}
              href={link.href}
              aria-label={link.label}
              title={link.label}
              target={opensInNewTab ? '_blank' : undefined}
              rel={opensInNewTab ? 'noreferrer' : undefined}
            >
              <SocialIcon icon={link.icon} />
              <span className="visually-hidden">{link.label}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}
