import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faire un don",
  description:
    "Soutenez les œuvres et les projets de la Mission Évangélique Maranatha grâce à vos dons.",
};

export default function DonLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
