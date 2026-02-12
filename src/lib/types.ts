/**
 * TypeScript interfaces and types for Almas Enraizadas wellness blog.
 * Sanity CMS and Supabase data shapes.
 */

/** Sanity image reference with optional alt text */
export interface SanityImage {
  _type: 'image';
  asset: { _ref: string; _type: 'reference' };
  alt?: string;
}

/** Author of blog posts */
export interface Author {
  _id: string;
  name: string;
  slug: { current: string };
  bio?: PortableTextBlock[] | string;
  image?: SanityImage;
  role?: string;
  socialLinks?: { platform: string; url: string }[];
}

/** Tag for categorizing posts */
export interface Tag {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
}

/** Section/column grouping for content */
export interface Section {
  _id: string;
  title: string;
  slug: { current: string };
  description: string;
  image?: SanityImage;
  order: number;
}

/** Subcategory within a section (e.g. Guías, Noticias) */
export interface Subcategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  section: Section;
  image?: SanityImage;
  order?: number;
}

/** Sanity portable text block (simplified) */
export type PortableTextBlock = Record<string, unknown>;

/** Full blog post with body content */
export interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  body: PortableTextBlock[];
  publishedAt: string;
  author: Author;
  section: Section;
  subcategory?: Subcategory;
  tags: Tag[];
  mainImage: SanityImage;
  aiSummary?: string;
  rating?: number;
  readingTime?: number;
}

/** Post fields for listing/cards (excludes body) */
export type PostListItem = Pick<
  Post,
  | '_id'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'publishedAt'
  | 'author'
  | 'section'
  | 'subcategory'
  | 'tags'
  | 'mainImage'
  | 'aiSummary'
  | 'rating'
  | 'readingTime'
>;

/** Site-wide configuration from Sanity */
export interface SiteSettings {
  title: string;
  description: string;
  logo?: SanityImage;
  socialLinks: { platform: string; url: string }[];
  navigation: { label: string; href: string }[];
}

/** JSON-LD structured data for SEO */
export interface RichSchemaData {
  '@context': string;
  '@type': string;
  [key: string]: unknown;
}
