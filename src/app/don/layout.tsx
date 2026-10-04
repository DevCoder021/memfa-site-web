import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dons en ligne bientôt disponibles | MEMFA",
  description:
    "Les dons en ligne de la Mission Évangélique Maranatha Foi et Action ne sont pas encore disponibles.",
};

export default function DonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
