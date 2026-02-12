import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  fetchProfileBySlug,
  fetchAllProfileSlugs,
  type AuthorWithPosts,
} from '@/controllers';
import { PostGrid, Breadcrumb } from '@/components/ui';
import RichSchema from '@/components/seo/RichSchema';
import {
  buildBreadcrumbSchema,
  buildProfileSchema,
} from '@/components/seo/schema-builders';
import { getImageUrl } from '@/services/sanity/image';
import { ROUTES, absoluteUrl, profileUrl } from '@/lib/routes';
import { truncateText } from '@/lib/formatters';
import styles from './page.module.scss';

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

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await fetchAllProfileSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await fetchProfileBySlug(slug);

  if (!profile) {
    return { title: 'Perfil no encontrado' };
  }

  const canonical = profileUrl(slug);

  return {
    title: profile.name,
    description: truncateText(profile.bio, 160) || `Perfil de ${profile.name} en Almas Enraizadas`,
    alternates: { canonical },
    openGraph: {
      title: profile.name,
      description: truncateText(profile.bio, 160) || `Perfil de ${profile.name}`,
      url: canonical,
    },
  };
}

export default async function ProfileDetailPage({ params }: Props) {
  const { slug } = await params;
  const profile = await fetchProfileBySlug(slug);

  if (!profile) {
    notFound();
  }

  const imageUrl = getImageUrl(profile.image, 400, 400);
  const fullUrl = profileUrl(profile.slug.current);

  const breadcrumbItems = [
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: 'Perfiles', url: absoluteUrl(ROUTES.PROFILES) },
    { name: profile.name, url: fullUrl },
  ];

  return (
    <>
      <RichSchema data={buildBreadcrumbSchema(breadcrumbItems)} />
      <RichSchema data={buildProfileSchema(profile, imageUrl)} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: 'Perfiles', href: ROUTES.PROFILES },
          { label: profile.name, href: `/perfiles/${slug}` },
        ]}
      />

      <header className={styles.header}>
        <div className={styles.avatarWrap}>
          <Image
            src={imageUrl || '/avatar-placeholder.jpg'}
            alt={profile.name}
            width={160}
            height={160}
            className={styles.avatar}
          />
        </div>
        <h1 className={styles.name}>{profile.name}</h1>
        {profile.role && <p className={styles.role}>{profile.role}</p>}
        {profile.bio && (
          <p className={styles.bio}>{truncateText(profile.bio, 500)}</p>
        )}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <nav className={styles.social} aria-label="Enlaces sociales">
            {profile.socialLinks.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={link.platform}
              >
                {getSocialIcon(link.platform)}
              </a>
            ))}
          </nav>
        )}
      </header>

      {profile.posts.length > 0 && (
        <section
          className={styles.postsSection}
          aria-labelledby="posts-by-author-heading"
        >
          <h2 id="posts-by-author-heading" className={styles.postsHeading}>
            Artículos de {profile.name}
          </h2>
          <PostGrid posts={profile.posts} columns={3} />
        </section>
      )}
    </>
  );
}
