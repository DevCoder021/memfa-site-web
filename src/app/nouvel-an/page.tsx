import type { Metadata } from "next";
import { Cormorant_Garamond, Italiana, Jost, Manrope } from "next/font/google";
import NewYear from "@/components/nouvel-an/NewYear";
import "./nouvel-an.css";

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
});

const jost = Jost({
  weight: ["200", "300"],
  subsets: ["latin"],
  variable: "--font-jost",
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
});

const manrope = Manrope({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Nouvelle année",
};

export default function Page() {
  return (
    <main
      className={`${italiana.variable} ${jost.variable} ${cormorant.variable} ${manrope.variable}`}
    >
      <NewYear />
    </main>
  );
}
