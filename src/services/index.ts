/**
 * Services barrel for Almas Enraizadas wellness blog.
 * Re-exports Sanity and Supabase clients and utilities.
 */

export { client, config } from './sanity/client';
export {
  ALL_AUTHORS_QUERY,
  ALL_POSTS_QUERY,
  ALL_SECTIONS_QUERY,
  ALL_TAGS_QUERY,
  AUTHOR_BY_SLUG_QUERY,
  POST_BY_SLUG_QUERY,
  POST_FIELDS,
  POSTS_BY_SECTION_QUERY,
  POSTS_BY_TAG_QUERY,
  RECENT_POSTS_QUERY,
  RELATED_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
} from './sanity/queries';
export { getImageUrl, urlFor } from './sanity/image';
export { supabase } from './supabase/client';
