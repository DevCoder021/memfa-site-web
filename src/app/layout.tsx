// src/app/layout.tsx
import "./globals.css";
import { Metadata } from "next";
import Providers from "./providers";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  metadataBase: new URL('https://memfa.vercel.app'),
  title: {
    default: "MEMFA - Mission Évangélique Maranatha",
    template: "%s | MEMFA",
  },
  description: "Mission Évangélique Maranatha Foi et Action. Retrouvez nos actualités, nos prédications, nos médias et participez à nos œuvres.",
  keywords: ['MEMFA', 'Église', 'Évangélique', 'Maranatha', 'Foi', 'Action', 'Côte d\'Ivoire'],
  icons: {
    icon: [
      {
        url: "/assets/logo-icon-256.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        url: "/assets/favicon-32x32.png",
        type: "image/png",
        sizes: "32x32",
      },
    ],
    apple: "/assets/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://memfa.vercel.app',
    title: "MEMFA - Mission Évangélique Maranatha",
    description: "Mission Évangélique Maranatha Foi et Action",
    siteName: 'MEMFA',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'MEMFA - Mission Évangélique Maranatha',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "MEMFA - Mission Évangélique Maranatha",
    description: "Mission Évangélique Maranatha Foi et Action",
    images: ['/opengraph-image.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden w-full" suppressHydrationWarning>
        <Providers>
          {children}
          <CookieBanner />
          {/* Remplace G-[#IDENTIFIANT] par ton ID Google Analytics réel */}
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-[#IDENTIFIANT]"} />
        </Providers>
      </body>
    </html>
  );
}