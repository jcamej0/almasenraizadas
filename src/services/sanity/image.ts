/**
 * Sanity image URL builder for Almas Enraizadas wellness blog.
 * Generates optimized image URLs from Sanity asset references.
 */

import { createImageUrlBuilder } from '@sanity/image-url';
import { config } from './client';

/** Default width for getImageUrl when no dimensions provided */
const DEFAULT_WIDTH = 1200;

/** Default height for getImageUrl when no dimensions provided */
const DEFAULT_HEIGHT = 800;

/** Sanity image source type — accepts any object with image data */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ImageSource = Record<string, any>;

/** Image builder instance (only works when projectId is configured) */
const builder = config.projectId
  ? createImageUrlBuilder({ projectId: config.projectId, dataset: config.dataset })
  : null;

/**
 * Image URL builder configured with the Sanity project.
 * Chain methods for custom transformations: .width(400).height(300).quality(80)
 *
 * @param source - Sanity image reference (e.g. from mainImage, author.image)
 * @returns Builder instance for method chaining; call .url() for final string
 */
export const urlFor = (source: ImageSource) => {
  if (!builder) return { url: () => '' };
  return builder.image(source);
};

/**
 * Get a ready-to-use image URL string with default dimensions.
 * Use for simple cases where no chaining is needed.
 *
 * @param source - Sanity image reference
 * @param width - Optional width override (default: 1200)
 * @param height - Optional height override (default: 800)
 * @returns URL string, or empty string if source is null/undefined
 */
export const getImageUrl = (
  source: ImageSource | null | undefined,
  width: number = DEFAULT_WIDTH,
  height: number = DEFAULT_HEIGHT
): string => {
  if (source == null || !builder) return '';
  return builder.image(source).width(width).height(height).url();
};
