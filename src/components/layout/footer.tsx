import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-12">
        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          
          {/* COLONNE 1 : BRAND & VISION */}
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-black tracking-tighter text-[#1a0f2b] mb-6">
              MEMFA
            </div>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              Mission Évangélique Maranatha <br />
              <span className="text-[#d97706] italic">Foi et Action</span>. <br />
              Répandre l&apos;Évangile et transformer des vies.
            </p>
          </div>

          {/* COLONNE 2 : NAVIGATION */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Navigation</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li><a href="#" className="hover:text-black transition-colors">Accueil</a></li>
              <li><a href="#" className="hover:text-black transition-colors">À Propos</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Vision</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Activités</a></li>
              <li><a href="#" className="hover:text-black transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* COLONNE 3 : CULTES (Inspiré de ton design précédent) */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Horaires des Cultes</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-400">
              <li className="flex flex-col">
                <span className="text-black">Dimanche</span>
                <span>8h30 — 11h30</span>
              </li>
              <li className="flex flex-col">
                <span className="text-black">Mercredi</span>
                <span>18h30 — 20h00</span>
              </li>
            </ul>
          </div>

          {/* COLONNE 4 : NEWSLETTER / CONTACT */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-900 mb-8">Restez Connecté</h4>
            <p className="text-sm text-gray-400 mb-6 font-medium">Inscrivez-vous pour recevoir les dernières nouvelles.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="w-full bg-gray-50 border-none rounded-full px-6 py-3 text-sm focus:ring-2 focus:ring-[#1a0f2b] transition-all outline-none"
              />
              <button className="absolute right-2 top-1.5 bg-[#1a0f2b] text-white p-1.5 rounded-full hover:bg-black transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
              </button>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-100 mb-10" />

        {/* BOTTOM FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest">
            © {new Date().getFullYear()} MEMFA — TOUS DROITS RÉSERVÉS
          </p>
          <div className="flex gap-6 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            <a href="/mentions-legales" className="hover:text-black transition-colors">Mentions Légales</a>
            <span className="text-gray-200">|</span>
            <a href="/politique-confidentialite" className="hover:text-black transition-colors">Politique de Confidentialité</a>
            <span className="text-gray-200">|</span>
            <a href="/politique-cookies" className="hover:text-black transition-colors">Politique de Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}