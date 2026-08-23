"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        {/* Header avec retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a0f2b] hover:text-[#d97706] transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-semibold">Retour à l'accueil</span>
        </Link>

        <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#1a0f2b] mb-8">
          Politique de Confidentialité
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">1. Introduction</h2>
            <p>
              La Mission Évangélique Maranatha - Foi et Action (MEMFA) accorde une grande importance à la protection de vos données personnelles. Cette politique explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">2. Données collectées</h2>
            <p>
              Nous collectons les données personnelles que vous nous fournissez volontairement, notamment :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Votre nom et prénom</li>
              <li>Votre adresse email</li>
              <li>Votre numéro de téléphone</li>
              <li>Vos messages et commentaires</li>
              <li>Toute autre information que vous choisissez de partager</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">3. Utilisation de vos données</h2>
            <p>
              Vos données sont utilisées pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Répondre à vos demandes de contact</li>
              <li>Vous envoyer nos newsletters et informations actualisées</li>
              <li>Améliorer nos services et expérience utilisateur</li>
              <li>Assurer la sécurité de notre site</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">4. Protection de vos données</h2>
            <p>
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos données contre tout accès non autorisé, modification ou divulgation.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">5. Partage de vos données</h2>
            <p>
              Nous ne partageons vos données personnelles avec des tiers que lorsque cela est nécessaire ou légalement requis. Nous ne vendons jamais vos informations.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">6. Vos droits</h2>
            <p>
              Vous avez le droit de :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accéder à vos données personnelles</li>
              <li>Demander la correction de vos données</li>
              <li>Demander la suppression de vos données</li>
              <li>Vous opposer à certains traitements</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">7. Cookies</h2>
            <p>
              Pour plus d'informations sur les cookies, veuillez consulter notre <Link href="/politique-cookies" className="text-[#d97706] hover:underline">Politique de Cookies</Link>.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">8. Contact</h2>
            <p>
              Pour toute question concernant vos données personnelles, veuillez nous contacter via la page de contact du site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
