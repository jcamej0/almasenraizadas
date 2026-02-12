import { NavLink } from './NavLink';
import styles from './Navigation.module.scss';

type NavItem = { label: string; href: string };

type NavigationProps = {
  items: NavItem[];
  className?: string;
};

export function Navigation({ items, className }: NavigationProps) {
  return (
    <nav
      className={`${styles.nav} ${className ?? ''}`.trim()}
      aria-label="Navegación principal"
    >
      <ul className={styles.list} role="list">
        {items.map(({ label, href }) => (
          <li key={href} className={styles.item} role="none">
            <NavLink href={href} className={styles.link} activeClassName={styles.linkActive}>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
