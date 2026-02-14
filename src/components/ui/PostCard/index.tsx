import Image from 'next/image';
import Link from 'next/link';
import type { PostListItem } from '@/lib/types';
import { formatDate, formatReadingTime, truncateText } from '@/lib/formatters';
import { postPath } from '@/lib/routes';
import { getImageUrl } from '@/services/sanity/image';
import { Rating } from '../Rating';
import { TagList } from '../TagList';
import styles from './PostCard.module.scss';

interface PostCardProps {
  post: PostListItem;
}

export function PostCard({ post }: PostCardProps) {
  const imageUrl = getImageUrl(post.mainImage, 600, 400);
  const sectionSlug = post.section?.slug?.current ?? '';
  const subcategorySlug = post.subcategory?.slug?.current;
  const postSlug = post.slug.current;
  const href = postPath(sectionSlug, postSlug, subcategorySlug);

  return (
    <article className={styles.card} aria-labelledby={`post-title-${post._id}`}>
      <Link href={href} className={styles.imageLink}>
        <Image
          src={imageUrl || '/placeholder.jpg'}
          alt={post.mainImage?.alt ?? post.title}
          width={600}
          height={400}
          className={styles.image}
          loading="lazy"
          sizes="(max-width: 767px) 100vw, (max-width: 991px) 50vw, 33vw"
        />
      </Link>
      <div className={styles.content}>
        <h3 id={`post-title-${post._id}`} className={styles.title}>
          <Link href={href}>{post.title}</Link>
        </h3>
        <p className={styles.excerpt}>{truncateText(post.excerpt, 140)}</p>
        <div className={styles.meta}>
          <span className={styles.authorMeta}>
            <span className={styles.byLabel}>Por</span>{' '}
            {post.author?.name ?? 'Anónimo'}
          </span>
          <span className={styles.metaSep} aria-hidden="true">·</span>
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
        {post.tags && post.tags.length > 0 && (
          <TagList tags={post.tags} className={styles.tags} />
        )}
        <div className={styles.footer}>
          {post.rating != null && <Rating value={post.rating} />}
          {post.readingTime != null && (
            <span className={styles.readingTime}>
              {formatReadingTime(post.readingTime)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
