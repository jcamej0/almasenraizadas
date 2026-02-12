import Image from 'next/image';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/constants';
import { ROUTES, NAV_ITEMS } from '@/lib/routes';
import { Navigation } from '../Navigation';
import { MobileMenu } from './MobileMenu';
import styles from './Header.module.scss';

const LOGO_SIZE = 40;

export function Header() {
  return (
    <header className={styles.header} role="banner" aria-label="Cabecera del sitio">
      <div className={styles.inner}>
        <Link href={ROUTES.HOME} className={styles.logo} aria-label={`${SITE_NAME} - Inicio`}>
          <Image
            src="/logo.png"
            alt=""
            width={LOGO_SIZE}
            height={LOGO_SIZE}
            className={styles.logoImage}
            priority
          />
          <span className={styles.logoText}>{SITE_NAME}</span>
        </Link>

        <Navigation items={NAV_ITEMS} className={styles.desktopNav} />

        <div className={styles.hamburgerWrapper}>
          <MobileMenu items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
