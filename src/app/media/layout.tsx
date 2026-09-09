import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Médias & Prédications",
  description:
    "Écoutez nos sermons, regardez nos cultes en direct et découvrez nos contenus multimédias.",
};

export default function MediaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
