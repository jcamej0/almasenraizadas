import type { Metadata } from 'next';
import { fetchAllSections } from '@/controllers';
import { SectionCard, Breadcrumb } from '@/components/ui';
import RichSchema from '@/components/seo/RichSchema';
import { buildBreadcrumbSchema } from '@/components/seo/schema-builders';
import { SITE_NAME } from '@/lib/constants';
import { ROUTES, absoluteUrl } from '@/lib/routes';
import styles from './page.module.scss';

/** ISR revalidation in seconds */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Secciones',
  description: `Explora los temas de bienestar, mindfulness y crecimiento personal en ${SITE_NAME}. Cada sección agrupa artículos sobre distintos aspectos de una vida plena.`,
  alternates: { canonical: absoluteUrl(ROUTES.SECTIONS) },
  openGraph: {
    title: 'Secciones',
    url: absoluteUrl(ROUTES.SECTIONS),
  },
};

export default async function SeccionesPage() {
  const sections = await fetchAllSections();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: 'Secciones', url: absoluteUrl(ROUTES.SECTIONS) },
  ]);

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: 'Secciones', href: ROUTES.SECTIONS },
        ]}
      />
      <header className={styles.hero} aria-labelledby="secciones-heading">
        <h1 id="secciones-heading" className={styles.title}>
          Secciones
        </h1>
        <p className={styles.subtitle}>
          Explora los distintos temas de bienestar, mindfulness y crecimiento personal
        </p>
      </header>
      <section className={styles.content} aria-label="Listado de secciones">
        {sections.length > 0 ? (
          <div className={styles.grid} role="list">
            {sections.map((section) => (
              <SectionCard key={section._id} section={section} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No hay secciones disponibles aún.</p>
        )}
      </section>
    </>
  );
}
