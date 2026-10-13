"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  life: number;
  max: number;
};

type Props = { active: boolean; count: number };

/** Poussière de lumière dorée qui s'élève doucement (canvas 2D). */
export default function LightParticles({ active, count }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = performance.now();
    let particles: Particle[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: h * (0.45 + Math.random() * 0.65),
      vx: (Math.random() - 0.5) * 8,
      vy: -(8 + Math.random() * 22),
      r: 0.6 + Math.random() * 1.6,
      life: 0,
      max: 5 + Math.random() * 6,
    });

    const frame = (time: number) => {
      const dt = Math.min((time - last) / 1000, 0.05);
      last = time;

      if (activeRef.current && particles.length < count) {
        // étale l'apparition sur ~4 secondes
        if (Math.random() < (dt * count) / 4) particles.push(spawn());
      }

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      particles = particles.filter((p) => p.life < p.max);
      for (const p of particles) {
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const alpha = Math.sin(Math.PI * (p.life / p.max)) * 0.8;
        ctx.fillStyle = `rgba(232, 205, 140, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(232, 205, 140, ${alpha / 6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      particles = [];
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
