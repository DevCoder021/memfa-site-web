"use client";

import { usePathname } from "next/navigation";
import CookieBanner from "@/components/CookieBanner";
import GoogleAnalytics from "@/components/GoogleAnalytics";

export default function GlobalElements({ gaId }: { gaId: string }) {
  const pathname = usePathname();

  if (pathname.replace(/\/+$/, "") === "/nouvel-an") return null;

  return (
    <>
      <CookieBanner />
      <GoogleAnalytics gaId={gaId} />
    </>
  );
}
