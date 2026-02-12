import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import RichSchema from '@/components/seo/RichSchema';
import { buildWebsiteSchema, buildOrganizationSchema } from '@/components/seo/schema-builders';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/constants';
import '@/styles/globals.scss';

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Bienestar, Mindfulness y Crecimiento Personal`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <a href="#main-content" className="skip-to-content">
          Saltar al contenido
        </a>
        <Header />
        <main id="main-content">
          {children}
        </main>
        <Footer />
        <RichSchema data={buildWebsiteSchema()} />
        <RichSchema data={buildOrganizationSchema()} />
      </body>
    </html>
  );
}
