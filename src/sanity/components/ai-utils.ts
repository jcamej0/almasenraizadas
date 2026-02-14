/**
 * Shared utilities for Sanity AI-assisted input components.
 */

const AI_API_ENDPOINT = '/api/ai';

export type AiAction = 'summary' | 'excerpt' | 'seoTitle' | 'readingTime' | 'bodyContent';

interface AiResponse {
  result?: string;
  error?: string;
}

/** Extract plain text from Portable Text blocks */
export const extractPlainText = (blocks: unknown): string => {
  if (!Array.isArray(blocks)) return '';

  return blocks
    .filter(
      (block): block is Record<string, unknown> =>
        typeof block === 'object' &&
        block !== null &&
        (block as Record<string, unknown>)._type === 'block'
    )
    .map((block) => {
      const children = block.children as { text?: string }[] | undefined;
      if (!Array.isArray(children)) return '';
      return children.map((child) => child.text ?? '').join('');
    })
    .join('\n');
};

/** Call the AI API route */
export const fetchAiResult = async (
  action: AiAction,
  title: string,
  body: string
): Promise<string> => {
  const response = await fetch(AI_API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, title, body }),
  });

  const data: AiResponse = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error ?? `Error ${response.status}`);
  }

  return data.result ?? '';
};
