"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useServerTime } from "@/hooks/useServerTime";
import {
  disposeAudio,
  initAudio,
  playImpact,
  setMuted,
  startHeartbeat,
  stopHeartbeat,
} from "@/lib/nouvel-an/audio";
import Reveal from "./Reveal";
import RevealFeux from "./RevealFeux";

// 1er janvier 2027, 00:00:00 UTC
const TARGET = Date.UTC(2027, 0, 1, 0, 0, 0);
const YEAR = "2027";
const PHRASE = "Que la nouvelle année éclaire chacun de vos pas."; // à personnaliser
const ANIMATION: "lumiere" | "feux" = "feux";
const FINAL_MS = 10_000; // durée de la phase finale
const BLACKOUT_MS = 500; // écran noir à zéro
const LATE_AFTER_MS = 15_000; // au-delà, on affiche directement l'état final

type Phase = "loading" | "waiting" | "final" | "blackout" | "reveal" | "done";

const pad = (n: number) => String(n).padStart(2, "0");

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function NewYear() {
  const { ready, now } = useServerTime();
  const [animation, setAnimation] = useState<"lumiere" | "feux">(ANIMATION);
  const [phase, setPhase] = useState<Phase>("loading");
  const phaseRef = useRef<Phase>("loading");
  const [time, setTime] = useState(split(0));
  const [count, setCount] = useState(10);
  const [runId, setRunId] = useState(0);
  const [skip, setSkip] = useState(false);
  const [muted, setMutedState] = useState(false);
  const [lite, setLite] = useState(false);
  const liteRef = useRef(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const shakeRef = useRef<HTMLDivElement>(null);
  const digitRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const go = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const requested = new URLSearchParams(window.location.search).get("anim");
      if (requested === "feux") setAnimation("feux");
    });
    return () => window.clearTimeout(timer);
  }, []);

  // Version allégée : mouvement réduit ou appareil modeste
  useEffect(() => {
    const nav = navigator as Navigator & { deviceMemory?: number };
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const weak = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 2;
    liteRef.current = reduced || weak;
    setLite(liteRef.current);
    initAudio();
    return () => {
      window.clearTimeout(timeoutRef.current);
      disposeAudio();
    };
  }, []);

  // Dès que l'heure serveur est connue : état final direct si minuit est passé
  useEffect(() => {
    if (!ready || phaseRef.current !== "loading") return;
    const arrivedLate = TARGET - now() <= -LATE_AFTER_MS;
    timeoutRef.current = window.setTimeout(() => {
      if (arrivedLate) setSkip(true);
      setTime(split(TARGET - now()));
      go(arrivedLate ? "done" : "waiting");
    });
  }, [ready, now, go]);

  // Zéro : impact, noir 0,5 s, puis révélation
  const triggerZero = useCallback(() => {
    stopHeartbeat();
    playImpact();
    rootRef.current?.style.setProperty("--t", "0");
    go("blackout");
    timeoutRef.current = window.setTimeout(() => {
      setRunId((r) => r + 1);
      go("reveal");
    }, BLACKOUT_MS);
  }, [go]);

  const replay = () => {
    initAudio();
    setSkip(false);
    triggerZero();
  };

  const toggleSound = () => {
    initAudio();
    const next = !muted;
    setMutedState(next);
    setMuted(next);
  };

  // Boucle principale : temps restant, phases, tension, tremblement
  const running = phase === "waiting" || phase === "final";
  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let lastSec = -1;

    const loop = () => {
      const remaining = TARGET - now();

      if (remaining <= -LATE_AFTER_MS) {
        stopHeartbeat();
        setSkip(true);
        go("done");
        return;
      }
      if (remaining <= 0) {
        triggerZero();
        return;
      }
      if (phaseRef.current === "waiting" && remaining <= FINAL_MS) {
        go("final");
        startHeartbeat(() => TARGET - now());
      }

      const sec = Math.ceil(remaining / 1000);
      if (sec !== lastSec) {
        lastSec = sec;
        if (remaining <= FINAL_MS) setCount(sec);
        else setTime(split(remaining));
      }

      const tension = remaining <= FINAL_MS ? 1 - remaining / FINAL_MS : 0;
      rootRef.current?.style.setProperty("--t", tension.toFixed(3));
      if (shakeRef.current && !liteRef.current && tension > 0) {
        const a = tension * 3; // 3 px max : très léger
        shakeRef.current.style.transform = `translate(${(Math.random() - 0.5) * a}px, ${(Math.random() - 0.5) * a}px)`;
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, now, go, triggerZero]);

  // Pulsation du chiffre à chaque seconde
  useEffect(() => {
    if (phase !== "final" || !digitRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        digitRef.current,
        { scale: 1.07, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out" }
      );
    }, digitRef);
    return () => context.revert();
  }, [count, phase]);

  const units: [number, string, string][] = [
    [time.d, "jour", "jours"],
    [time.h, "heure", "heures"],
    [time.m, "minute", "minutes"],
    [time.s, "seconde", "secondes"],
  ];

  const announce =
    phase === "waiting"
      ? `${time.d} jours, ${time.h} heures et ${time.m} minutes avant la nouvelle année.`
      : phase === "final"
        ? "Les dix dernières secondes."
        : phase === "reveal" || phase === "done"
          ? `Bonne année ${YEAR}. ${PHRASE}`
          : "";

  const focusRing =
    "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c9a961]";

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 h-dvh overflow-hidden bg-[#000] font-[family-name:var(--font-jost)] font-extralight text-[#e9dcc0]"
    >
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>

      {(phase === "waiting" || phase === "final") && (
        <>
          <div className="na-halo" />
          <div className="na-vignette" />
        </>
      )}

      {phase === "waiting" && (
        <div
          aria-hidden
          className="relative flex h-full items-center justify-center gap-[clamp(1.25rem,5vw,3.5rem)] px-4"
        >
          {units.map(([value, one, many]) => (
            <div key={many} className="min-w-[2ch] text-center">
              <div className="text-[clamp(2.2rem,9vw,4.5rem)] font-extralight leading-none tabular-nums">
                {pad(value)}
              </div>
              <div className="mt-3 text-[clamp(0.7rem,2.4vw,0.85rem)] font-light tracking-[0.12em] text-[#8c8470]">
                {value > 1 ? many : one}
              </div>
            </div>
          ))}
        </div>
      )}

      {phase === "final" && (
        <div ref={shakeRef} aria-hidden className="relative flex h-full items-center justify-center">
          <div
            ref={digitRef}
            className="font-[family-name:var(--font-italiana)] text-[clamp(10rem,50vw,30rem)] leading-none text-[#f1e4c2]"
            style={{
              textShadow:
                "0 0 calc(20px + var(--t) * 70px) rgba(233, 205, 140, calc(0.15 + var(--t) * 0.4))",
            }}
          >
            {count}
          </div>
        </div>
      )}

      {(phase === "reveal" || phase === "done") && (
        animation === "feux" ? (
          <RevealFeux
            key={runId}
            year={YEAR}
            phrase={PHRASE}
            lite={lite}
            skip={skip}
            onDone={() => go("done")}
          />
        ) : (
          <Reveal
            key={runId}
            year={YEAR}
            phrase={PHRASE}
            lite={lite}
            skip={skip}
            onDone={() => go("done")}
          />
        )
      )}

      {phase === "done" && (
        <button
          onClick={replay}
          className={`na-fade absolute bottom-[max(2rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-sm font-light tracking-[0.08em] text-[#8c8470] underline decoration-[#8c8470]/40 underline-offset-8 transition-colors hover:text-[#e9dcc0] ${focusRing}`}
        >
          Revoir l&apos;animation
        </button>
      )}

      {phase !== "loading" && (
        <button
          onClick={toggleSound}
          aria-pressed={muted}
          className={`absolute right-[max(1.25rem,env(safe-area-inset-right))] top-[max(1.25rem,env(safe-area-inset-top))] text-sm font-light text-[#8c8470] transition-colors hover:text-[#e9dcc0] ${focusRing}`}
        >
          {muted ? "Activer le son" : "Couper le son"}
        </button>
      )}
    </div>
  );
}
