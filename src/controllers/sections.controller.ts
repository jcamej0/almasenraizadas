/**
 * Sections data controller.
 * Fetches and shapes section data from Sanity CMS.
 */
import { client } from '@/services/sanity/client';
import {
  ALL_SECTIONS_QUERY,
  SECTION_WITH_SUBCATEGORIES_QUERY,
} from '@/services/sanity/queries';
import type { Section, PostListItem } from '@/lib/types';
import type { SubcategoryListItem } from './subcategories.controller';

/** Section with direct posts and its subcategories */
export type SectionWithPosts = Section & {
  posts: PostListItem[];
  subcategories: SubcategoryListItem[];
};

/** Fetch all sections for listing */
export const fetchAllSections = async (): Promise<Section[]> => {
  return client.fetch(ALL_SECTIONS_QUERY);
};

/** Fetch a single section by slug with direct posts and subcategories */
export const fetchSectionBySlug = async (slug: string): Promise<SectionWithPosts | null> => {
  return client.fetch(SECTION_WITH_SUBCATEGORIES_QUERY, { slug });
};

/** Get all section slugs for static generation */
export const fetchAllSectionSlugs = async (): Promise<string[]> => {
  const sections = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type == "section"]{ slug }`
  );
  return sections.map(({ slug }) => slug.current);
};
