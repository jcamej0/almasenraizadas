import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  fetchSectionBySlug,
  fetchAllSectionSlugs,
} from '@/controllers';
import { PostGrid, SubcategoryCard, Breadcrumb } from '@/components/ui';
import RichSchema from '@/components/seo/RichSchema';
import { buildBreadcrumbSchema } from '@/components/seo/schema-builders';
import { SITE_NAME } from '@/lib/constants';
import { ROUTES, absoluteUrl, sectionUrl, subcategoryPath } from '@/lib/routes';
import styles from './page.module.scss';

/** ISR revalidation in seconds */
export const revalidate = 60;

interface SectionPageProps {
  params: Promise<{ sectionSlug: string }>;
}

export async function generateStaticParams() {
  const slugs = await fetchAllSectionSlugs();
  return slugs.map((slug) => ({ sectionSlug: slug }));
}

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { sectionSlug } = await params;
  const section = await fetchSectionBySlug(sectionSlug);

  if (!section) {
    return { title: 'Sección no encontrada' };
  }

  const canonical = sectionUrl(sectionSlug);

  return {
    title: section.title,
    description:
      section.description ||
      `Artículos sobre ${section.title} en ${SITE_NAME}`,
    alternates: { canonical },
    openGraph: {
      title: section.title,
      description: section.description || `Artículos sobre ${section.title}`,
      url: canonical,
    },
  };
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { sectionSlug } = await params;
  const section = await fetchSectionBySlug(sectionSlug);

  if (!section) {
    notFound();
  }

  const hasSubcategories = section.subcategories.length > 0;
  const hasPosts = section.posts.length > 0;

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: 'Secciones', url: absoluteUrl(ROUTES.SECTIONS) },
    { name: section.title, url: sectionUrl(sectionSlug) },
  ]);

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: 'Secciones', href: ROUTES.SECTIONS },
          { label: section.title, href: `/${sectionSlug}` },
        ]}
      />
      <header className={styles.header} aria-labelledby="section-title">
        <h1 id="section-title" className={styles.title}>
          {section.title}
        </h1>
        {section.description && (
          <p className={styles.description}>{section.description}</p>
        )}
      </header>

      {hasSubcategories && (
        <section className={styles.subcategoriesSection} aria-labelledby="subcategories-heading">
          <div className={styles.container}>
            <h2 id="subcategories-heading" className={styles.sectionHeading}>
              Subcategorías
            </h2>
            <div className={styles.subcategoriesGrid} role="list">
              {section.subcategories.map((sub) => (
                <SubcategoryCard
                  key={sub._id}
                  sectionSlug={sectionSlug}
                  subcategory={sub}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.content} aria-label="Artículos de la sección">
        {hasPosts ? (
          <>
            {hasSubcategories && (
              <h2 className={styles.sectionHeading}>Artículos generales</h2>
            )}
            <PostGrid posts={section.posts} />
          </>
        ) : !hasSubcategories ? (
          <p className={styles.empty}>
            Todavía no hay artículos en esta sección.
          </p>
        ) : null}
      </section>
    </>
  );
}
