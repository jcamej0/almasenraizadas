/**
 * Image proxy route.
 * Downloads an image from an external URL server-side (bypassing CORS)
 * and streams it back to the client as a binary response.
 */
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTS = [
  'oaidalleapiprodscus.blob.core.windows.net',
  'dalleprodsec.blob.core.windows.net',
  'oaidalle.blob.core.windows.net',
];

const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB safety limit

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    /** Validate URL is from OpenAI */
    const parsed = new URL(url);
    const isAllowed = ALLOWED_HOSTS.some((host) => parsed.hostname.endsWith(host));

    if (!isAllowed) {
      return NextResponse.json({ error: 'URL not allowed' }, { status: 403 });
    }

    /** Download image server-side (no CORS issues) */
    const imageResponse = await fetch(url);

    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: `Failed to download image: ${imageResponse.status}` },
        { status: 502 }
      );
    }

    const contentLength = imageResponse.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'Image too large' }, { status: 413 });
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const contentType = imageResponse.headers.get('content-type') ?? 'image/png';

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': imageBuffer.byteLength.toString(),
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Proxy error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
