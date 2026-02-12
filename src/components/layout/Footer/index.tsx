import Link from 'next/link';
import { SITE_NAME, SITE_DESCRIPTION } from '@/lib/constants';
import { NAV_ITEMS } from '@/lib/routes';
import styles from './Footer.module.scss';

const currentYear = new Date().getFullYear();

const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
  },
  {
    label: 'Facebook',
    href: 'https://facebook.com',
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com',
  },
] as const;

export function Footer() {
  return (
    <footer
      className={styles.footer}
      role="contentinfo"
      aria-label="Pie de página"
    >
      <div className={styles.inner}>
        <section className={styles.section} aria-labelledby="footer-about">
          <h2 id="footer-about" className={styles.title}>
            Sobre {SITE_NAME}
          </h2>
          <p className={styles.aboutText}>{SITE_DESCRIPTION}</p>
        </section>

        <nav
          className={styles.section}
          aria-labelledby="footer-nav"
        >
          <h2 id="footer-nav" className={styles.title}>
            Navegación
          </h2>
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map(({ label, href }) => (
              <li key={href} role="none">
                <Link href={href} className={styles.navLink}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.section} aria-labelledby="footer-social">
          <h2 id="footer-social" className={styles.title}>
            Síguenos
          </h2>
          <ul className={styles.socialList} role="list">
            {SOCIAL_LINKS.map(({ label, href }) => (
              <li key={href} role="none">
                <a
                  href={href}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (abre en nueva ventana)`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <p className={styles.copyright}>
          © {currentYear} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
