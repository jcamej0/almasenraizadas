/**
 * Sanity CMS client configuration for Almas Enraizadas wellness blog.
 * Used for fetching content from Sanity Studio.
 */

import { createClient } from 'next-sanity';

/** Default dataset when env var is not set */
const DEFAULT_DATASET = 'production';

/** Default API version for GROQ compatibility */
const DEFAULT_API_VERSION = '2024-01-01';

/** Whether Sanity is configured (projectId exists) */
const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';

/**
 * Sanity client configuration.
 * Reads from environment: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * NEXT_PUBLIC_SANITY_API_VERSION.
 */
export const config = {
  projectId: PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? DEFAULT_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION,
  useCdn: process.env.NODE_ENV === 'production',
} as const;

/**
 * Sanity client instance for fetching content.
 * Returns empty arrays when Sanity is not configured.
 */
export const client = PROJECT_ID
  ? createClient(config)
  : createSafeClient();

/**
 * Creates a mock client that returns empty results when
 * projectId is not configured (e.g. during initial builds).
 */
function createSafeClient() {
  return {
    fetch: async () => [],
    config: () => config,
  } as unknown as ReturnType<typeof createClient>;
}
