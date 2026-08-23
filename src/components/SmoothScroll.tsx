"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface SmoothScrollProps {
  children: ReactNode;
}

const SmoothScroll = ({ children }: SmoothScrollProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    let destroyed = false;

    const onScroll = () => {
      if (!destroyed) {
        ScrollTrigger.update();
      }
    };

    lenis.on("scroll", onScroll);

    const update = (time: number) => {
      if (!destroyed) {
        lenis.raf(time * 1000);
      }
    };

    const refreshTimer = window.setTimeout(() => {
      if (!destroyed) {
        ScrollTrigger.refresh();
      }
    }, 300);

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      destroyed = true;
      window.clearTimeout(refreshTimer);
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
