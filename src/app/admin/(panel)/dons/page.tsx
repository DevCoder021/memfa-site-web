import { HandHeart, Info, Sparkles } from "lucide-react";

export default function DonsAdminPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-memfa-violet/60 mb-2">
          Administration
        </p>
        <h1 className="text-2xl font-bold text-memfa-charcoal">Gestion des dons</h1>
        <p className="text-slate-400 text-sm mt-2">
          Suivez et gérez les contributions destinées aux œuvres de MEMFA.
        </p>
      </div>

      <section className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="p-8 md:p-12 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-memfa-violet/10 text-memfa-violet flex items-center justify-center mb-6">
            <HandHeart className="w-9 h-9" strokeWidth={1.8} />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 px-3 py-1.5 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Fonctionnalité en préparation
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-memfa-charcoal mb-3">
            La gestion des dons arrive bientôt
          </h2>
          <p className="max-w-xl mx-auto text-sm leading-6 text-slate-500">
            Cet espace permettra prochainement de consulter les dons reçus, de suivre les
            campagnes et de gérer les confirmations de contribution.
          </p>
        </div>

        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-5 md:px-12">
          <div className="flex items-start gap-3 max-w-xl mx-auto text-left">
            <Info className="w-5 h-5 shrink-0 text-memfa-violet mt-0.5" />
            <p className="text-xs leading-5 text-slate-500">
              Les dons peuvent continuer à être effectués via la page publique dédiée. Les
              données de suivi seront disponibles ici lorsque le module sera activé.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}