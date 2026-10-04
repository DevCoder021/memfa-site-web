import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Construction, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Dons en ligne bientôt disponibles",
  description:
    "La page des dons en ligne de la Mission Évangélique Maranatha Foi et Action est en cours de construction.",
};

export default function DonPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[#180b2b] text-[#f8f5ef]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#6b3fa0]/30 blur-[110px]" />
        <div className="absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#c9971f]/15 blur-[120px]" />
      </div>

      <header className="relative z-10 flex items-center justify-between px-5 py-6 sm:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3" aria-label="Retour à l’accueil de la MEMFA">
          <Image src="/assets/logo-icon-256.png" alt="" width={40} height={40} />
          <span className="font-display text-lg font-semibold sm:text-xl">MEMFA</span>
        </Link>
        <span className="hidden text-xs font-semibold uppercase tracking-[0.14em] text-[#f0cf7a] sm:inline">
          Foi et Action
        </span>
      </header>

      <section className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 pb-20 pt-10 text-center sm:px-8 sm:pt-4">
        <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#f0cf7a]/25 bg-[#f0cf7a]/10 text-[#f0cf7a]">
          <Construction size={30} strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#f0cf7a]">
          Espace de générosité
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-medium leading-tight sm:text-5xl">
          Cette page est en cours de construction.
        </h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-[#f8f5ef]/70 sm:text-base">
          Nous préparons un espace de don simple et sécurisé pour soutenir les
          actions de la Mission Évangélique Maranatha Foi et Action.
        </p>
        <p className="mt-3 max-w-lg text-sm leading-6 text-[#f8f5ef]/55">
          En attendant son ouverture, aucun paiement n’est demandé ni collecté
          depuis cette page.
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#e3b23c] px-6 py-3 text-sm font-bold text-[#180b2b] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf7a]"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Retour à l’accueil
          </Link>
          <a
            href="mailto:contact@memfa.org"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#f8f5ef]/25 px-6 py-3 text-sm font-medium text-[#f8f5ef] transition-colors hover:border-[#f0cf7a] hover:bg-[#f8f5ef]/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0cf7a]"
          >
            <Mail size={16} aria-hidden="true" />
            Nous contacter
          </a>
        </div>
      </section>

      <footer className="relative z-10 border-t border-[#f8f5ef]/10 px-5 py-5 text-center text-[11px] text-[#f8f5ef]/45 sm:px-10">
        © 2026 MEMFA — Mission Évangélique Maranatha Foi et Action
      </footer>
    </main>
  );
}