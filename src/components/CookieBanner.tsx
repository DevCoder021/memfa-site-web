"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifie si l'utilisateur a déjà fait un choix
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie_consent", "accepted");
    // Informe immédiatement GoogleAnalytics du changement
    window.dispatchEvent(new Event("cookie_consent_updated"));
    setShowBanner(false);
  };

  const declineAll = () => {
    localStorage.setItem("cookie_consent", "declined");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 p-6 bg-white border border-gray-200 rounded-2xl shadow-2xl transition-all duration-300">
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">
          Respect de votre vie privée 
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. Vous pouvez accepter ou refuser leur utilisation. Pour en savoir plus, consultez notre{" "}
          <Link
            href="/politique-cookies"
            className="text-[#1a0f2b] underline hover:text-[#d97706] font-medium"
          >
            politique de cookies
          </Link>.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <Button
            onClick={acceptAll}
            className="bg-[#1a0f2b] hover:bg-[#d97706] text-white font-medium px-4 py-2 rounded-xl text-sm transition-colors"
          >
            Tout accepter
          </Button>
          <Button
            onClick={declineAll}
            variant="outline"
            className="border-gray-300 hover:bg-gray-100 text-gray-700 font-medium px-4 py-2 rounded-xl text-sm"
          >
            Refuser
          </Button>
        </div>
      </div>
    </div>
  );
}