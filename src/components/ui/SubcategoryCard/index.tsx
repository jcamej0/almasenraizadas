import Link from 'next/link';
import { subcategoryPath } from '@/lib/routes';
import type { SubcategoryListItem } from '@/controllers';
import styles from './SubcategoryCard.module.scss';

interface SubcategoryCardProps {
  sectionSlug: string;
  subcategory: SubcategoryListItem;
}

export function SubcategoryCard({ sectionSlug, subcategory }: SubcategoryCardProps) {
  const slug = subcategory.slug.current;
  const href = subcategoryPath(sectionSlug, slug);

  return (
    <article className={styles.card} aria-labelledby={`subcategory-title-${subcategory._id}`}>
      <Link href={href} className={styles.link}>
        <h3 id={`subcategory-title-${subcategory._id}`} className={styles.title}>
          {subcategory.title}
        </h3>
        {subcategory.description && (
          <p className={styles.description}>{subcategory.description}</p>
        )}
        <span className={styles.count}>
          {subcategory.postCount} {subcategory.postCount === 1 ? 'artículo' : 'artículos'}
        </span>
      </Link>
    </article>
  );
}
