import Link from 'next/link';
import { fetchRecentPosts, fetchAllSections, fetchAllProfiles } from '@/controllers';
import { PostGrid, SectionCard, ProfileCard } from '@/components/ui';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import styles from './page.module.scss';

export default async function HomePage() {
  const [recentPosts, sections, profiles] = await Promise.all([
    fetchRecentPosts(6),
    fetchAllSections(),
    fetchAllProfiles(),
  ]);

  return (
    <>
      <section
        className={styles.hero}
        aria-label="Bienvenida"
      >
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{SITE_NAME}</h1>
          <p className={styles.heroTagline}>{SITE_DESCRIPTION}</p>
          <Link href={ROUTES.SECTIONS} className={styles.cta}>
            Explorar Secciones
          </Link>
        </div>
      </section>

      {recentPosts.length > 0 && (
        <section
          className={styles.postsSection}
          aria-labelledby="recent-posts-heading"
        >
          <div className={styles.container}>
            <h2 id="recent-posts-heading" className={styles.sectionTitle}>
              Artículos recientes
            </h2>
            <PostGrid posts={recentPosts} columns={3} />
            <div className={styles.viewAllWrap}>
              <Link href={ROUTES.SECTIONS} className={styles.viewAll}>
                Ver todos los artículos
              </Link>
            </div>
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section
          className={styles.sectionsSection}
          aria-labelledby="sections-heading"
        >
          <div className={styles.container}>
            <h2 id="sections-heading" className={styles.sectionTitle}>
              Secciones
            </h2>
            <div className={styles.sectionsGrid} role="list">
              {sections.map((section) => (
                <SectionCard key={section._id} section={section} />
              ))}
            </div>
            <div className={styles.viewAllWrap}>
              <Link href={ROUTES.SECTIONS} className={styles.viewAll}>
                Ver todas las secciones
              </Link>
            </div>
          </div>
        </section>
      )}

      {profiles.length > 0 && (
        <section
          className={styles.profilesSection}
          aria-labelledby="profiles-heading"
        >
          <div className={styles.container}>
            <h2 id="profiles-heading" className={styles.sectionTitle}>
              Nuestros autores
            </h2>
            <div className={styles.profilesList} role="list">
              {profiles.map((author) => (
                <ProfileCard key={author._id} author={author} />
              ))}
            </div>
            <div className={styles.viewAllWrap}>
              <Link href={ROUTES.PROFILES} className={styles.viewAll}>
                Ver todos los perfiles
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
