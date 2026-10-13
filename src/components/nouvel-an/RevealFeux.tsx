"use client";

import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { playBurst } from "@/lib/nouvel-an/audio";
import { FireworksEngine } from "@/lib/nouvel-an/fireworks";
import { sampleLogoPoints } from "@/lib/nouvel-an/titlePoints";
import FireworksCanvas from "./FireworksCanvas";

gsap.registerPlugin(useGSAP);

type Props = {
  year: string;
  phrase: string;
  lite: boolean;
  skip: boolean;
  onDone: () => void;
};

export default function RevealFeux({
  year,
  phrase,
  lite,
  skip,
  onDone,
}: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const logo = useRef<HTMLImageElement>(null);
  const greeting = useRef<HTMLSpanElement>(null);
  const yearText = useRef<HTMLSpanElement>(null);
  const ground = useRef<HTMLSpanElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const formationStarted = useRef(false);
  const generation = useRef(0);
  const reducedRef = useRef(false);
  const engineRef = useRef<FireworksEngine | null>(null);

  const revealFinale = useCallback(
    async (engine: FireworksEngine, reducedMotion: boolean) => {
      if (skip || reducedMotion || !logo.current) return;
      reducedRef.current = reducedMotion;
      const currentGeneration = generation.current;
      try {
        const points = await sampleLogoPoints(logo.current, lite);
        if (currentGeneration !== generation.current || !logo.current) {
          return;
        }
        formationStarted.current = true;
        engine.formShape(points);
      } catch (error) {
        console.error("Impossible de préparer les points du logo.", error);
      }
    },
    [lite, skip]
  );

  const handleBurst = useCallback((intensity: number) => {
    playBurst(intensity);
  }, []);

  useGSAP(
    () => {
      if (
        !eyebrow.current ||
        !logo.current ||
        !greeting.current ||
        !yearText.current ||
        !line.current
      ) {
        return;
      }
      reducedRef.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (skip) {
        gsap.set(
          [
            eyebrow.current,
            greeting.current,
            yearText.current,
            ground.current,
            line.current,
            sweep.current,
          ],
          { opacity: 1, y: 0, filter: "blur(0px)", scaleX: 0, scale: 1 }
        );
        engineRef.current?.setAmbient(true);
        gsap.delayedCall(0, onDone);
        return;
      }

      gsap.set(eyebrow.current, { opacity: 0, y: 18 });
      gsap.set(greeting.current, {
        opacity: 0,
        y: 20,
        filter: "blur(7px)",
      });
      gsap.set(yearText.current, {
        opacity: 0,
        yPercent: 110,
        scaleY: 0.72,
        transformOrigin: "center bottom",
      });
      gsap.set(ground.current, { opacity: 0, scaleX: 0, transformOrigin: "center"             });
      gsap.set(line.current, { opacity: 0, y: 18, filter: "blur(8px)" });
      gsap.set(sweep.current, { scaleX: 0, transformOrigin: "left center" });

      if (reducedRef.current) {
        const gentleSequence = gsap.timeline({ onComplete: onDone });
        gentleSequence
          .to(eyebrow.current, { opacity: 1, y: 0, duration: 0.35 }, 0)
          .to(logo.current, { opacity: 1, scale: 1, y: 0, duration: 0.6 }, 0.1)
          .to(greeting.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
          }, 0.35)
          .to(yearText.current, {
            opacity: 1,
            yPercent: 0,
            scaleY: 1,
            duration: 0.7,
            ease: "power3.out",
          }, 0.5)
          .to(ground.current, { opacity: 1, scaleX: 1, duration: 0.45 }, 0.65)
          .to(line.current, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.45,
          }, 0.8)
          .call(() => engineRef.current?.setAmbient(true), [], 1.1);
        timeline.current = gentleSequence;
        return;
      }

      const sequence = gsap.timeline({ onComplete: onDone });
      sequence
        .to(eyebrow.current, {
          opacity: 1,
          y: 0,
          duration: reducedRef.current ? 0.35 : 0.65,
          ease: "power2.out",
        }, 0.25)
        .to(sweep.current, {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
        }, 3.65)
        .to(sweep.current, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.75,
          ease: "power2.inOut",
        }, 4.45)
        .to(greeting.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        }, 9.8)
        .to(yearText.current, {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          duration: 1.25,
          ease: "power4.out",
        }, 10.45)
        .to(ground.current, {
          opacity: 1,
          scaleX: 1,
          duration: 0.8,
          ease: "power3.out",
        }, 10.55)
        .to(line.current, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
        }, 11.5)
        .to(eyebrow.current, {
          opacity: 0.68,
          letterSpacing: "0.42em",
          duration: 1.2,
          ease: "power2.out",
        }, 12)
        .to(yearText.current, {
          filter: "drop-shadow(0 0 1.5rem rgba(236, 198, 111, 0.36))",
          duration: 1,
          ease: "sine.inOut",
        }, 12.4)
        .call(() => engineRef.current?.setAmbient(true), [], 14.4)
        .to({}, { duration: 0.6 });
      timeline.current = sequence;
    },
    { scope }
  );

  useEffect(() => {
    const currentGeneration = generation;
    const resize = () => {
      if (!formationStarted.current || !logo.current) return;
      const requestGeneration = ++currentGeneration.current;
      if (!logo.current) return;
      void sampleLogoPoints(logo.current, lite)
        .then((points) => {
          if (requestGeneration === currentGeneration.current) {
            const engine = engineRef.current;
            engine?.formShape(points);
          }
        })
        .catch((error: unknown) => {
          console.error("Impossible de recalculer les points du logo.", error);
        });
    };

    window.addEventListener("resize", resize);
    return () => {
      currentGeneration.current++;
      window.removeEventListener("resize", resize);
    };
  }, [lite]);

  const handleFinale = useCallback(
    (engine: FireworksEngine, reducedMotion: boolean) => {
      engineRef.current = engine;
      void revealFinale(engine, reducedMotion);
    },
    [revealFinale]
  );

  useEffect(
    () => () => {
      generation.current++;
      timeline.current = null;
      engineRef.current = null;
    },
    []
  );

  return (
    <div ref={scope} className="na-feux-stage absolute inset-0 overflow-hidden bg-[#000]">
      <div className="na-feux-aura" aria-hidden="true" />
      <div className="na-feux-grid" aria-hidden="true" />
      <div ref={sweep} className="na-feux-sweep" aria-hidden="true" />
      <FireworksCanvas
        lite={lite}
        skip={skip}
        onFinaleBurst={handleFinale}
        onBurst={handleBurst}
      />
      <div className="na-feux-content pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center font-[family-name:var(--font-manrope)]">
        <p ref={eyebrow} className="na-feux-eyebrow">
          <span className="na-feux-eyebrow-line" />
          <span>Mission Évangélique Maranatha Foi et Action</span>
          <span className="na-feux-eyebrow-line" />
        </p>
        <Image
          ref={logo}
          src="/assets/logo.png"
          alt=""
          width={4334}
          height={2600}
          sizes="(max-width: 600px) 62vw, min(38vw, 28rem)"
          className="na-feux-logo na-feux-logo-source"
          aria-hidden="true"
          priority
        />
        <h1 className="na-feux-heading">
          <span ref={greeting} className="na-feux-salutation">
            Bonne et heureuse année
          </span>
          <span className="na-feux-year-mask">
            <span ref={ground} className="na-feux-ground" aria-hidden="true" />
            <span
              ref={yearText}
              className="na-feux-year bg-linear-to-b from-[#fff8e8] via-[#f1d99d] to-[#c9974f] bg-clip-text font-[family-name:var(--font-cormorant)] text-transparent"
            >
              {year}
            </span>
          </span>
        </h1>
        <p
          ref={line}
          className="na-feux-message"
        >
          {phrase}
        </p>
      </div>
    </div>
  );
}
