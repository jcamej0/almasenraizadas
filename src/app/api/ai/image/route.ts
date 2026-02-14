/**
 * AI image generation API route.
 * Generates images via OpenAI DALL-E based on a prompt.
 * Returns an array of image URLs (temporary OpenAI URLs, valid ~1h).
 */
import { NextRequest, NextResponse } from 'next/server';

const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const IMAGE_MODEL = 'dall-e-3';
const IMAGE_SIZE = '1792x1024';
const IMAGE_QUALITY = 'standard';
const MAX_PROMPT_LENGTH = 1000;
const DEFAULT_COUNT = 2;
const MAX_COUNT = 4;

interface ImageRequestBody {
  prompt: string;
  count?: number;
}

interface DalleResponse {
  data: { url: string; revised_prompt: string }[];
}

/** Build an optimized image prompt for wellness/yoga blog imagery */
const buildImagePrompt = (userPrompt: string): string => [
  'Create a beautiful, serene illustration for a wellness and yoga blog.',
  'Style: soft watercolor or pastel digital art, warm natural tones (sage green, beige, soft mauve).',
  'The image should feel calming, modern, and professional.',
  'No text, no logos, no watermarks.',
  `Subject: ${userPrompt.slice(0, MAX_PROMPT_LENGTH)}`,
].join(' ');

/** Validate the request */
const validateRequest = (body: ImageRequestBody): string | null => {
  if (!body.prompt || body.prompt.trim().length === 0) {
    return 'A prompt is required';
  }
  if (body.count && (body.count < 1 || body.count > MAX_COUNT)) {
    return `Count must be between 1 and ${MAX_COUNT}`;
  }
  return null;
};

/** Generate a single image via DALL-E 3 */
const generateSingleImage = async (
  apiKey: string,
  prompt: string
): Promise<{ url: string; revisedPrompt: string }> => {
  const response = await fetch(OPENAI_IMAGES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: IMAGE_MODEL,
      prompt,
      n: 1,
      size: IMAGE_SIZE,
      quality: IMAGE_QUALITY,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `DALL-E API error (${response.status}): ${errorData?.error?.message ?? 'Unknown error'}`
    );
  }

  const data: DalleResponse = await response.json();
  const image = data.data[0];

  return {
    url: image.url,
    revisedPrompt: image.revised_prompt,
  };
};

export async function POST(request: NextRequest) {
  try {
    const body: ImageRequestBody = await request.json();
    const validationError = validateRequest(body);

    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured' },
        { status: 503 }
      );
    }

    const count = Math.min(body.count ?? DEFAULT_COUNT, MAX_COUNT);
    const optimizedPrompt = buildImagePrompt(body.prompt);

    /** DALL-E 3 only supports n=1, so we fire multiple requests in parallel */
    const results = await Promise.allSettled(
      Array.from({ length: count }).map(() =>
        generateSingleImage(apiKey, optimizedPrompt)
      )
    );

    const images = results
      .filter(
        (r): r is PromiseFulfilledResult<{ url: string; revisedPrompt: string }> =>
          r.status === 'fulfilled'
      )
      .map((r) => r.value);

    if (images.length === 0) {
      const firstError = results.find(
        (r): r is PromiseRejectedResult => r.status === 'rejected'
      );
      throw new Error(
        firstError?.reason?.message ?? 'All image generations failed'
      );
    }

    return NextResponse.json({ images });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    const status = message.includes('not configured') ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
