import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-[var(--background)] pt-24 pb-12 border-t border-[var(--color-memfa-violet-line)]">
      <div className="max-w-7xl mx-auto px-12">
        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* COLONNE 1 : BRAND & VISION */}
          <div className="col-span-1 md:col-span-1">
            <div className="font-serif text-2xl font-semibold tracking-tight text-[var(--color-memfa-violet-deep)] mb-6">
              MEMFA
            </div>
            <p className="text-[var(--memfa-ink-60)] text-sm leading-relaxed">
              Mission Évangélique Maranatha <br />
              <span className="text-[var(--color-memfa-or)] italic">Foi et Action</span>. <br />
              Répandre l&apos;Évangile et transformer des vies.
            </p>
          </div>

          {/* COLONNE 2 : NAVIGATION */}
          <div>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-memfa-violet)] mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-[var(--memfa-ink-60)]">
              <li><a href="#" className="hover:text-[var(--color-memfa-violet)] transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-[var(--color-memfa-violet)] transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-[var(--color-memfa-violet)] transition-colors">Vision</a></li>
              <li><a href="#" className="hover:text-[var(--color-memfa-violet)] transition-colors">Activités</a></li>
              <li><a href="#" className="hover:text-[var(--color-memfa-violet)] transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* COLONNE 3 : CULTES (Inspiré de ton design précédent) */}
          <div>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-memfa-violet)] mb-8">Horaires des Cultes</h4>
            <ul className="space-y-4 text-sm font-medium text-[var(--memfa-ink-60)]">
              <li className="flex flex-col">
                <span className="text-[var(--color-memfa-violet-deep)]">Dimanche</span>
                <span>8h30 — 11h30</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[var(--color-memfa-violet-deep)]">Mercredi</span>
                <span>18h30 — 20h00</span>
              </li>
            </ul>
          </div>

          {/* COLONNE 4 : NEWSLETTER / CONTACT */}
          <div>
            <h4 className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-memfa-violet)] mb-8">Restez Connecté</h4>
            <p className="text-sm text-[var(--memfa-ink-60)] mb-6">Inscrivez-vous pour recevoir les dernières nouvelles.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-[var(--color-memfa-violet-soft)] border border-[var(--color-memfa-violet-line)] rounded-lg px-6 py-3 text-sm focus:ring-2 focus:ring-[var(--color-memfa-violet)]/20 transition-all outline-none"
              />
              <button className="absolute right-2 top-1.5 bg-[var(--color-memfa-violet)] text-white p-1.5 rounded-lg hover:bg-[var(--color-memfa-violet-deep)] transition-colors" aria-label="S'inscrire à la newsletter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-[var(--color-memfa-violet-line)] mb-10" />

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="font-mono text-[11px] font-medium text-[var(--memfa-ink-60)] uppercase tracking-[0.1em]">
            © {new Date().getFullYear()} MEMFA — TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex gap-6 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--memfa-ink-60)]">
            <a href="/mentions-legales" className="hover:text-[var(--color-memfa-violet)] transition-colors">Mentions Légales</a>
            <span className="text-[var(--color-memfa-violet-line)]">|</span>
            <a href="/politique-confidentialite" className="hover:text-[var(--color-memfa-violet)] transition-colors">Politique de Confidentialité</a>
            <span className="text-[var(--color-memfa-violet-line)]">|</span>
            <a href="/politique-cookies" className="hover:text-[var(--color-memfa-violet)] transition-colors">Politique de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}