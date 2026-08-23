"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState, createContext, useContext } from "react";

const LoadingContext = createContext({ isLoading: true });
export const useLoading = () => useContext(LoadingContext);

export default function PageTransition({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    const unmountTimer = setTimeout(() => {
      setShowOverlay(false);
    }, 1600);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading }}>
      {showOverlay && (
        <motion.div
          initial={false}
          animate={{
            opacity: isLoading ? 1 : 0,
            pointerEvents: isLoading ? "auto" : "none",
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#1a0f2b]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <img src="/assets/logo.png" alt="Logo" className="w-24 h-24 mb-6 object-contain" />
            <div className="w-48 h-[2px] bg-white/10 overflow-hidden relative">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute inset-0 bg-[#C9A84C]"
              />
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="relative w-full">
        {children}
      </div>
    </LoadingContext.Provider>
  );
}
