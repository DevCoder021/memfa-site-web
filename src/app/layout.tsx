import "./globals.css";
import { Metadata } from "next";
import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "MEMFA - Mission Évangélique Maranatha",
  description: "Mission Évangélique Maranatha Foi et Action",
  icons: {
    icon: "/assets/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased overflow-x-hidden w-full" suppressHydrationWarning>
        <SmoothScroll>
          <PageTransition>
            <div className="relative w-full overflow-x-hidden">
              <Navbar />
              <Cursor />
              {children}
            </div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}