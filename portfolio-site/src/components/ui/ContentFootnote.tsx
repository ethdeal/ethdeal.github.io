import styles from './ContentFootnote.module.css'

export function ContentFootnote() {
  return (
    <footer className={styles.footnote} aria-label="Site footnote">
      <p className={styles.copy}>
        Designed in my head and built with React. Scroll animations implemented with
        GSAP, and water with{' '} 
        <a
          href="https://github.com/ethdeal/ripple-flow"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          RippleFlow
        </a>
        . Layout inspired by{' '}
        <a
          href="https://brittanychiang.com/"
          target="_blank"
          rel="noreferrer"
          className={styles.link}
        >
          Brittany Chiang
        </a>
        .
      </p>
    </footer>
  )
}
