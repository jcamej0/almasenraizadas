'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MobileMenu.module.scss';

type NavItem = { label: string; href: string };

type MobileMenuProps = {
  items: NavItem[];
};

function getFirstFocusable(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(
    'a[href], button:not([disabled])'
  );
}

function getLastFocusable(container: HTMLElement): HTMLElement | null {
  const focusables = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled])'
  );
  return focusables.length ? focusables[focusables.length - 1] : null;
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  // Close on route change
  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  // ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMenu();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMenu]);

  // Focus trap and focus on open
  useEffect(() => {
    if (!isOpen) return;

    const container = menuRef.current;
    if (!container) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const first = getFirstFocusable(container);
      const last = getLastFocusable(container);

      if (!first || !last) return;

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    const firstFocusable = getFirstFocusable(container);
    const focusTarget = firstFocusable ?? container.querySelector<HTMLElement>('[data-close]');
    focusTarget?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <button
        type="button"
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        <span className={styles.hamburgerLine} aria-hidden />
        <span className={styles.hamburgerLine} aria-hidden />
        <span className={styles.hamburgerLine} aria-hidden />
      </button>

      <aside
        ref={menuRef}
        id="mobile-menu"
        className={styles.overlay}
        data-open={isOpen}
        aria-label="Menú de navegación"
        hidden={!isOpen}
      >
        <nav className={styles.menu} aria-label="Navegación principal">
          <ul className={styles.list} role="list">
            {items.map(({ label, href }) => (
              <li key={href} role="none">
                <Link
                  href={href}
                  className={isActive(href) ? styles.linkActive : styles.link}
                  aria-current={isActive(href) ? 'page' : undefined}
                  onClick={closeMenu}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className={styles.close}
          onClick={closeMenu}
          aria-label="Cerrar menú"
          data-close
        >
          Cerrar
        </button>
      </aside>
    </>
  );
}
