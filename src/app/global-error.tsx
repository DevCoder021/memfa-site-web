"use client";

import ErrorFallback from "@/components/ErrorFallback";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="fr">
      <head>
        <title>Erreur temporaire | MEMFA</title>
      </head>
      <body>
        <ErrorFallback retry={retry} digest={error.digest} />
      </body>
    </html>
  );
}