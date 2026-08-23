"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, ReactNode } from "react";
import { useLoading } from "@/components/PageTransition";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "none";
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
}

export const ScrollReveal = ({
  children,
  direction = "up",
  delay = 0,
  duration = 0.9,
  once = true,
  className = "",
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: "-10% 0px" 
  });
  const { isLoading } = useLoading();

  const getInitial = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 60 };
      case "down":
        return { opacity: 0, y: -60 };
      case "left":
        return { opacity: 0, x: -80 };
      case "right":
        return { opacity: 0, x: 80 };
      case "scale":
        return { opacity: 0, scale: 0.85 };
      case "none":
        return { opacity: 0 };
      default:
        return { opacity: 0, y: 60 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitial()}
      animate={(isInView && !isLoading) ? { opacity: 1, y: 0, x: 0, scale: 1 } : getInitial()}
      transition={{
        duration,
        delay,
        ease: [0.33, 1, 0.68, 1],
      }}
      className={`will-change-transform w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface StaggerRevealProps {
  children: ReactNode;
  delay?: number;
  staggerChildren?: number;
  once?: boolean;
  className?: string;
}

export const StaggerReveal = ({
  children,
  delay = 0,
  staggerChildren = 0.12,
  once = true,
  className = "",
}: StaggerRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: "-10% 0px" 
  });
  const { isLoading } = useLoading();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: staggerChildren,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.33, 1, 0.68, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={(isInView && !isLoading) ? "visible" : "hidden"}
      className={`will-change-transform ${className}`}
    >
      {/* 
        Note: Pour que le stagger fonctionne, les enfants directs doivent 
        être des motion.div utilisant itemVariants.
      */}
      {Array.isArray(children) 
        ? children.map((child, i) => (
            <motion.div key={i} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : (
          <motion.div variants={itemVariants}>
            {children}
          </motion.div>
        )
      }
    </motion.div>
  );
};

export default ScrollReveal;
