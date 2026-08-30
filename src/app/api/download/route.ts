import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_HOSTNAME_PATTERNS = [
  /\.public\.blob\.vercel-storage\.com$/,
  /^blob\.vercel\.app$/,
];

function isAllowedUrl(rawUrl: string): boolean {
  try {
    const u = new URL(rawUrl);
    if (u.protocol !== 'https:') return false;
    return ALLOWED_HOSTNAME_PATTERNS.some((p) => p.test(u.hostname));
  } catch {
    return false;
  }
}

function sanitizeFilename(name: string): string {
  const fallback = 'document.pdf';
  if (typeof name !== 'string' || !name) return fallback;
  const cleaned = name
    .replace(/[\\/:*?"<>|]/g, '_')
    .replace(/[\r\n\t]/g, '')
    .replace(/\0/g, '')
    .slice(0, 200);
  return cleaned || fallback;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const rawFilename = searchParams.get('filename') || 'document.pdf';

  if (!url) {
    return new NextResponse('URL manquante', { status: 400 });
  }

  if (!isAllowedUrl(url)) {
    return new NextResponse('URL non autorisee', { status: 400 });
  }

  const filename = sanitizeFilename(rawFilename);

  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la recuperation du fichier : ${response.status}`);
    }

    const blob = await response.blob();
    const headers = new Headers();

    const safeFilename = encodeURIComponent(filename).replace(/['()]/g, escape);
    headers.set(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${safeFilename}`
    );
    const ct = response.headers.get('Content-Type');
    headers.set('Content-Type', ct && ct.startsWith('application/') ? ct : 'application/pdf');
    headers.set('X-Content-Type-Options', 'nosniff');
    headers.set('Content-Security-Policy', "default-src 'none'");

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      const msg = error instanceof Error ? error.message : String(error);
      console.error('Erreur Proxy Download:', msg);
    }
    return new NextResponse('Erreur telechargement', { status: 500 });
  }
}
