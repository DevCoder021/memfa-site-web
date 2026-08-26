import { ImageResponse } from 'next/og'

// À placer dans : app/opengraph-image.tsx (racine de l'app)
// Next.js détecte ce fichier automatiquement et génère les balises
// <meta property="og:image"> et <meta name="twitter:image"> tout seul.
// Aucune autre configuration n'est nécessaire.

export const runtime = 'edge'
export const alt = 'MEMFA — Mission Évangélique Maranatha, Foi et Action'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Charge une police Google Fonts en ArrayBuffer (nécessaire pour satori/next-og)
async function loadGoogleFont(fontQuery: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${fontQuery}&text=${encodeURIComponent(text)}`
  const css = await (await fetch(url)).text()
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/)
  if (!match) throw new Error(`Police introuvable pour la requête : ${fontQuery}`)
  const res = await fetch(match[1])
  return res.arrayBuffer()
}

export default async function Image() {
  const title = 'MEMFA'
  const taglinePart1 = 'Mission Évangélique Maranatha'
  const taglinePart2 = 'Foi et Action'
  const verse = '« Vous brillez comme des luminaires dans le monde » — Philippiens 2:15'
  const location = "BOUAKÉ · CÔTE D'IVOIRE"
  const domain = 'memfa.vercel.app'

  const [frauncesBold, frauncesItalic, interSemibold, plexMono] = await Promise.all([
    loadGoogleFont('Fraunces:wght@600', title + taglinePart1 + taglinePart2),
    loadGoogleFont('Fraunces:ital,wght@1,400', verse),
    loadGoogleFont('Inter:wght@500;600', taglinePart1 + taglinePart2 + domain),
    loadGoogleFont("IBM+Plex+Mono:wght@500", location),
  ])

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: '#3A1361',
          padding: '56px 72px',
          overflow: 'hidden',
        }}
      >
        {/* Halo doré décoratif, coin haut-droit */}
        <div
          style={{
            position: 'absolute',
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background:
              'radial-gradient(circle, rgba(240,196,25,0.28) 0%, rgba(240,196,25,0) 70%)',
            display: 'flex',
          }}
        />
        {/* Ligne dégradée or en haut */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: 6,
            background: 'linear-gradient(90deg, #F0C419 0%, rgba(240,196,25,0) 65%)',
            display: 'flex',
          }}
        />

        {/* Ligne du haut : logo + localisation */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <img
            src="https://memfa.vercel.app/assets/logo.png"
            width={52}
            height={52}
            style={{ borderRadius: 8 }}
          />
          <div
            style={{
              display: 'flex',
              fontFamily: 'IBM Plex Mono',
              fontSize: 15,
              letterSpacing: 3,
              color: '#F0C419',
              fontWeight: 500,
            }}
          >
            {location}
          </div>
        </div>

        {/* Bloc central */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            justifyContent: 'center',
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: 'flex',
              fontFamily: 'Fraunces',
              fontWeight: 600,
              fontSize: 118,
              lineHeight: 1,
              color: '#F0C419',
              letterSpacing: -2,
            }}
          >
            {title}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: 14,
              marginTop: 22,
            }}
          >
            <div
              style={{
                display: 'flex',
                fontFamily: 'Inter',
                fontWeight: 600,
                fontSize: 32,
                color: '#FFFFFF',
              }}
            >
              {taglinePart1}
            </div>
            <div
              style={{
                display: 'flex',
                fontFamily: 'Fraunces',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 32,
                color: '#F0C419',
              }}
            >
              {taglinePart2}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              width: 360,
              height: 3,
              marginTop: 30,
              background: 'linear-gradient(90deg, #F0C419 0%, rgba(240,196,25,0) 100%)',
            }}
          />

          <div
            style={{
              display: 'flex',
              marginTop: 30,
              fontFamily: 'Fraunces',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 23,
              color: '#D9C6ED',
              maxWidth: 820,
              lineHeight: 1.5,
            }}
          >
            {verse}
          </div>
        </div>

        {/* Ligne du bas */}
        <div
          style={{
            display: 'flex',
            fontFamily: 'IBM Plex Mono',
            fontSize: 16,
            color: '#B79AD1',
            letterSpacing: 1,
          }}
        >
          {domain}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Fraunces', data: frauncesBold, weight: 600, style: 'normal' },
        { name: 'Fraunces', data: frauncesItalic, weight: 400, style: 'italic' },
        { name: 'Inter', data: interSemibold, weight: 600, style: 'normal' },
        { name: 'IBM Plex Mono', data: plexMono, weight: 500, style: 'normal' },
      ],
    }
  )
}
