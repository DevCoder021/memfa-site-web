"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horloge synchronisée sur le serveur.
 * - now() renvoie l'heure serveur estimée (ms epoch), calculée avec performance.now()
 *   (insensible aux changements d'horloge de l'appareil).
 * - ?date=2026-12-31T23:59:50Z simule l'heure courante pour tester l'animation.
 */
export function useServerTime() {
  const [ready, setReady] = useState(false);
  const base = useRef({ epoch: 0, perf: 0 });

  const now = useCallback(
    () => base.current.epoch + (performance.now() - base.current.perf),
    []
  );

  useEffect(() => {
    let cancelled = false;
    const param = new URLSearchParams(window.location.search).get("date");
    const simulated = param ? Date.parse(param) : NaN;
    const isSimulated = !Number.isNaN(simulated);

    async function sync() {
      let epoch = Date.now(); // repli si le serveur ne répond pas
      if (isSimulated) {
        epoch = simulated;
      } else {
        try {
          const t0 = performance.now();
          const res = await fetch("/api/time", { cache: "no-store" });
          const data: { now: number } = await res.json();
          epoch = data.now + (performance.now() - t0) / 2; // compense la latence
        } catch {
          /* on garde l'horloge locale */
        }
      }
      if (cancelled) return;
      base.current = { epoch, perf: performance.now() };
      setReady(true);
    }

    sync();
    // Resynchronisation discrète pour absorber toute dérive (pas en mode test)
    const id = isSimulated ? undefined : window.setInterval(sync, 60_000);

    return () => {
      cancelled = true;
      if (id) window.clearInterval(id);
    };
  }, []);

  return { ready, now };
}
