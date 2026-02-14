import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb, ProfileCard } from '@/components/ui';
import RichSchema from '@/components/seo/RichSchema';
import { buildBreadcrumbSchema } from '@/components/seo/schema-builders';
import { fetchAllProfiles } from '@/controllers';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { ROUTES, absoluteUrl } from '@/lib/routes';
import styles from './page.module.scss';

/** ISR revalidation in seconds */
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: `Conoce la misión, valores y equipo de ${SITE_NAME}. Un espacio dedicado al bienestar, la conexión y el crecimiento personal.`,
};

const VALUES = [
  {
    title: 'Bienestar',
    description:
      'Promovemos prácticas que nutren cuerpo, mente y espíritu para alcanzar una vida plena y equilibrada.',
  },
  {
    title: 'Conexión',
    description:
      'Fomentamos vínculos auténticos con uno mismo, con los demás y con la naturaleza que nos rodea.',
  },
  {
    title: 'Crecimiento',
    description:
      'Acompañamos procesos de transformación personal a través del autoconocimiento y la reflexión consciente.',
  },
  {
    title: 'Naturaleza',
    description:
      'Nos inspiramos en los ciclos naturales para encontrar armonía, enraizarnos y florecer desde la autenticidad.',
  },
] as const;

export default async function SobreNosotrosPage() {
  const profiles = await fetchAllProfiles();

  const breadcrumbs = buildBreadcrumbSchema([
    { name: 'Inicio', url: absoluteUrl(ROUTES.HOME) },
    { name: 'Sobre Nosotros', url: absoluteUrl(ROUTES.ABOUT) },
  ]);

  return (
    <>
      <RichSchema data={breadcrumbs} />
      <Breadcrumb
        items={[
          { label: 'Inicio', href: ROUTES.HOME },
          { label: 'Sobre Nosotros', href: ROUTES.ABOUT },
        ]}
      />

      <section className={styles.hero} aria-labelledby="about-title">
        <h1 id="about-title" className={styles.title}>
          Sobre Nosotros
        </h1>
        <p className={styles.tagline}>
          Raíces profundas para una vida plena
        </p>
      </section>

      <div className={styles.content}>
        <section className={styles.mission} aria-labelledby="mission-title">
          <h2 id="mission-title" className={styles.sectionTitle}>
            Nuestra Misión
          </h2>
          <p className={styles.body}>{SITE_DESCRIPTION}</p>
          <p className={styles.body}>
            En {SITE_NAME} creemos que el verdadero bienestar comienza cuando nos
            conectamos con nuestras raíces más profundas. Nuestro equipo de
            terapeutas, coaches y especialistas comparte herramientas prácticas
            para que puedas cultivar una vida más consciente, equilibrada y
            significativa.
          </p>
        </section>

        <section className={styles.values} aria-labelledby="values-title">
          <h2 id="values-title" className={styles.sectionTitle}>
            Nuestros Valores
          </h2>
          <ul className={styles.valuesList} role="list">
            {VALUES.map(({ title, description }) => (
              <li key={title} className={styles.valueItem}>
                <h3 className={styles.valueTitle}>{title}</h3>
                <p className={styles.valueDesc}>{description}</p>
              </li>
            ))}
          </ul>
        </section>

        {profiles.length > 0 && (
          <section className={styles.team} aria-labelledby="team-title">
            <h2 id="team-title" className={styles.sectionTitle}>
              Nuestro Equipo
            </h2>
            <p className={styles.teamIntro}>
              Conoce a las personas que comparten su conocimiento y experiencia
              para acompañarte en tu camino de bienestar.
            </p>
            <div className={styles.teamGrid} role="list">
              {profiles.map((author) => (
                <ProfileCard key={author._id} author={author} />
              ))}
            </div>
          </section>
        )}

        <section className={styles.cta} aria-label="Explorar secciones">
          <p className={styles.ctaText}>
            Descubre artículos, guías y reflexiones para tu camino de
            crecimiento personal.
          </p>
          <Link href={ROUTES.SECTIONS} className={styles.ctaButton}>
            Explorar Secciones
          </Link>
        </section>
      </div>
    </>
  );
}
