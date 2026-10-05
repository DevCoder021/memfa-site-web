"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import {
  LayoutDashboard, Newspaper, Book, Mic, Video, MessageSquare, HandHeart, Settings, LogOut, Menu, X,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/livres", label: "Bibliothèque", icon: Book },
  { href: "/admin/audios", label: "Audios", icon: Mic },
  { href: "/admin/live", label: "Direct Live", icon: Video },
  { href: "/admin/dons", label: "Dons", icon: HandHeart },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminPanelShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      wheelMultiplier: 0.85,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });
      timeline.fromTo(
        sidebarRef.current,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 1.05 }
      );
      const navLinks = sidebarRef.current?.querySelectorAll("nav a");
      if (navLinks?.length) {
        timeline.fromTo(
          navLinks,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.65, stagger: 0.09 },
          "-=0.72"
        );
      }
      timeline.fromTo(
        mainRef.current,
        { opacity: 0, x: 18 },
        { opacity: 1, x: 0, duration: 0.95 },
        "-=0.55"
      );

      const dashboard = mainRef.current?.querySelector("[data-admin-dashboard]");
      const revealItems = dashboard?.querySelectorAll("[data-dashboard-reveal]");
      if (dashboard && revealItems?.length) {
        timeline.fromTo(
          revealItems,
          { opacity: 0, y: 18, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.05,
            stagger: 0.16,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
          "-=0.38"
        );
      }
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--color-memfa-violet-soft)]">
      <aside ref={sidebarRef} className="w-72 hidden md:flex flex-col fixed left-4 top-4 bottom-4 rounded-2xl bg-[var(--background)] border border-[var(--color-memfa-violet-line)] shadow-[0_8px_30px_rgba(58,19,97,0.08)] z-20">
        <div className="h-24 flex items-center px-6 border-b border-[var(--color-memfa-violet-line)]">
          <Image src="/assets/logo.png" alt="MEMFA" width={40} height={40} className="mr-3" />
          <div>
            <h1 className="font-bold text-sm text-[var(--color-memfa-charcoal)] leading-tight">
              MEMFA ADMIN PANEL
            </h1>
            <p className="text-[10px] text-[var(--memfa-ink-60)] font-mono uppercase tracking-[0.08em]">Administration Système</p>
          </div>
        </div>

        <nav className="mt-4 px-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  active
                    ? "bg-[var(--color-memfa-violet)] text-white shadow-md shadow-[var(--color-memfa-violet)]/20"
                    : "text-[var(--memfa-ink-60)] hover:bg-[var(--color-memfa-violet-soft)] hover:text-[var(--color-memfa-violet)]"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] mr-3 ${active ? "text-white" : "text-slate-400"}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[var(--color-memfa-violet-line)] space-y-1">
          <Link
            href="/admin/parametres"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-[var(--memfa-ink-60)] hover:bg-[var(--color-memfa-violet-soft)] hover:text-[var(--color-memfa-violet)] transition-colors"
          >
            <Settings className="w-[18px] h-[18px] mr-3 text-slate-400" />
            Paramètres
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px] mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      <header className="sticky top-2 z-30 -mx-4 mb-6 flex items-center justify-between rounded-b-xl border-b border-[var(--color-memfa-violet-line)] bg-white/95 px-4 py-3 shadow-sm backdrop-blur sm:-mx-6 sm:px-6 md:hidden">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
          <Image src="/assets/logo.png" alt="" width={36} height={36} className="shrink-0" />
          <span className="truncate text-sm font-bold text-[var(--color-memfa-charcoal)]">MEMFA ADMIN</span>
        </Link>
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Fermer le menu d’administration" : "Ouvrir le menu d’administration"}
          aria-expanded={mobileMenuOpen}
          aria-controls="admin-mobile-navigation"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--color-memfa-violet-line)] text-[var(--color-memfa-violet-deep)] transition-colors hover:bg-[var(--color-memfa-violet-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-memfa-violet)]"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {mobileMenuOpen && (
          <div
            id="admin-mobile-navigation"
            className="absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-b border-[var(--color-memfa-violet-line)] bg-white px-4 py-3 shadow-xl"
          >
            <nav aria-label="Navigation d’administration" className="space-y-1">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-[var(--color-memfa-violet)] text-white"
                        : "text-[var(--memfa-ink-60)] hover:bg-[var(--color-memfa-violet-soft)] hover:text-[var(--color-memfa-violet)]"
                    }`}
                  >
                    <Icon className={`mr-3 h-[18px] w-[18px] ${active ? "text-white" : "text-slate-400"}`} aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-2 border-t border-[var(--color-memfa-violet-line)] pt-2">
              <Link
                href="/admin/parametres"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-medium text-[var(--memfa-ink-60)] hover:bg-[var(--color-memfa-violet-soft)]"
              >
                <Settings className="mr-3 h-[18px] w-[18px] text-slate-400" aria-hidden="true" />
                Paramètres
              </Link>
              <button
                type="button"
                onClick={() => void signOut({ callbackUrl: "/admin" })}
                className="flex min-h-11 w-full items-center rounded-xl px-4 py-2.5 text-left text-sm font-medium text-red-500 hover:bg-red-50"
              >
                <LogOut className="mr-3 h-[18px] w-[18px]" aria-hidden="true" />
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </header>

      <main ref={mainRef} className="min-h-[calc(100dvh-5rem)] min-w-0 w-full px-4 py-5 sm:px-6 sm:py-8 md:ml-80 md:min-h-screen md:w-auto md:p-10">{children}</main>
    </div>
  );
}
