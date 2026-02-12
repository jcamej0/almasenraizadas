'use client';

import { useEffect, useState } from 'react';
import { buildShareUrl } from '@/lib/formatters';
import styles from './ShareButtons.module.scss';

interface ShareButtonsProps {
  title: string;
  url?: string;
}

const PLATFORMS = [
  { key: 'x', icon: '𝕏', label: 'Compartir en X' },
  { key: 'facebook', icon: 'f', label: 'Compartir en Facebook' },
  { key: 'whatsapp', icon: '📱', label: 'Compartir en WhatsApp' },
  { key: 'linkedin', icon: 'in', label: 'Compartir en LinkedIn' },
] as const;

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [shareUrl, setShareUrl] = useState(url ?? '');
  useEffect(() => {
    if (!url) setShareUrl(window.location.href);
  }, [url]);

  return (
    <div className={styles.wrapper} role="group" aria-label="Compartir">
      {PLATFORMS.map(({ key, icon, label }) => (
        <a
          key={key}
          href={buildShareUrl(key, shareUrl, title)}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.button}
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  );
}
