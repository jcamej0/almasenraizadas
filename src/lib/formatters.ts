/**
 * Pure utility functions for Almas Enraizadas.
 * No side effects, native JS only.
 */

const DEFAULT_EXCERPT_LENGTH = 160;
const WORDS_PER_MINUTE = 200;
const ELLIPSIS = '…';

/**
 * Extracts plain text from Sanity Portable Text blocks.
 * @param blocks - Array of Portable Text block objects
 * @returns Concatenated plain text string
 */
const extractPortableText = (blocks: unknown[]): string =>
  blocks
    .filter((b): b is Record<string, unknown> => typeof b === 'object' && b !== null)
    .filter((b) => b._type === 'block' && Array.isArray(b.children))
    .map((b) =>
      (b.children as { text?: string }[])
        .map((child) => child.text ?? '')
        .join('')
    )
    .join(' ');

/**
 * Formats an ISO date string to Spanish locale.
 * @param dateString - ISO 8601 date string
 * @returns Formatted date in Spanish (e.g. "12 de febrero de 2025")
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/**
 * Formats reading time in minutes for display.
 * @param minutes - Estimated reading time
 * @returns Human-readable string (e.g. "5 min de lectura")
 */
export const formatReadingTime = (minutes: number): string => {
  const rounded = Math.ceil(minutes);
  return rounded <= 1
    ? '1 min de lectura'
    : `${rounded} min de lectura`;
};

/**
 * Truncates text to a maximum length with ellipsis.
 * @param text - Input text
 * @param maxLength - Maximum character count
 * @returns Truncated string
 */
export const truncateText = (text: unknown, maxLength: number): string => {
  if (!text) return '';
  const str = Array.isArray(text)
    ? extractPortableText(text)
    : String(text);
  const trimmed = str.trim();
  if (trimmed.length <= maxLength) return trimmed;
  const cut = trimmed.slice(0, maxLength - ELLIPSIS.length);
  const lastSpace = cut.lastIndexOf(' ');
  const end = lastSpace > maxLength / 2 ? lastSpace : cut.length;
  return cut.slice(0, end).trimEnd() + ELLIPSIS;
};

/**
 * Converts a slug to a title (capitalize words, replace hyphens).
 * @param slug - URL slug (e.g. "bienestar-emocional")
 * @returns Title (e.g. "Bienestar Emocional")
 */
export const slugToTitle = (slug: string): string => {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Builds a share URL for a given platform.
 * @param platform - twitter, x, facebook, whatsapp, linkedin
 * @param url - Page URL to share
 * @param title - Share title/headline
 * @returns Full share URL
 */
export const buildShareUrl = (
  platform: string,
  url: string,
  title: string
): string => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const lower = platform.toLowerCase();

  if (lower === 'twitter' || lower === 'x') {
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
  }
  if (lower === 'facebook') {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  }
  if (lower === 'whatsapp') {
    return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  }
  if (lower === 'linkedin') {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  }

  return url;
};

/**
 * Extracts plain text from a string (strips HTML-like content).
 * Used for word counting in reading-time calculation.
 */
const extractPlainText = (text: string): string => {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};

/**
 * Estimates reading time in minutes from plain text.
 * @param text - Content to measure
 * @returns Estimated minutes
 */
export const calculateReadingTime = (text: string): number => {
  const plain = extractPlainText(text);
  const words = plain.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
};

/**
 * Generates an excerpt from text, truncated at maxLength.
 * @param text - Source text
 * @param maxLength - Optional max chars (default 160)
 * @returns Truncated excerpt
 */
export const generateExcerpt = (
  text: string,
  maxLength: number = DEFAULT_EXCERPT_LENGTH
): string => {
  const plain = extractPlainText(text);
  return truncateText(plain, maxLength);
};
