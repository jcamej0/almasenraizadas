import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Almas Enraizadas — Studio',
  description: 'Panel de administración de contenido',
  robots: { index: false, follow: false },
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
