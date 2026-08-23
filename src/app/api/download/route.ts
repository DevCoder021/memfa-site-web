import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'document.pdf';

  if (!url) {
    return new NextResponse('URL manquante', { status: 400 });
  }

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération du fichier : ${response.statusText}`);
    }

    const blob = await response.blob();
    const headers = new Headers();
    
    // Forcer le téléchargement avec Content-Disposition
    headers.set('Content-Disposition', `attachment; filename="${filename}"`);
    headers.set('Content-Type', response.headers.get('Content-Type') || 'application/pdf');

    return new NextResponse(blob, {
      status: 200,
      headers,
    });
  } catch (error: any) {
    console.error('Erreur Proxy Download:', error);
    return new NextResponse(`Erreur: ${error.message}`, { status: 500 });
  }
}
