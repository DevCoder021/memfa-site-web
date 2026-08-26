import "./globals.css";
import { Metadata } from "next";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "MEMFA - Mission Évangélique Maranatha",
  description: "Mission Évangélique Maranatha Foi et Action",
  icons: { icon: "/assets/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden w-full" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}