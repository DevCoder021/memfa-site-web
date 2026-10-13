"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LightParticles from "./LightParticles";

gsap.registerPlugin(useGSAP);

type Props = {
  year: string;
  phrase: string;
  lite: boolean;
  /** Arrivée après minuit : on affiche directement l'état final. */
  skip: boolean;
  onDone: () => void;
};

export default function Reveal({ year, phrase, lite, skip, onDone }: Props) {
  const scope = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const line = useRef<HTMLParagraphElement>(null);
  const [particles, setParticles] = useState(false);

  useGSAP(
    () => {
      // Rayon du masque (en %) : la lumière "dessine" le titre en s'élargissant
      const mask = { r: -20 };
      const applyMask = () => {
        const v = `radial-gradient(circle at 50% 50%, #000 ${mask.r}%, transparent ${mask.r + 20}%)`;
        title.current?.style.setProperty("mask-image", v);
        title.current?.style.setProperty("-webkit-mask-image", v);
      };
      applyMask();

      gsap.set(halo.current, { opacity: 0, scale: 0.05 });
      gsap.set(core.current, { opacity: 0, scale: 0.2 });
      gsap.set(title.current, { letterSpacing: "0.14em" });
      gsap.set(line.current, { opacity: 0, filter: "blur(10px)" });

      // === Durées à ajuster : voir les positions (dernier argument) de chaque étape ===
      const tl = gsap.timeline({ onComplete: onDone });
      tl
        // 1. Le point de lumière apparaît
        .to(core.current, { opacity: 1, scale: 1, duration: 1.4, ease: "power2.out" }, 0.3)
        // 2. La lumière s'étend
        .to(halo.current, { opacity: 0.9, scale: 1.4, duration: 4, ease: "power2.out" }, 0.6)
        // 3. Elle révèle le titre
        .to(mask, { r: 105, duration: 4.2, ease: "power2.inOut", onUpdate: applyMask }, 1.2)
        .to(title.current, { letterSpacing: "0.06em", duration: 5, ease: "power2.out" }, 1.2)
        // 4. Le point se dissout dans le titre
        .to(core.current, { scale: 3, opacity: 0, duration: 2.5, ease: "power1.in" }, 2.4)
        // 5. Poussière dorée
        .add(() => setParticles(true), 3.2)
        // 6. La lumière se calme
        .to(halo.current, { opacity: 0.3, scale: 1, duration: 3, ease: "power1.inOut" }, 4.8)
        // 7. La phrase apparaît
        .to(line.current, { opacity: 1, filter: "blur(0px)", duration: 2.2, ease: "power2.out" }, 5.4);

      if (lite) tl.timeScale(1.25);

      if (skip) {
        setParticles(true);
        tl.progress(1, true); // saute à l'état final sans déclencher les callbacks
        onDone();
      }
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="absolute inset-0 flex flex-col items-center justify-center px-6"
    >
      <div ref={halo} className="na-reveal-halo" />
      <div ref={core} className="na-core" />
      <LightParticles active={particles} count={lite ? 30 : 80} />

      <h1
        ref={title}
        className="relative bg-linear-to-b from-[#f6ecd0] to-[#c4a257] bg-clip-text text-center font-[family-name:var(--font-italiana)] text-[clamp(5.5rem,30vw,17rem)] leading-none text-transparent"
      >
        {year}
      </h1>
      <p
        ref={line}
        className="relative mt-8 max-w-[30ch] text-center font-[family-name:var(--font-jost)] text-[clamp(1rem,3.4vw,1.35rem)] font-light leading-relaxed tracking-[0.04em] text-[#cdbf9f]"
      >
        {phrase}
      </p>
    </div>
  );
}
