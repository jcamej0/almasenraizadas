/**
 * Sanity Studio embedded route.
 * Accessible at /studio — provides full CMS management.
 */
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
