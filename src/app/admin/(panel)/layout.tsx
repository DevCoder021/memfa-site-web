"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home, Newspaper, Book, Mic, Video, MessageSquare, HandHeart, Settings, LogOut,
} from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: Home },
  { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
  { href: "/admin/livres", label: "Bibliothèque", icon: Book },
  { href: "/admin/audios", label: "Audios", icon: Mic },
  { href: "/admin/live", label: "Direct Live", icon: Video },
  { href: "/admin/dons", label: "Dons", icon: HandHeart },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
];

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--color-memfa-violet-soft)]">
      {/* Sidebar fixe : reste à l'écran même quand le contenu principal scrolle */}
      <aside className="w-72 hidden md:flex flex-col fixed left-4 top-4 bottom-4 rounded-2xl bg-[var(--background)] border border-[var(--color-memfa-violet-line)] shadow-[0_8px_30px_rgba(58,19,97,0.08)] z-20">
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

      {/* md:ml-80 = largeur sidebar (18rem) + marge gauche (1rem) + respiration */}
      <main className="md:ml-80 p-6 md:p-10 min-h-screen">{children}</main>
    </div>
  );
}