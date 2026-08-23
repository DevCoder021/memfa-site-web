"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLoading } from "@/components/PageTransition";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

const ImageReveal = ({ src, alt, className = "", aspectRatio = "aspect-[4/5]" }: ImageRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { isLoading } = useLoading();

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-[40px] ${aspectRatio} ${className}`}
    >
      {/* Masque noir qui se lève */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={(isInView && !isLoading) ? { scaleY: 0 } : { scaleY: 1 }}
        transition={{
          duration: 1.1,
          ease: [0.77, 0, 0.175, 1],
        }}
        style={{ originY: 0 }} // originY: 0 corresponds to "top"
        className="absolute inset-0 bg-black z-10"
      />

      {/* Image qui dé-zoome */}
      <motion.img
        src={src}
        alt={alt}
        initial={{ scale: 1.2 }}
        animate={(isInView && !isLoading) ? { scale: 1 } : { scale: 1.2 }}
        transition={{
          duration: 1.1,
          ease: [0.77, 0, 0.175, 1],
        }}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ImageReveal;
