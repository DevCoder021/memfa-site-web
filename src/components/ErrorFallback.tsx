"use client";

import Link from "next/link";
import { Home, RefreshCw, TriangleAlert } from "lucide-react";

type ErrorFallbackProps = {
  retry: () => void;
  digest?: string;
};

export default function ErrorFallback({ retry, digest }: ErrorFallbackProps) {
  return (
    <main className="relative flex min-h-[75vh] flex-col items-center justify-center overflow-hidden bg-[#180b2b] px-6 py-20 text-center text-[#f8f5ef]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-40 h-128 w-lg rounded-full bg-[#6b3fa0]/30 blur-[110px]" />
        <div className="absolute -right-40 bottom-0 h-112 w-md rounded-full bg-[#c9971f]/15 blur-[120px]" />
      </div>

      <section className="relative z-10 flex max-w-xl flex-col items-center">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#f0cf7a]/30 bg-[#f0cf7a]/10 text-[#f0cf7a]">
          <TriangleAlert size={25} strokeWidth={1.6} aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f0cf7a]">
          Incident temporaire
        </p>
        <h1 className="mt-4 font-display text-3xl font-medium text-[#f8f5ef] sm:text-5xl">
          La page n’a pas pu s’afficher
        </h1>
        <p className="mt-5 text-sm leading-7 text-[#f8f5ef]/70 sm:text-base">
          Une erreur inattendue est survenue. Vous pouvez réessayer ou revenir à
          l’accueil du site.
        </p>
        {digest && (
          <p className="mt-4 rounded-md border border-white/10 px-3 py-2 font-mono text-xs text-[#f8f5ef]/55">
            Référence : {digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#e3b23c] px-5 py-3 text-sm font-bold text-[#180b2b] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf7a]"
          >
            <RefreshCw size={16} aria-hidden="true" />
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#f8f5ef]/25 px-5 py-3 text-sm font-medium text-[#f8f5ef] transition-colors hover:border-[#f0cf7a] hover:bg-[#f8f5ef]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf7a]"
          >
            <Home size={16} aria-hidden="true" />
            Retour à l’accueil
          </Link>
        </div>
      </section>
    </main>
  );
}