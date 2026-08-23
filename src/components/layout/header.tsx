"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-white/70 backdrop-blur-xl border-b border-gray-50">
      <div className="flex items-center gap-3">
        <img
          src="/assets/logo.png"
          alt="MEMFA Logo"
          className="h-8 w-auto"
        />
        <div className="text-xl font-bold tracking-tighter text-[#1a0f2b]">
          MEMFA
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
        <a href="#" className="hover:text-black transition-colors">Accueil</a>
        <a href="#a-propos" className="hover:text-black transition-colors">À Propos</a>
        <a href="#impact" className="hover:text-black transition-colors">Impact</a>
        <a href="#activites" className="hover:text-black transition-colors">Activités</a>
        <a href="#multimedia" className="hover:text-black transition-colors">Média</a>
        <a href="#actualites" className="hover:text-black transition-colors">Actualités</a>
        <a href="#contact" className="hover:text-black transition-colors">Contact</a>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden w-8 h-8 flex flex-col justify-center items-center gap-1"
        aria-label="Menu"
      >
        <span className={`w-5 h-0.5 bg-[#1a0f2b] transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-[#1a0f2b] transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`w-5 h-0.5 bg-[#1a0f2b] transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      <Link
        href="/don"
        className="hidden md:block bg-[#1a0f2b] text-white rounded-full px-6 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-all"
      >
        Don en ligne
      </Link>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-50 transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="flex flex-col px-6 py-8 gap-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-400">
          <a href="#" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Accueil</a>
          <a href="#a-propos" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>À Propos</a>
          <a href="#impact" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Impact</a>
          <a href="#activites" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Activités</a>
          <a href="#multimedia" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Média</a>
          <a href="#actualites" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Actualités</a>
          <a href="#contact" className="hover:text-black transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Contact</a>
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/don"
              className="w-full inline-flex items-center justify-center bg-[#1a0f2b] text-white rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-wider hover:bg-black transition-all"
              onClick={() => setIsMenuOpen(false)}
            >
              Don en ligne
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
