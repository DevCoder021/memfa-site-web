"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";

const navLinks = [
  { name: "Accueil", href: "/" },
  { name: "À Propos", href: "/#a-propos" },
  { name: "Impact", href: "/#impact" },
  { name: "Activités", href: "/#activites" },
  { name: "Média", href: "/media" },
  { name: "Actualités", href: "/#actualites" },
  { name: "Contact", href: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "bg-[var(--color-memfa-violet-deep)]/95 backdrop-blur-md py-4 border-b border-white/10"
          : "bg-[var(--background)]/90 backdrop-blur-md py-6 border-b border-[var(--color-memfa-violet-line)]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="relative z-[60] flex items-center gap-3">
          <img src="/assets/logo.png" alt="MEMFA Logo" className="w-10 h-10 object-contain" />
          <span className={`font-serif font-semibold text-xl tracking-tight transition-colors duration-500 ${scrolled || isOpen ? "text-white" : "text-[var(--color-memfa-violet-deep)]"}`}>
            MEMFA
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`relative group text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${
                scrolled ? "text-white/80 hover:text-white" : "text-[var(--memfa-ink-60)] hover:text-[var(--color-memfa-violet)]"
              }`}
            >
              {link.name}
              <motion.span
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
                className={`absolute -bottom-1 left-0 w-full h-[2px] ${scrolled ? "bg-[var(--color-memfa-or-bright)]" : "bg-[var(--color-memfa-or)]"}`}
              />
            </Link>
          ))}
          <Link
            href="/don"
            className="bg-[var(--color-memfa-violet)] text-white px-8 py-3 rounded-lg font-semibold text-[10px] uppercase tracking-[0.14em] hover:bg-[var(--color-memfa-violet-deep)] transition-all duration-300 shadow-lg shadow-[var(--color-memfa-violet)]/20"
          >
            Don en ligne
          </Link>
        </div>

        {/* Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="relative z-[60] lg:hidden w-10 h-10 flex items-center justify-center"
          aria-label="Toggle Menu"
        >
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1.5"
          >
            <motion.span 
              animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className={`block w-6 h-0.5 transition-colors duration-500 ${isOpen || scrolled ? "bg-white" : "bg-[#1a0f2b]"}`}
            />
            <motion.span 
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              className={`block w-6 h-0.5 transition-colors duration-500 ${isOpen || scrolled ? "bg-white" : "bg-[#1a0f2b]"}`}
            />
            <motion.span 
              animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className={`block w-6 h-0.5 transition-colors duration-500 ${isOpen || scrolled ? "bg-white" : "bg-[#1a0f2b]"}`}
            />
          </motion.div>
        </button>

        {/* Fullscreen Menu Overlay rendered into a portal so it's viewport-anchored */}
        {typeof document !== "undefined" &&
          createPortal(
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="mobile-menu"
                  initial={{ clipPath: "circle(0% at 95% 5%)" }}
                  animate={{ clipPath: "circle(150% at 95% 5%)" }}
                  exit={{ clipPath: "circle(0% at 95% 5%)" }}
                  transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
                  className="fixed inset-0 bg-[var(--color-memfa-violet-deep)] z-[9999] flex flex-col items-center justify-center p-6"
                >
                  {/* Close button (croix) */}
                  <button
                    aria-label="Fermer le menu"
                    onClick={() => setIsOpen(false)}
                    className="absolute top-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 text-white"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                      <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="flex flex-col items-center gap-6">
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.5,
                          delay: i * 0.08 + 0.2,
                        }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className="font-serif text-4xl italic font-semibold text-white hover:text-[var(--color-memfa-or-bright)] transition-colors duration-300 tracking-tight"
                        >
                          {link.name}
                        </Link>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{
                        duration: 0.5,
                        delay: navLinks.length * 0.08 + 0.2,
                      }}
                      className="mt-6"
                    >
                      <Link
                        href="/don"
                        onClick={() => setIsOpen(false)}
                        className="bg-[var(--color-memfa-or-bright)] text-[var(--color-memfa-charcoal)] px-10 py-4 rounded-lg font-semibold text-xs uppercase tracking-[0.14em] shadow-2xl"
                      >
                        Don en ligne
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>,
            document.body
          )}
      </div>
    </nav>
  );
};

export default Navbar;
