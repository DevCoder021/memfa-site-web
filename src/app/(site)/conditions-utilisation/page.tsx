import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation",
  description:
    "Conditions générales d’utilisation du site de la Mission Évangélique Maranatha Foi et Action (MEMFA).",
};

const sections = [
  { id: "objet", label: "Objet et acceptation" },
  { id: "acces", label: "Accès au site" },
  { id: "utilisation", label: "Utilisation du site" },
  { id: "contenus", label: "Contenus et propriété intellectuelle" },
  { id: "services-tiers", label: "Services tiers" },
  { id: "donnees", label: "Données personnelles et cookies" },
  { id: "responsabilite", label: "Responsabilité" },
  { id: "droit", label: "Modification et droit applicable" },
];

export default function ConditionsUtilisationPage() {
  return (
    <div className="min-h-screen bg-white pt-24 pb-24">
      <div className="mx-auto max-w-4xl px-6 sm:px-12">
        <Link
          href="/"
          className="mb-10 inline-flex items-center gap-2 text-[#1a0f2b] transition-colors hover:text-[#d97706]"
        >
          <ArrowLeft size={20} aria-hidden="true" />
          <span className="font-semibold">Retour à l’accueil</span>
        </Link>

        <header className="mb-12 border-b border-[var(--color-memfa-violet-line)] pb-10">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-memfa-violet-soft)] text-[var(--color-memfa-violet)]">
            <FileText size={23} aria-hidden="true" />
          </div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-memfa-or)]">
            MEMFA · Informations juridiques
          </p>
          <h1 className="font-serif text-4xl font-bold text-[#1a0f2b] sm:text-5xl">
            Conditions générales d’utilisation
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-600">
            Ces conditions encadrent l’accès au site de la Mission Évangélique
            Maranatha Foi et Action (MEMFA) et son utilisation.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Dernière mise à jour : 4 octobre 2026
          </p>
        </header>

        <nav
          aria-label="Sommaire des conditions d’utilisation"
          className="mb-12 border-l-2 border-[var(--color-memfa-or)] pl-5"
        >
          <p className="mb-3 text-sm font-semibold text-[#1a0f2b]">Sommaire</p>
          <ul className="grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-gray-600 underline decoration-transparent underline-offset-4 transition-colors hover:text-[var(--color-memfa-violet)] hover:decoration-current"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10 text-[15px] leading-7 text-gray-600">
          <section id="objet" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              1. Objet et acceptation
            </h2>
            <p>
              Le site présente les activités, les actualités et les ressources
              de la Mission Évangélique Maranatha Foi et Action. En naviguant
              sur le site, vous acceptez les présentes conditions. Si vous ne
              les acceptez pas, veuillez cesser de l’utiliser.
            </p>
          </section>

          <section id="acces" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              2. Accès au site
            </h2>
            <p>
              Le site est accessible gratuitement, hors frais de connexion à
              Internet qui restent à votre charge. La MEMFA s’efforce de
              maintenir le service accessible, sans garantir une disponibilité
              permanente. Des interruptions peuvent survenir pour maintenance,
              mise à jour ou en raison d’un événement indépendant de sa volonté.
            </p>
            <p className="mt-3">
              Les dons en ligne ne sont pas disponibles actuellement. Aucun
              paiement ne peut être effectué depuis cette fonctionnalité tant
              que son ouverture n’a pas été annoncée par la MEMFA.
            </p>
          </section>

          <section id="utilisation" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              3. Utilisation du site
            </h2>
            <p>
              Vous vous engagez à utiliser le site conformément aux lois
              applicables et à respecter les droits des autres personnes. Il est
              notamment interdit de perturber le fonctionnement du site, de
              tenter d’accéder sans autorisation à ses systèmes ou de transmettre
              des contenus illicites, frauduleux ou malveillants.
            </p>
            <p className="mt-3">
              Si vous utilisez un formulaire, vous êtes responsable de
              l’exactitude des informations transmises et devez éviter de
              communiquer des données personnelles concernant un tiers sans
              autorisation.
            </p>
          </section>

          <section id="contenus" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              4. Contenus et propriété intellectuelle
            </h2>
            <p>
              Les textes, images, logos, enregistrements et autres contenus du
              site sont protégés par les règles applicables en matière de
              propriété intellectuelle. Ils appartiennent à la MEMFA ou à leurs
              ayants droit. Toute reproduction ou réutilisation à des fins
              autres que privées nécessite l’autorisation préalable du titulaire
              des droits, sauf exception prévue par la loi.
            </p>
          </section>

          <section id="services-tiers" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              5. Services et liens tiers
            </h2>
            <p>
              Certaines pages peuvent intégrer des contenus ou des liens vers
              des services tiers. Ces services sont exploités par leurs propres
              éditeurs et peuvent être soumis à leurs conditions et politiques
              de confidentialité. La MEMFA ne contrôle pas leur disponibilité
              ni leurs pratiques.
            </p>
          </section>

          <section id="donnees" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              6. Données personnelles et cookies
            </h2>
            <p>
              Le traitement des données personnelles et l’utilisation des
              cookies sont décrits dans les documents dédiés :{" "}
              <Link
                href="/politique-confidentialite"
                className="font-medium text-[var(--color-memfa-violet)] underline underline-offset-4"
              >
                politique de confidentialité
              </Link>{" "}
              et{" "}
              <Link
                href="/politique-cookies"
                className="font-medium text-[var(--color-memfa-violet)] underline underline-offset-4"
              >
                politique de cookies
              </Link>
              .
            </p>
          </section>

          <section id="responsabilite" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              7. Responsabilité
            </h2>
            <p>
              Les informations sont publiées à titre informatif. La MEMFA
              s’efforce de les maintenir exactes et à jour, mais ne garantit pas
              qu’elles soient exemptes d’erreurs ou disponibles en permanence.
              Dans les limites prévues par la loi, elle ne peut être tenue
              responsable des conséquences d’une interruption du site ou d’un
              usage non conforme aux présentes conditions.
            </p>
          </section>

          <section id="droit" className="scroll-mt-24">
            <h2 className="mb-3 font-serif text-2xl font-bold text-[#1a0f2b]">
              8. Modification et droit applicable
            </h2>
            <p>
              Ces conditions peuvent être mises à jour pour refléter l’évolution
              du site ou de la réglementation. La version publiée sur cette page
              est celle qui s’applique. Elles sont soumises au droit ivoirien,
              sous réserve des dispositions impératives applicables. Pour toute
              question, vous pouvez écrire à{" "}
              <a
                href="mailto:contact@memfa.org"
                className="font-medium text-[var(--color-memfa-violet)] underline underline-offset-4"
              >
                contact@memfa.org
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-14 border-t border-[var(--color-memfa-violet-line)] pt-6 text-sm text-gray-500">
          <Link
            href="/mentions-legales"
            className="font-medium text-[var(--color-memfa-violet)] hover:underline"
          >
            Consulter également les mentions légales
          </Link>
        </div>
      </div>
    </div>
  );
}