import Image from 'next/image';
import Link from 'next/link';
import type { Section } from '@/lib/types';
import { sectionPath } from '@/lib/routes';
import { getImageUrl } from '@/services/sanity/image';
import styles from './SectionCard.module.scss';

interface SectionCardProps {
  section: Section;
}

export function SectionCard({ section }: SectionCardProps) {
  const slug = section.slug.current;
  const imageUrl = getImageUrl(section.image, 600, 400);

  return (
    <article className={styles.card} aria-labelledby={`section-title-${section._id}`}>
      <Link href={sectionPath(slug)} className={styles.link}>
        <div className={styles.imageWrap}>
          <Image
            src={imageUrl || '/section-placeholder.jpg'}
            alt={section.title}
            fill
            className={styles.image}
            sizes="(max-width: 767px) 100vw, 50vw"
          />
          <div className={styles.overlay} />
          <div className={styles.content}>
          <h3 id={`section-title-${section._id}`} className={styles.title}>
            {section.title}
          </h3>
          <p className={styles.description}>{section.description}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}
