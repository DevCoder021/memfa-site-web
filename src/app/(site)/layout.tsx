import Cursor from "@/components/Cursor";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/layout/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScroll>
      <PageTransition>
        <div className="relative w-full overflow-x-hidden">
          <Navbar />
          <Cursor />
          <main>{children}</main>
          <Footer />
        </div>
      </PageTransition>
    </SmoothScroll>
  );
}