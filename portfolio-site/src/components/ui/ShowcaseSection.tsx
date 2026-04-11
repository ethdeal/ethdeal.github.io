import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, SyntheticEvent } from 'react'
import type { ShowcaseCard } from '../../content/types'
import { ExternalLinkIcon } from './ExternalLinkIcon'
import { SectionHeading } from './SectionHeading'
import { TagList } from './TagList'
import styles from './ShowcaseSection.module.css'

const SHOWCASE_MEDIA_MAX_WIDTH_VARIABLE = '--showcase-media-max-width'
const SHOWCASE_MEDIA_MAX_WIDTH_FALLBACK_PX = 232
const SHOWCASE_MEDIA_MIN_HEIGHT_VARIABLE = '--showcase-media-min-height-desktop'
const SHOWCASE_MEDIA_MIN_HEIGHT_FALLBACK_PX = 176

interface ShowcaseSectionProps {
  sectionId: string
  titleId: string
  eyebrow: string
  title: string
  items: ShowcaseCard[]
  mediaLabelPrefix?: string
  linkLabelPrefix?: string
}

interface ShowcaseCardItemProps {
  item: ShowcaseCard
  isActive: boolean
  isDimmed: boolean
  mediaLabelPrefix: string
  linkLabelPrefix: string
  maxMediaWidth: number
  minMediaHeight: number
  onActivate: () => void
  onDeactivate: () => void
}

function getAspectRatio(image: ShowcaseCard['image']) {
  if (image.width > 0 && image.height > 0) {
    return image.width / image.height
  }

  return 1
}

function parseCssLengthToPx(value: string) {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return null
  }

  const numericValue = Number.parseFloat(trimmedValue)

  if (!Number.isFinite(numericValue)) {
    return null
  }

  if (trimmedValue.endsWith('rem')) {
    const rootFontSize = Number.parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    )

    return numericValue * (Number.isFinite(rootFontSize) ? rootFontSize : 16)
  }

  return numericValue
}

function getShowcaseMediaMaxWidthPx() {
  if (typeof window === 'undefined') {
    return SHOWCASE_MEDIA_MAX_WIDTH_FALLBACK_PX
  }

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(SHOWCASE_MEDIA_MAX_WIDTH_VARIABLE)

  return parseCssLengthToPx(value) ?? SHOWCASE_MEDIA_MAX_WIDTH_FALLBACK_PX
}

function getShowcaseMediaMinHeightPx() {
  if (typeof window === 'undefined') {
    return SHOWCASE_MEDIA_MIN_HEIGHT_FALLBACK_PX
  }

  const value = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue(SHOWCASE_MEDIA_MIN_HEIGHT_VARIABLE)

  return parseCssLengthToPx(value) ?? SHOWCASE_MEDIA_MIN_HEIGHT_FALLBACK_PX
}

