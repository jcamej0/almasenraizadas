/**
 * Centralized route definitions for Almas Enraizadas.
 * All URLs, paths and navigation live here.
 * Components import from this file — never hardcode paths.
 *
 * URL structure:
 *   /secciones                                    — sections index
 *   /:sectionSlug                                 — section detail (root level)
 *   /:sectionSlug/:postSlug                       — article directly in section
 *   /:sectionSlug/:subcategorySlug                — subcategory listing
 *   /:sectionSlug/:subcategorySlug/:postSlug      — article in subcategory
 *   /perfiles                                     — profiles index
 *   /perfiles/:slug                               — profile detail
 *   /sobre-nosotros                               — about page
 */

import { SITE_URL } from './constants';

// ---------------------------------------------------------------------------
// Base path segments (single source of truth for URL structure)
// ---------------------------------------------------------------------------

const SEGMENTS = {
  HOME: '/',
  SECTIONS: '/secciones',
  PROFILES: '/perfiles',
  TAGS: '/tags',
  ABOUT: '/sobre-nosotros',
  STUDIO: '/studio',
  SEARCH: '/buscar',
} as const;

// ---------------------------------------------------------------------------
// Static routes (for next/link href)
// ---------------------------------------------------------------------------

export const ROUTES = {
  HOME: SEGMENTS.HOME,
  SECTIONS: SEGMENTS.SECTIONS,
  PROFILES: SEGMENTS.PROFILES,
  TAGS: SEGMENTS.TAGS,
  ABOUT: SEGMENTS.ABOUT,
  STUDIO: SEGMENTS.STUDIO,
  SEARCH: SEGMENTS.SEARCH,
} as const;

// ---------------------------------------------------------------------------
// Dynamic route builders — relative paths
// ---------------------------------------------------------------------------

/** Path to a section: /:sectionSlug */
export const sectionPath = (sectionSlug: string): string =>
  `/${sectionSlug}`;

/** Path to a subcategory listing: /:sectionSlug/:subcategorySlug */
export const subcategoryPath = (
  sectionSlug: string,
  subcategorySlug: string
): string => `/${sectionSlug}/${subcategorySlug}`;

/**
 * Path to an article.
 * Without subcategory: /:sectionSlug/:postSlug
 * With subcategory:    /:sectionSlug/:subcategorySlug/:postSlug
 */
export const postPath = (
  sectionSlug: string,
  postSlug: string,
  subcategorySlug?: string
): string =>
  subcategorySlug
    ? `/${sectionSlug}/${subcategorySlug}/${postSlug}`
    : `/${sectionSlug}/${postSlug}`;

/** Path to a profile */
export const profilePath = (slug: string): string =>
  `${ROUTES.PROFILES}/${slug}`;

/** Path to a tag */
export const tagPath = (slug: string): string =>
  `${ROUTES.TAGS}/${slug}`;

// ---------------------------------------------------------------------------
// Absolute URL builders (for SEO, schema, Open Graph, sharing)
// ---------------------------------------------------------------------------

/** Build absolute URL from a relative path */
export const absoluteUrl = (path: string): string =>
  `${SITE_URL}${path}`;

/** Absolute URL to a section */
export const sectionUrl = (sectionSlug: string): string =>
  absoluteUrl(sectionPath(sectionSlug));

/** Absolute URL to a subcategory */
export const subcategoryUrl = (
  sectionSlug: string,
  subcategorySlug: string
): string => absoluteUrl(subcategoryPath(sectionSlug, subcategorySlug));

/** Absolute URL to an article */
export const postUrl = (
  sectionSlug: string,
  postSlug: string,
  subcategorySlug?: string
): string => absoluteUrl(postPath(sectionSlug, postSlug, subcategorySlug));

/** Absolute URL to a profile */
export const profileUrl = (slug: string): string =>
  absoluteUrl(profilePath(slug));

/** Absolute URL to a tag */
export const tagUrl = (slug: string): string =>
  absoluteUrl(tagPath(slug));

// ---------------------------------------------------------------------------
// Navigation items (consumed by Header, Footer, etc.)
// ---------------------------------------------------------------------------

export const NAV_ITEMS: { label: string; href: string }[] = [
  { label: 'Inicio', href: ROUTES.HOME },
  { label: 'Secciones', href: ROUTES.SECTIONS },
  { label: 'Perfiles', href: ROUTES.PROFILES },
  { label: 'Sobre Nosotros', href: ROUTES.ABOUT },
];
