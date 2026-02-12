/**
 * GROQ queries for Almas Enraizadas wellness blog.
 * All Sanity content fetching uses these named constants.
 */

import { groq } from 'next-sanity';

/**
 * Reusable field projection for posts.
 * Includes expanded author, section, and tags references.
 * Excludes body for list views; use with body in full post queries.
 */
export const POST_FIELDS = groq`
  _id,
  title,
  slug,
  excerpt,
  publishedAt,
  mainImage,
  aiSummary,
  rating,
  readingTime,
  author->{
    _id,
    name,
    slug,
    bio,
    image,
    role,
    socialLinks
  },
  section->{
    _id,
    title,
    slug,
    description,
    image,
    order
  },
  subcategory->{
    _id,
    title,
    slug,
    description,
    section->{
      _id,
      title,
      slug
    }
  },
  tags[]->{
    _id,
    title,
    slug,
    description
  }
`;

/**
 * Get all posts ordered by publishedAt descending.
 */
export const ALL_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc) {
  ${POST_FIELDS}
}`;

/**
 * Single post by slug with full body content.
 * Use with client.fetch(POST_BY_SLUG_QUERY, { slug }).
 */
export const POST_BY_SLUG_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  ${POST_FIELDS},
  body
}`;

/**
 * Posts filtered by section slug.
 * Use with client.fetch(POSTS_BY_SECTION_QUERY, { sectionSlug }).
 */
export const POSTS_BY_SECTION_QUERY = groq`*[_type == "post" && section->slug.current == $sectionSlug] | order(publishedAt desc) {
  ${POST_FIELDS}
}`;

/**
 * Posts filtered by tag slug.
 * Use with client.fetch(POSTS_BY_TAG_QUERY, { tagSlug }).
 */
export const POSTS_BY_TAG_QUERY = groq`*[_type == "post" && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
  ${POST_FIELDS}
}`;

/**
 * All authors with basic fields.
 */
export const ALL_AUTHORS_QUERY = groq`*[_type == "author"] | order(name asc) {
  _id,
  name,
  slug,
  bio,
  image,
  role,
  socialLinks
}`;

/**
 * Single author by slug with their posts.
 * Use with client.fetch(AUTHOR_BY_SLUG_QUERY, { slug }).
 */
export const AUTHOR_BY_SLUG_QUERY = groq`*[_type == "author" && slug.current == $slug][0] {
  _id,
  name,
  slug,
  bio,
  image,
  role,
  socialLinks,
  "posts": *[_type == "post" && author->slug.current == ^.slug.current] | order(publishedAt desc) {
    ${POST_FIELDS}
  }
}`;

/**
 * All sections ordered by order field.
 */
export const ALL_SECTIONS_QUERY = groq`*[_type == "section"] | order(order asc) {
  _id,
  title,
  slug,
  description,
  image,
  order
}`;

/**
 * Single section by slug with its posts.
 * Use with client.fetch(SECTION_BY_SLUG_QUERY, { slug }).
 */
export const SECTION_BY_SLUG_QUERY = groq`*[_type == "section" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  image,
  order,
  "posts": *[_type == "post" && section->slug.current == ^.slug.current] | order(publishedAt desc) {
    ${POST_FIELDS}
  }
}`;

/**
 * All tags.
 */
export const ALL_TAGS_QUERY = groq`*[_type == "tag"] | order(title asc) {
  _id,
  title,
  slug,
  description
}`;

/**
 * Site settings singleton (single document).
 * Typically stored as _type == "siteSettings" with _id == "siteSettings".
 */
export const SITE_SETTINGS_QUERY = groq`*[_type == "siteSettings"][0] {
  title,
  description,
  logo,
  socialLinks,
  navigation
}`;

/**
 * Latest N posts for homepage/recents.
 * Use with client.fetch(RECENT_POSTS_QUERY, { limit: 5 }).
 */
export const RECENT_POSTS_QUERY = groq`*[_type == "post"] | order(publishedAt desc)[0...$limit] {
  ${POST_FIELDS}
}`;

/**
 * Related posts: same section or shared tags, excluding current post.
 * Use with client.fetch(RELATED_POSTS_QUERY, { postId, sectionId, tagIds, limit }).
 * Pass tagIds as array of _id strings.
 */
export const RELATED_POSTS_QUERY = groq`*[
  _type == "post" &&
  _id != $postId &&
  (
    section._ref == $sectionId ||
    count((tags[]->_id)[@ in $tagIds]) > 0
  )
] | order(publishedAt desc)[0...$limit] {
  ${POST_FIELDS}
}`;

// ---------------------------------------------------------------------------
// Subcategory queries
// ---------------------------------------------------------------------------

/**
 * All subcategories for a given section slug.
 * Use with client.fetch(SUBCATEGORIES_BY_SECTION_QUERY, { sectionSlug }).
 */
export const SUBCATEGORIES_BY_SECTION_QUERY = groq`*[
  _type == "subcategory" &&
  section->slug.current == $sectionSlug
] | order(order asc) {
  _id,
  title,
  slug,
  description,
  image,
  order,
  section->{
    _id,
    title,
    slug
  },
  "postCount": count(*[_type == "post" && subcategory._ref == ^._id])
}`;

/**
 * Single subcategory by slug within a section, including its posts.
 * Use with client.fetch(SUBCATEGORY_BY_SLUG_QUERY, { sectionSlug, subcategorySlug }).
 */
export const SUBCATEGORY_BY_SLUG_QUERY = groq`*[
  _type == "subcategory" &&
  slug.current == $subcategorySlug &&
  section->slug.current == $sectionSlug
][0] {
  _id,
  title,
  slug,
  description,
  image,
  order,
  section->{
    _id,
    title,
    slug,
    description,
    image,
    order
  },
  "posts": *[
    _type == "post" &&
    subcategory._ref == ^._id
  ] | order(publishedAt desc) {
    ${POST_FIELDS}
  }
}`;

/**
 * Posts filtered by section slug that have NO subcategory.
 * Used for the section detail page to show only direct posts.
 */
export const POSTS_BY_SECTION_NO_SUBCATEGORY_QUERY = groq`*[
  _type == "post" &&
  section->slug.current == $sectionSlug &&
  !defined(subcategory)
] | order(publishedAt desc) {
  ${POST_FIELDS}
}`;

/**
 * Section by slug with direct posts (no subcategory) and its subcategories.
 */
export const SECTION_WITH_SUBCATEGORIES_QUERY = groq`*[_type == "section" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  description,
  image,
  order,
  "posts": *[
    _type == "post" &&
    section->slug.current == ^.slug.current &&
    !defined(subcategory)
  ] | order(publishedAt desc) {
    ${POST_FIELDS}
  },
  "subcategories": *[
    _type == "subcategory" &&
    section._ref == ^._id
  ] | order(order asc) {
    _id,
    title,
    slug,
    description,
    image,
    order,
    "postCount": count(*[_type == "post" && subcategory._ref == ^._id])
  }
}`;
