import styles from './TagList.module.css'

interface TagListProps {
  tags: string[]
}

export function TagList({ tags }: TagListProps) {
  return (
    <ul className={styles.list} aria-label="Technologies used">
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  )
}
