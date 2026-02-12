/**
 * Pure functions that build JSON-LD structured data for SEO.
 * Almas Enraizadas wellness blog — Schema.org compliant.
 */

import { SITE_NAME, SITE_URL } from '@/lib/constants';
import { postUrl, profileUrl, sectionUrl, absoluteUrl, ROUTES } from '@/lib/routes';
import { truncateText } from '@/lib/formatters';
import type { Author, Post } from '@/lib/types';

/** WebSite schema with search action. */
export const buildWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${absoluteUrl(ROUTES.SEARCH)}?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
});

/** Organization schema with name, url, logo. */
export const buildOrganizationSchema = (logoUrl?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  ...(logoUrl && { logo: logoUrl }),
});

/**
 * BlogPosting schema from a post.
 * Uses section slug + post slug to build canonical URL.
 */
export const buildBlogPostSchema = (
  post: Post,
  opts?: { imageUrl?: string; wordCount?: number }
) => {
  const sectionSlug = post.section?.slug?.current ?? '';
  const subcategorySlug = post.subcategory?.slug?.current;
  const postSlug = post.slug.current;

  const base = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    url: postUrl(sectionSlug, postSlug, subcategorySlug),
    datePublished: post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: profileUrl(post.author.slug.current),
    },
    description: post.excerpt,
    articleSection: post.section?.title,
    keywords: post.tags?.map((t) => t.title).join(', ') || undefined,
    ...(opts?.imageUrl && { image: opts.imageUrl }),
    ...(opts?.wordCount && { wordCount: opts.wordCount }),
  };
  const withRating = post.rating
    ? { ...base, aggregateRating: { '@type': 'AggregateRating', ratingValue: post.rating } }
    : base;
  return withRating;
};

/** BreadcrumbList schema for navigation. */
export const buildBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/**
 * Person/Profile schema for author.
 */
export const buildProfileSchema = (author: Author, imageUrl?: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: author.name,
  description: truncateText(author.bio, 160),
  ...(imageUrl && { image: imageUrl }),
  url: profileUrl(author.slug.current),
  sameAs: author.socialLinks?.map((s) => s.url) ?? [],
});

/** ItemList of BlogPosting for article listings. */
export const buildArticleListSchema = (posts: Post[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: posts.map((post, i) => ({
    '@type': 'BlogPosting',
    position: i + 1,
    headline: post.title,
    datePublished: post.publishedAt,
    url: postUrl(
      post.section?.slug?.current ?? '',
      post.slug.current,
      post.subcategory?.slug?.current
    ),
    author: { '@type': 'Person', name: post.author.name },
  })),
});
