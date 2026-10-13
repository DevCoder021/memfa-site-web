"use client";

import { useEffect, useRef } from "react";
import { FireworksEngine } from "@/lib/nouvel-an/fireworks";

type Props = {
  lite: boolean;
  skip: boolean;
  onFinaleBurst: (engine: FireworksEngine, reducedMotion: boolean) => void;
  onBurst: (intensity: number) => void;
};

export default function FireworksCanvas({
  lite,
  skip,
  onFinaleBurst,
  onBurst,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const finaleRef = useRef(onFinaleBurst);
  const burstRef = useRef(onBurst);

  useEffect(() => {
    finaleRef.current = onFinaleBurst;
  }, [onFinaleBurst]);

  useEffect(() => {
    burstRef.current = onBurst;
  }, [onBurst]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const engine = new FireworksEngine(canvas, {
      lite,
      reducedMotion,
      onBurst: (intensity) => burstRef.current(intensity),
      onFinaleBurst: (fireworks, reduced) =>
        finaleRef.current(fireworks, reduced),
    });
    engine.startShow(skip);

    let frame = 0;
    let previousTime: number | null = null;

    const animate = (time: number) => {
      if (document.hidden) return;
      const dt = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      engine.update(dt);
      engine.draw();
      frame = window.requestAnimationFrame(animate);
    };

    const resize = () => engine.resize();
    const visibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
        previousTime = null;
      } else {
        previousTime = null;
        frame = window.requestAnimationFrame(animate);
      }
    };

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    frame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      engine.destroy();
    };
  }, [lite, skip]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
