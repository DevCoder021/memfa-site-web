"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueCookies() {
  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-12">
        {/* Header avec retour */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#1a0f2b] hover:text-[#d97706] transition-colors mb-12">
          <ArrowLeft size={20} />
          <span className="font-semibold">Retour à l'accueil</span>
        </Link>

        <h1 className="font-serif text-5xl md:text-6xl font-bold text-[#1a0f2b] mb-8">
          Politique de Cookies
        </h1>

        <div className="prose prose-lg max-w-none text-gray-600 space-y-8">
          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez notre site. Il permet de mémoriser vos préférences et de vous offrir une meilleure expérience utilisateur.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">2. Types de cookies que nous utilisons</h2>
            <p>
              Nous utilisons les types de cookies suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies de session :</strong> Temporaires et supprimés à la fermeture de votre navigateur</li>
              <li><strong>Cookies persistants :</strong> Restent sur votre appareil pendant une période définie</li>
              <li><strong>Cookies d'analyse :</strong> Nous aident à comprendre comment vous utilisez notre site</li>
              <li><strong>Cookies de fonctionnalité :</strong> Améliorent l'expérience utilisateur et les performances</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">3. Finalités des cookies</h2>
            <p>
              Nous utilisons les cookies pour :
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Améliorer la fonctionnalité du site</li>
              <li>Analyser le trafic et l'engagement des utilisateurs</li>
              <li>Personnaliser votre expérience</li>
              <li>Mémoriser vos préférences</li>
              <li>Assurer la sécurité de votre session</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">4. Cookies tiers</h2>
            <p>
              Nous pouvons autoriser des services tiers (comme Google Analytics) à placer des cookies sur notre site pour analyser le trafic et améliorer nos services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">5. Gestion de vos cookies</h2>
            <p>
              Vous pouvez contrôler et supprimer les cookies via les paramètres de votre navigateur. Vous pouvez également refuser les cookies non essentiels, bien que cela puisse affecter l'expérience utilisateur.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">6. Consentement</h2>
            <p>
              En continuant à utiliser notre site, vous consentez à l'utilisation des cookies conformément à cette politique. Vous pouvez modifier vos préférences de consentement à tout moment.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">7. Mise à jour de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de cookies à tout moment. Les modifications prendront effet dès leur publication sur ce site.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-[#1a0f2b] mt-12 mb-4">8. Contact</h2>
            <p>
              Pour toute question concernant cette politique de cookies, veuillez nous contacter via la page de contact du site.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
