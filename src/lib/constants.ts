/**
 * Named constants for Almas Enraizadas wellness blog.
 * Design tokens and configuration values.
 */

/** Site name */
export const SITE_NAME = 'Almas Enraizadas';

/** Site description (wellness/bienestar in Spanish) */
export const SITE_DESCRIPTION =
  'Un espacio de bienestar, mindfulness y crecimiento personal. Raíces profundas para una vida plena.';

/** Base URL from environment or fallback for local dev */
export const SITE_URL =
  typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : typeof process !== 'undefined' && process.env?.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'https://almazasenraizadas.com';

/** Posts per page for pagination */
export const POSTS_PER_PAGE = 12;

/** ISR revalidate time in seconds */
export const REVALIDATE_TIME = 60;

/** Social platform identifiers for share URLs */
export const SOCIAL_PLATFORMS = {
  TWITTER: 'twitter',
  X: 'x',
  FACEBOOK: 'facebook',
  WHATSAPP: 'whatsapp',
  LINKEDIN: 'linkedin',
} as const;


/** Color palette aligned with design tokens */
export const COLOR_PALETTE = {
  bg: '#f8f7f4',
  text: '#6b6566',
  contrast: '#4d4a49',
  primary: '#8d9788',
  secondary: '#c8ccbb',
  neutral: '#dddbd6',
  accent: '#b3adab',
} as const;
