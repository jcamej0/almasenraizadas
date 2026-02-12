import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /** Enable SASS support (sass package already installed) */
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },

  /** Optimize images from Sanity CDN */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        pathname: '/images/**',
      },
    ],
  },

  /**
   * Permanent 301 redirects from legacy URL prefixes.
   * /blog/:slug  → /secciones  (cannot deterministically map to new section-based URL)
   * /blog        → /secciones
   * /categorias  → /secciones
   */
  redirects: async () => [
    {
      source: '/blog/:slug',
      destination: '/secciones',
      permanent: true,
    },
    {
      source: '/blog',
      destination: '/secciones',
      permanent: true,
    },
    {
      source: '/categorias/:slug*',
      destination: '/secciones',
      permanent: true,
    },
    {
      source: '/categorias',
      destination: '/secciones',
      permanent: true,
    },
  ],

  /** Security and performance headers */
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
};

export default nextConfig;
