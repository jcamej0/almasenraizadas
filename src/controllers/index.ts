/**
 * Controllers barrel file.
 * Re-exports all data fetching controllers for pages and server components.
 */

export {
  fetchAllPosts,
  fetchAllPostSlugs,
  fetchPostBySlug,
  fetchPostsBySection,
  fetchPostsByTag,
  fetchRecentPosts,
  fetchRelatedPosts,
} from './posts.controller';
export type { PostSlugTuple } from './posts.controller';

export {
  fetchAllProfiles,
  fetchAllProfileSlugs,
  fetchProfileBySlug,
} from './profiles.controller';
export type { AuthorWithPosts } from './profiles.controller';

export {
  fetchAllSections,
  fetchAllSectionSlugs,
  fetchSectionBySlug,
} from './sections.controller';
export type { SectionWithPosts } from './sections.controller';

export {
  fetchSubcategoriesBySection,
  fetchSubcategoryBySlug,
  fetchAllSubcategorySlugs,
} from './subcategories.controller';
export type { SubcategoryListItem, SubcategoryWithPosts } from './subcategories.controller';

export { fetchSiteSettings } from './settings.controller';
