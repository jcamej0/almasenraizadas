/**
 * Posts data controller.
 * Fetches and shapes post data from Sanity CMS.
 */
import { client } from '@/services/sanity/client';
import {
  ALL_POSTS_QUERY,
  POST_BY_SLUG_QUERY,
  POSTS_BY_SECTION_QUERY,
  POSTS_BY_TAG_QUERY,
  RECENT_POSTS_QUERY,
  RELATED_POSTS_QUERY,
} from '@/services/sanity/queries';
import type { Post, PostListItem } from '@/lib/types';
import { POSTS_PER_PAGE } from '@/lib/constants';

/** Fetch all posts for listing */
export const fetchAllPosts = async (): Promise<PostListItem[]> => {
  return client.fetch(ALL_POSTS_QUERY);
};

/** Fetch a single post by its slug */
export const fetchPostBySlug = async (slug: string): Promise<Post | null> => {
  return client.fetch(POST_BY_SLUG_QUERY, { slug });
};

/** Fetch posts filtered by section slug */
export const fetchPostsBySection = async (sectionSlug: string): Promise<PostListItem[]> => {
  return client.fetch(POSTS_BY_SECTION_QUERY, { sectionSlug });
};

/** Fetch posts filtered by tag slug */
export const fetchPostsByTag = async (tagSlug: string): Promise<PostListItem[]> => {
  return client.fetch(POSTS_BY_TAG_QUERY, { tagSlug });
};

/** Fetch recent posts (homepage) */
export const fetchRecentPosts = async (limit: number = POSTS_PER_PAGE): Promise<PostListItem[]> => {
  return client.fetch(RECENT_POSTS_QUERY, { limit });
};

/** Fetch related posts for a given post */
export const fetchRelatedPosts = async (
  postId: string,
  sectionId: string,
  tagIds: string[],
  limit: number = 3
): Promise<PostListItem[]> => {
  return client.fetch(RELATED_POSTS_QUERY, { postId, sectionId, tagIds, limit });
};

/** Slug tuple for static generation (section + optional subcategory + post) */
export type PostSlugTuple = {
  sectionSlug: string;
  subcategorySlug?: string;
  postSlug: string;
};

/** Get all post slug tuples for static generation */
export const fetchAllPostSlugs = async (): Promise<PostSlugTuple[]> => {
  const posts = await client.fetch<{
    slug: { current: string };
    section: { slug: { current: string } };
    subcategory?: { slug: { current: string } } | null;
  }[]>(
    `*[_type == "post"]{ slug, section->{ slug }, subcategory->{ slug } }`
  );

  return posts
    .filter((p) => p.section?.slug?.current)
    .map(({ slug, section, subcategory }) => ({
      sectionSlug: section.slug.current,
      ...(subcategory?.slug?.current
        ? { subcategorySlug: subcategory.slug.current }
        : {}),
      postSlug: slug.current,
    }));
};
