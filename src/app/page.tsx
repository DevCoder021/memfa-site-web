import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="text-2xl font-bold text-memfa-violet">MEMFA</div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#" className="hover:text-memfa-violet transition">Accueil</a>
          <a href="#" className="hover:text-memfa-violet transition">À Propos</a>
          <a href="#" className="hover:text-memfa-violet transition">Activités</a>
          <a href="#" className="hover:text-memfa-violet transition">Média</a>
        </div>
        <Button className="bg-memfa-violet hover:bg-violet-900 text-white rounded-full px-6">
          Don en ligne
        </Button>
      </nav>

      {/* HERO SECTION PRO */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Overlay Dégradé */}
        <div className="absolute inset-0 bg-gradient-to-br from-memfa-violet via-violet-950 to-black z-10 opacity-90" />
        
        <div className="relative z-20 max-w-5xl text-center px-6">
          <span className="inline-block py-1 px-4 rounded-full bg-memfa-or/20 text-memfa-or text-sm font-bold tracking-widest uppercase mb-6 border border-memfa-or/30">
            Mission Évangélique Maranatha
          </span>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-8 tracking-tight">
            Foi et <span className="text-memfa-or">Action</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Une communauté vibrante dédiée à la transformation des vies par la puissance de la Parole de Dieu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-memfa-or hover:bg-yellow-600 text-memfa-violet font-bold h-14 px-10 rounded-full text-lg shadow-lg shadow-memfa-or/20">
              Rejoindre le Direct
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-10 rounded-full text-lg backdrop-blur-sm">
              Découvrir la Mission
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION VISION ÉLÉGANTE */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-memfa-or font-bold tracking-widest uppercase text-sm mb-3">Notre Fondement</h2>
            <p className="text-4xl font-bold text-memfa-violet">Une vision pour l'éternité</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "La Mission", desc: "Porter l'Évangile jusqu'aux extrémités de la terre avec ferveur." },
              { title: "Valeurs", desc: "L'intégrité, l'amour et l'excellence au service du Royaume." },
              { title: "Impact", desc: "Bâtir des générations fortes et spirituellement épanouies." }
            ].map((item, index) => (
              <Card key={index} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                <div className="h-2 w-full bg-memfa-or group-hover:bg-memfa-violet transition-colors" />
                <CardContent className="p-10">
                  <h3 className="text-2xl font-bold text-memfa-violet mb-4">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}