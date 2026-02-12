/**
 * Profiles (authors) data controller.
 * Fetches and shapes author data from Sanity CMS.
 */
import { client } from '@/services/sanity/client';
import { ALL_AUTHORS_QUERY, AUTHOR_BY_SLUG_QUERY } from '@/services/sanity/queries';
import type { Author, PostListItem } from '@/lib/types';

/** Author with their associated posts */
export type AuthorWithPosts = Author & { posts: PostListItem[] };

/** Fetch all authors/profiles for listing */
export const fetchAllProfiles = async (): Promise<Author[]> => {
  return client.fetch(ALL_AUTHORS_QUERY);
};

/** Fetch a single author by slug with their posts */
export const fetchProfileBySlug = async (slug: string): Promise<AuthorWithPosts | null> => {
  return client.fetch(AUTHOR_BY_SLUG_QUERY, { slug });
};

/** Get all author slugs for static generation */
export const fetchAllProfileSlugs = async (): Promise<string[]> => {
  const authors = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "author"]{ slug }`
  );
  return authors.map(({ slug }) => slug.current);
};