function ShowcaseCardItem({
  item,
  isActive,
  isDimmed,
  mediaLabelPrefix,
  linkLabelPrefix,
  maxMediaWidth,
  minMediaHeight,
  onActivate,
  onDeactivate,
}: ShowcaseCardItemProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [contentHeight, setContentHeight] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(() => getAspectRatio(item.image))

  useLayoutEffect(() => {
    const syncContentHeight = () => {
      const content = contentRef.current

      if (!content) {
        return
      }

      const nextHeight = Math.round(content.getBoundingClientRect().height)

      if (nextHeight <= 0) {
        return
      }

      setContentHeight((currentHeight) =>
        currentHeight === nextHeight ? currentHeight : nextHeight,
      )
    }

    syncContentHeight()

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' && contentRef.current
        ? new ResizeObserver(() => {
            syncContentHeight()
          })
        : null

    if (contentRef.current) {
      resizeObserver?.observe(contentRef.current)
    }

    window.addEventListener('resize', syncContentHeight)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', syncContentHeight)
    }
  }, [])

  useLayoutEffect(() => {
    const image = imageRef.current

    if (!image?.complete) {
      return
    }

    const nextAspectRatio = image.naturalWidth / image.naturalHeight

    if (!Number.isFinite(nextAspectRatio) || nextAspectRatio <= 0) {
      return
    }

    setAspectRatio((currentAspectRatio) =>
      Math.abs(currentAspectRatio - nextAspectRatio) < 0.001
        ? currentAspectRatio
        : nextAspectRatio,
    )
  }, [])

  const handleImageLoad = (event: SyntheticEvent<HTMLImageElement>) => {
    const nextAspectRatio =
      event.currentTarget.naturalWidth / event.currentTarget.naturalHeight

    if (!Number.isFinite(nextAspectRatio) || nextAspectRatio <= 0) {
      return
    }

    setAspectRatio((currentAspectRatio) =>
      Math.abs(currentAspectRatio - nextAspectRatio) < 0.001
        ? currentAspectRatio
        : nextAspectRatio,
    )
  }

  const targetMediaHeight =
    contentHeight > 0 ? Math.max(contentHeight, minMediaHeight) : minMediaHeight
  const mediaWidth = Math.min(
    Math.round(targetMediaHeight * aspectRatio),
    maxMediaWidth,
  )
  const entryStyle = {
    '--showcase-media-width': `${mediaWidth}px`,
  } as CSSProperties
  const imageClassName = [
    styles.image,
    item.image.renderMode === 'cutout' ? styles.imageCutout : '',
  ]
    .filter(Boolean)
    .join(' ')
  const media = (
    <img
      ref={imageRef}
      src={item.image.src}
      alt={item.image.alt}
      width={item.image.width}
      height={item.image.height}
      loading="lazy"
      decoding="async"
      className={imageClassName}
      onLoad={handleImageLoad}
    />
  )

  return (
    <article
      className={[
        styles.entry,
        isActive ? styles.active : '',
        isDimmed ? styles.dimmed : '',
      ].join(' ')}
      style={entryStyle}
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          onDeactivate()
        }
      }}
    >
      {item.link ? (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className={styles.mediaLink}
          aria-label={`${mediaLabelPrefix} ${item.title}`}
        >
          {media}
        </a>
      ) : (
        <div className={styles.mediaFrame}>{media}</div>
      )}

      <div ref={contentRef} className={styles.content}>
        <div className={styles.topRow}>
          <div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.date}>{item.date}</p>
          </div>

          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noreferrer"
              aria-label={`${linkLabelPrefix} ${item.title}`}
              title={linkLabelPrefix}
              className={styles.link}
            >
              <ExternalLinkIcon className={styles.linkIcon} />
            </a>
          ) : null}
        </div>

        <p className={styles.summary}>{item.summary}</p>
        {item.tags.length > 0 ? <TagList tags={item.tags} /> : null}
      </div>
    </article>
  )
}

export function ShowcaseSection({
  sectionId,
  titleId,
  eyebrow,
  title,
  items,
  mediaLabelPrefix = 'Open',
  linkLabelPrefix = 'View',
}: ShowcaseSectionProps) {
  const [activeItem, setActiveItem] = useState<string | null>(null)
  const [maxMediaWidth, setMaxMediaWidth] = useState(() =>
    getShowcaseMediaMaxWidthPx(),
  )
  const [minMediaHeight, setMinMediaHeight] = useState(() =>
    getShowcaseMediaMinHeightPx(),
  )

  useLayoutEffect(() => {
    const syncShowcaseSizing = () => {
      const nextMaxMediaWidth = getShowcaseMediaMaxWidthPx()
      const nextMinMediaHeight = getShowcaseMediaMinHeightPx()

      setMaxMediaWidth((currentMaxMediaWidth) =>
        currentMaxMediaWidth === nextMaxMediaWidth
          ? currentMaxMediaWidth
          : nextMaxMediaWidth,
      )
      setMinMediaHeight((currentMinMediaHeight) =>
        currentMinMediaHeight === nextMinMediaHeight
          ? currentMinMediaHeight
          : nextMinMediaHeight,
      )
    }

    syncShowcaseSizing()
    window.addEventListener('resize', syncShowcaseSizing)

    return () => {
      window.removeEventListener('resize', syncShowcaseSizing)
    }
  }, [])

  return (
    <section
      id={sectionId}
      aria-labelledby={titleId}
      className={styles.section}
    >
      <SectionHeading eyebrow={eyebrow} title={title} titleId={titleId} />

      <div className={styles.list}>
        {items.map((item) => {
          const isActive = activeItem === item.title
          const isDimmed = activeItem !== null && !isActive

          return (
            <ShowcaseCardItem
              key={`${item.title}-${item.date}`}
              item={item}
              isActive={isActive}
              isDimmed={isDimmed}
              mediaLabelPrefix={mediaLabelPrefix}
              linkLabelPrefix={linkLabelPrefix}
              maxMediaWidth={maxMediaWidth}
              minMediaHeight={minMediaHeight}
              onActivate={() => setActiveItem(item.title)}
              onDeactivate={() => setActiveItem(null)}
            />
          )
        })}
      </div>
    </section>
  )
}
