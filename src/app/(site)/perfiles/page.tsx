import type { Metadata } from 'next';
import { fetchAllProfiles } from '@/controllers';
import { ProfileCard, Breadcrumb } from '@/components/ui';
import RichSchema from '@/components/seo/RichSchema';
import { buildBreadcrumbSchema } from '@/components/seo/schema-builders';
import { ROUTES, absoluteUrl } from '@/lib/routes';
import styles from './page.module.scss';

/** ISR revalidation in seconds */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Perfiles',
  description:
    'Conoce a los autores y colaboradores de Almas Enraizadas. Expertos en bienestar, mindfulness y crecimiento personal que comparten su sabiduría contigo.',
  alternates: { canonical: absoluteUrl(ROUTES.PROFILES) },
  openGraph: {
    title: 'Perfiles',
    url: absoluteUrl(ROUTES.PROFILES),
  },
};

export default async function PerfilesPage() {
  const profiles = await fetchAllProfiles();

  const breadcrumbItems = [
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: 'Perfiles', url: absoluteUrl(ROUTES.PROFILES) },
  ];

  return (
    <>
      <RichSchema data={buildBreadcrumbSchema(breadcrumbItems)} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: 'Perfiles', href: ROUTES.PROFILES },
        ]}
      />
      <section className={styles.hero} aria-labelledby="perfiles-heading">
        <h1 id="perfiles-heading" className={styles.title}>
          Nuestros autores
        </h1>
        <p className={styles.subtitle}>
          Conoce al equipo detrás de Almas Enraizadas
        </p>
      </section>

      <section className={styles.content} aria-label="Listado de perfiles">
        {profiles.length > 0 ? (
          <div className={styles.grid} role="list">
            {profiles.map((author) => (
              <ProfileCard key={author._id} author={author} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            No hay perfiles disponibles en este momento.
          </p>
        )}
      </section>
    </>
  );
}
