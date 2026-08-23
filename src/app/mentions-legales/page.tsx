"use client";

import Link from "next/link";
import { ArrowLeft, Scale } from "lucide-react";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        {/* Header avec retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a0f2b] hover:text-[#d97706] transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-semibold">Retour à l'accueil</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* Header avec logo */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/logo.png" 
                alt="Logo MEMFA" 
                className="w-24 h-24 object-contain"
              />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[#1a0f2b] mb-4">
              Mentions Légales
            </h1>
            <p className="text-lg md:text-xl text-[#d97706] font-semibold">
              Informations légales obligatoires
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-8 leading-relaxed">
              Conformément aux dispositions légales en vigueur en Côte d'Ivoire (Loi n°2013-450 du 19 juin 2013 relative à la protection des données à caractère personnel), les informations suivantes sont portées à la connaissance des visiteurs de ce site.
            </p>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">1. Éditeur du Site</h2>
              <div className="bg-gradient-to-br from-purple-50 to-amber-50 p-8 rounded-2xl space-y-3 border border-purple-100">
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Dénomination :</strong> Mission Évangélique Maranatha — Foi et Action (MEMFA)</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Forme juridique :</strong> Organisation à but non lucratif / Association religieuse</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Adresse du siège :</strong> [À compléter avec votre adresse]</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Téléphone :</strong> [À compléter]</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Email de contact :</strong> contact@memfa.org</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Responsable de publication :</strong> [Nom et Prénom du Responsable]</p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">2. Hébergement du Site</h2>
              <p className="mb-4">Le site web de l'Église MEMFA est hébergé par :</p>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl space-y-3 border border-green-100">
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Société hébergeur :</strong> [À compléter]</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Adresse :</strong> [À compléter]</p>
                <p className="text-gray-700"><strong className="text-[#1a0f2b]">Site web :</strong> [À compléter]</p>
              </div>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">3. Propriété Intellectuelle</h2>
              <p className="mb-4">
                L'ensemble des contenus publiés sur ce site (textes, prédications, photos, vidéos, logos, musiques) sont la propriété exclusive de l'Église MEMFA ou de leurs auteurs respectifs.
              </p>
              <p>
                Toute reproduction, représentation, modification ou exploitation non autorisée de ces contenus est interdite sans accord écrit préalable de l'Église MEMFA.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">4. Responsabilité</h2>
              <p className="mb-4">
                L'Église MEMFA s'efforce de maintenir les informations de ce site à jour et exactes. Cependant, elle ne peut garantir l'exactitude, la complétude ou l'actualité des informations diffusées.
              </p>
              <p>
                L'Église MEMFA décline toute responsabilité pour les dommages résultant de l'utilisation de ce site ou de l'impossibilité d'y accéder.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">5. Liens Hypertextes</h2>
              <p>
                Ce site peut contenir des liens vers d'autres sites internet. L'Église MEMFA n'est pas responsable du contenu de ces sites externes et ne peut être tenue responsable de leur contenu ou de leurs pratiques.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-6">6. Droit Applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit ivoirien. En cas de litige, les tribunaux compétents de la juridiction d'Abidjan seront saisis.
              </p>
            </section>

            {/* Mission Statement */}
            <div className="mt-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center border border-purple-200">
              <h3 className="font-serif text-2xl font-bold text-[#1a0f2b] mb-4">
                Notre Mission
              </h3>
              <p className="text-gray-700 leading-relaxed">
                MEMFA s'engage à créer un environnement sûr et bienveillant pour permettre aux croyants de vivre et partager leur foi selon le plan de Dieu. Nous opérons dans le respect total de la législation en vigueur et des valeurs chrétiennes.
              </p>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm italic text-gray-500 text-center">
                Date de dernière mise à jour : 15 juin 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
