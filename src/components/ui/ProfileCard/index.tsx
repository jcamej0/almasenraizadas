import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/lib/types';
import { truncateText } from '@/lib/formatters';
import { profilePath } from '@/lib/routes';
import { getImageUrl } from '@/services/sanity/image';
import styles from './ProfileCard.module.scss';

interface ProfileCardProps {
  author: Author;
}

const SOCIAL_ICONS: Record<string, string> = {
  twitter: '𝕏',
  x: '𝕏',
  facebook: 'f',
  instagram: '◎',
  linkedin: 'in',
  youtube: '▶',
};

function getSocialIcon(platform: string): string {
  return SOCIAL_ICONS[platform.toLowerCase()] ?? '↗';
}

export function ProfileCard({ author }: ProfileCardProps) {
  const slug = author.slug.current;
  const imageUrl = getImageUrl(author.image, 200, 200);
  const bio = truncateText(author.bio ?? '', 100);

  return (
    <article className={styles.card} aria-labelledby={`profile-name-${author._id}`}>
      <Link href={profilePath(slug)} className={styles.link}>
        <div className={styles.avatarWrap}>
          <Image
            src={imageUrl || '/avatar-placeholder.jpg'}
            alt={author.name}
            width={120}
            height={120}
            className={styles.avatar}
          />
        </div>
        <h3 id={`profile-name-${author._id}`} className={styles.name}>
          {author.name}
        </h3>
        {author.role && <p className={styles.role}>{author.role}</p>}
        {bio && <p className={styles.bio}>{bio}</p>}
      </Link>
      {author.socialLinks && author.socialLinks.length > 0 && (
        <nav className={styles.social} aria-label="Enlaces sociales">
          {author.socialLinks.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
              aria-label={`${link.platform}`}
            >
              {getSocialIcon(link.platform)}
            </a>
          ))}
        </nav>
      )}
    </article>
  );
}
