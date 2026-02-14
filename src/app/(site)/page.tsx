import Link from 'next/link';
import { fetchRecentPosts, fetchAllSections, fetchAllProfiles } from '@/controllers';
import { PostGrid, SectionCard, ProfileCard, HeroBackground } from '@/components/ui';
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
      <section className={styles.hero} aria-label="Bienvenida">
        <HeroBackground />

        <div className={styles.heroContent}>
          <span className={styles.heroEyebrow}>Bienestar &middot; Yoga &middot; Aromaterapia</span>
          <h1 className={styles.heroTitle}>{SITE_NAME}</h1>
          <p className={styles.heroTagline}>{SITE_DESCRIPTION}</p>
          <div className={styles.heroCtas}>
            <Link href={ROUTES.SECTIONS} className={styles.ctaPrimary}>
              Explorar Secciones
            </Link>
            <Link href={ROUTES.ABOUT} className={styles.ctaSecondary}>
              Sobre Nosotros
            </Link>
          </div>
        </div>

        <div className={styles.heroScrollHint} aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
              <Link href={ROUTES.ABOUT} className={styles.viewAll}>
                Conoce al equipo
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
