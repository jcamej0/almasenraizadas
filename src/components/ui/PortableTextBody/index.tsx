/**
 * Renders Sanity Portable Text content as rich HTML.
 * Maps block types and marks to semantic, accessible elements.
 */

import { PortableText, type PortableTextReactComponents } from '@portabletext/react';
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from '@/services/sanity/image';

/** Image dimensions for inline post images */
const INLINE_IMAGE_WIDTH = 960;
const INLINE_IMAGE_HEIGHT = 540;

/** Custom components for Portable Text rendering */
const components: Partial<PortableTextReactComponents> = {
  types: {
    image: ({ value }) => {
      const url = getImageUrl(value, INLINE_IMAGE_WIDTH, INLINE_IMAGE_HEIGHT);
      if (!url) return null;
      return (
        <figure>
          <Image
            src={url}
            alt={value.alt ?? ''}
            width={INLINE_IMAGE_WIDTH}
            height={INLINE_IMAGE_HEIGHT}
            loading="lazy"
            sizes="(max-width: 767px) 100vw, 720px"
            style={{ borderRadius: '0.5rem', width: '100%', height: 'auto' }}
          />
          {value.alt && <figcaption>{value.alt}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.href?.startsWith('http') ? '_blank' : undefined}
        rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    internalLink: ({ children, value }) => (
      <Link href={value?.slug ? `/${value.slug}` : '#'}>{children}</Link>
    ),
  },
  block: {
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
};

interface PortableTextBodyProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any[];
}

/** Renders Portable Text blocks as semantic HTML */
export const PortableTextBody = ({ value }: PortableTextBodyProps) => {
  if (!value || value.length === 0) return null;
  return <PortableText value={value} components={components} />;
};
