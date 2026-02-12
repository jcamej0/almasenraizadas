/**
 * Site settings data controller.
 * Fetches site-wide configuration from Sanity CMS.
 */
import { client } from '@/services/sanity/client';
import { SITE_SETTINGS_QUERY } from '@/services/sanity/queries';
import type { SiteSettings } from '@/lib/types';

/** Fetch site settings singleton */
export const fetchSiteSettings = async (): Promise<SiteSettings | null> => {
  return client.fetch(SITE_SETTINGS_QUERY);
};
