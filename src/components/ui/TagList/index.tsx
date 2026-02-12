import Link from 'next/link';
import type { Tag } from '@/lib/types';
import { tagPath } from '@/lib/routes';
import styles from './TagList.module.scss';

interface TagListProps {
  tags: Tag[];
  className?: string;
}

export function TagList({ tags, className }: TagListProps) {
  const validTags = tags.filter((tag) => tag?.slug?.current);
  if (validTags.length === 0) return null;

  return (
    <ul className={`${styles.list} ${className ?? ''}`.trim()} role="list">
      {validTags.map((tag) => (
        <li key={tag._id}>
          <Link
            href={tagPath(tag.slug.current)}
            className={styles.badge}
          >
            {tag.title}
          </Link>
        </li>
      ))}
    </ul>
  );
}
