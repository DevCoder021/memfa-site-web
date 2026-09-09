"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

export default function GoogleAnalytics({ gaId }: { gaId: string }) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Vérification initiale du consentement
    const consent = localStorage.getItem("cookie_consent");
    if (consent === "accepted") {
      setHasConsent(true);
    }

    // Écoute des mises à jour faites depuis la CookieBanner
    const handleConsentUpdate = () => {
      const updatedConsent = localStorage.getItem("cookie_consent");
      setHasConsent(updatedConsent === "accepted");
    };

    window.addEventListener("cookie_consent_updated", handleConsentUpdate);
    return () => window.removeEventListener("cookie_consent_updated", handleConsentUpdate);
  }, []);

  if (!hasConsent) return null;

  return <NextGoogleAnalytics gaId={gaId} />;
}