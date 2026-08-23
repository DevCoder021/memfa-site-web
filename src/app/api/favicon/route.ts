import { NextResponse } from 'next/server';

export async function GET() {
  // Ce SVG agit comme un conteneur carré (1:1) pour ton logo rectangulaire
  // L'image à l'intérieur est centrée et garde ses proportions (preserveAspectRatio)
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <image 
        href="/assets/logo.png" 
        x="0" 
        y="25" 
        width="100" 
        height="50" 
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  `.trim();

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
