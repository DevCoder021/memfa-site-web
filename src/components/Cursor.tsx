"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Cursor = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Mouse positions
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring config for the ring (magnetic effect)
  const springConfig = { damping: 20, stiffness: 250, mass: 0.5 };
  const ringX = useSpring(mouseX, springConfig);
  const ringY = useSpring(mouseY, springConfig);

  useEffect(() => {
    let mounted = true;

    // Check if mobile (max-width 768px)
    const checkMobile = () => {
      if (!mounted) return;
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Mouse movement tracking
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    // Hover detection for clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (mounted) {
        setIsHovering(!!isClickable);
      }
    };

    // Click detection
    const handleMouseDown = () => mounted && setIsClicking(true);
    const handleMouseUp = () => mounted && setIsClicking(false);

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      mounted = false;
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "auto";
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    document.body.style.cursor = isMobile ? "auto" : "none";

    return () => {
      document.body.style.cursor = "auto";
    };
  }, [isMobile]);

  // Disable cursor on mobile
  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* Ring (40px) - Follows with spring effect */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.7 : isHovering ? 1.8 : 1,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed top-0 left-0 w-10 h-10 border-2 border-[#C9A84C] rounded-full mix-blend-difference"
      />

      {/* Dot (8px) - Follows exactly */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicking ? 0.7 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        className="fixed top-0 left-0 w-2 h-2 bg-[#C9A84C] rounded-full mix-blend-difference"
      />
    </div>
  );
};

export default Cursor;
