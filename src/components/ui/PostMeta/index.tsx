/**
 * PostMeta — Reusable author byline + publish metadata block.
 *
 * Renders a visually grouped card with:
 *   - Author avatar (small, round)
 *   - "Escrito por" label + author name link
 *   - Published date
 *   - Reading time (optional)
 *
 * Enriched with Schema.org microdata (itemprop) for Article > author.
 *
 * @example
 * <PostMeta
 *   author={post.author}
 *   publishedAt={post.publishedAt}
 *   readingTime={post.readingTime}
 * />
 */

import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/lib/types';
import { profilePath } from '@/lib/routes';
import { formatDate, formatReadingTime } from '@/lib/formatters';
import { getImageUrl } from '@/services/sanity/image';
import styles from './PostMeta.module.scss';

const AVATAR_SIZE = 48;
const AVATAR_FALLBACK = '/avatar-placeholder.jpg';

interface PostMetaProps {
  /** Post author with image, slug, name, and role. */
  author: Author;
  /** ISO date string of publication. */
  publishedAt: string;
  /** Estimated reading time in minutes (optional). */
  readingTime?: number | null;
  /** Extra className for layout overrides. */
  className?: string;
}

export function PostMeta({
  author,
  publishedAt,
  readingTime,
  className,
}: PostMetaProps) {
  const avatarUrl = getImageUrl(author.image, AVATAR_SIZE * 2, AVATAR_SIZE * 2);
  const href = profilePath(author.slug.current);
  const rootClass = className
    ? `${styles.meta} ${className}`
    : styles.meta;

  return (
    <div className={rootClass} itemProp="author" itemScope itemType="https://schema.org/Person">
      <Link href={href} className={styles.avatarLink} aria-label={`Perfil de ${author.name}`}>
        <Image
          src={avatarUrl || AVATAR_FALLBACK}
          alt={author.name}
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          className={styles.avatar}
          loading="lazy"
          itemProp="image"
        />
      </Link>

      <div className={styles.info}>
        <div className={styles.byline}>
          <span className={styles.label}>Escrito por</span>
          <Link href={href} className={styles.authorName} itemProp="name">
            {author.name}
          </Link>
          {author.role && (
            <span className={styles.role} itemProp="jobTitle">{author.role}</span>
          )}
        </div>

        <div className={styles.details}>
          <time dateTime={publishedAt} className={styles.date} itemProp="datePublished">
            {formatDate(publishedAt)}
          </time>
          {readingTime != null && (
            <>
              <span className={styles.dot} aria-hidden="true">·</span>
              <span className={styles.readingTime}>
                {formatReadingTime(readingTime)}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
