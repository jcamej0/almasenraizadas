/**
 * Subcategories data controller.
 * Fetches and shapes subcategory data from Sanity CMS.
 */
import { client } from '@/services/sanity/client';
import {
  SUBCATEGORIES_BY_SECTION_QUERY,
  SUBCATEGORY_BY_SLUG_QUERY,
} from '@/services/sanity/queries';
import type { Subcategory, PostListItem } from '@/lib/types';

/** Subcategory with post count (for listing cards) */
export type SubcategoryListItem = Subcategory & { postCount: number };

/** Subcategory with its associated posts */
export type SubcategoryWithPosts = Subcategory & { posts: PostListItem[] };

/** Fetch all subcategories for a given section */
export const fetchSubcategoriesBySection = async (
  sectionSlug: string
): Promise<SubcategoryListItem[]> => {
  return client.fetch(SUBCATEGORIES_BY_SECTION_QUERY, { sectionSlug });
};

/** Fetch a single subcategory by slug within a section, with its posts */
export const fetchSubcategoryBySlug = async (
  sectionSlug: string,
  subcategorySlug: string
): Promise<SubcategoryWithPosts | null> => {
  return client.fetch(SUBCATEGORY_BY_SLUG_QUERY, { sectionSlug, subcategorySlug });
};

/** Get all subcategory slug pairs (section + subcategory) for static generation */
export const fetchAllSubcategorySlugs = async (): Promise<
  { sectionSlug: string; subcategorySlug: string }[]
> => {
  const subcategories = await client.fetch<
    { slug: { current: string }; section: { slug: { current: string } } }[]
  >(`*[_type == "subcategory"]{ slug, section->{ slug } }`);

  return subcategories
    .filter((s) => s.section?.slug?.current)
    .map(({ slug, section }) => ({
      sectionSlug: section.slug.current,
      subcategorySlug: slug.current,
    }));
};
