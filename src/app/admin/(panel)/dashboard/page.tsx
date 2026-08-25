import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import {
  Newspaper, Mic, Book, MessageSquare, Quote as QuoteIcon,
  Radio, Plus, Upload, BookPlus, MessagesSquare, Bell,
} from "lucide-react";

const JOURS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

type DashboardActualite = {
  id: string;
  titre: string;
  datePublication: Date;
  isPublished: boolean;
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const [
    totalActualites, totalAudios, totalLivres, totalCitations, messagesNonLus,
    liveActif, dernieresActualites, derniersMessages,
    actualitesRecentes, audiosRecents, livresRecents, messagesRecents,
  ] = await Promise.all([
    prisma.actualite.count({ where: { isPublished: true } }),
    prisma.audio.count(),
    prisma.livre.count(),
    prisma.quote.count(),
    prisma.message.count({ where: { isRead: false } }),
    prisma.live.findFirst({ where: { isActive: true } }),
    prisma.actualite.findMany({ orderBy: { datePublication: "desc" }, take: 3 }),
    prisma.message.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.actualite.findMany({ select: { createdAt: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
    prisma.audio.findMany({ select: { createdAt: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
    prisma.livre.findMany({ select: { createdAt: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
    prisma.message.findMany({ select: { createdAt: true }, where: { createdAt: { gte: new Date(Date.now() - 7 * 864e5) } } }),
  ]);

  // Vraies données : nombre de contenus créés (actus + audios + livres + messages) par jour, 7 derniers jours
  const activite = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    day.setHours(0, 0, 0, 0);
    const next = new Date(day);
    next.setDate(next.getDate() + 1);

    const count = [...actualitesRecentes, ...audiosRecents, ...livresRecents, ...messagesRecents].filter(
      (item) => item.createdAt >= day && item.createdAt < next
    ).length;

    return { label: JOURS[day.getDay()], count };
  });
  const maxCount = Math.max(1, ...activite.map((a) => a.count));

  const quickActions = [
    { label: "Nouvelle actualité", icon: Plus, href: "/admin/actualites", primary: true },
    { label: "Ajouter un audio", icon: Upload, href: "/admin/audios" },
    { label: "Ajouter un livre", icon: BookPlus, href: "/admin/livres" },
    { label: "Ajouter une citation", icon: MessagesSquare, href: "/admin/citations" },
  ];

  const stats = [
    { label: "Audios disponibles", value: totalAudios, icon: Mic },
    { label: "Livres disponibles", value: totalLivres, icon: Book },
    { label: "Messages non lus", value: messagesNonLus, icon: MessageSquare, highlight: true },
    { label: "Citations bibliques", value: totalCitations, icon: QuoteIcon },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-memfa-charcoal)]">Tableau de bord</h1>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-slate-500" />
            {messagesNonLus > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[var(--color-memfa-violet)] text-white flex items-center justify-center text-xs font-semibold">
              {(session?.user?.name ?? "A").slice(0, 2).toUpperCase()}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-[var(--color-memfa-charcoal)] leading-tight">
                {session?.user?.name ?? "admin"}
              </p>
              <p className="text-xs text-slate-400">Administrateur</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="flex flex-wrap gap-3 mb-6">
        {quickActions.map(({ label, icon: Icon, href, primary }) => (
          <Link
            key={label}
            href={href}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              primary
                ? "bg-[var(--color-memfa-violet)] text-white shadow-md shadow-[var(--color-memfa-violet)]/20"
                : "bg-white border border-slate-200 text-slate-600 hover:border-[var(--color-memfa-violet)]/30"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </div>

      {/* Hero + Live */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Link
          href="/admin/actualites"
          className="lg:col-span-2 relative overflow-hidden rounded-3xl p-7 flex flex-col justify-between min-h-[190px] group"
          style={{ background: "linear-gradient(135deg, var(--color-memfa-violet) 0%, var(--color-memfa-violet-deep) 100%)" }}
        >
          <Image
            src="/assets/logo.png"
            alt=""
            width={180}
            height={180}
            className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-15 transition-opacity"
          />
          <div className="flex items-center gap-2 relative">
            <span className="text-white/70 text-sm font-medium">Actualités publiées</span>
            <Newspaper className="w-4 h-4 text-white/50" />
          </div>
          <div className="relative">
            <p className="text-5xl font-bold text-white mb-2">{totalActualites}</p>
            <p className="text-white/60 text-sm max-w-sm mb-4">
              Actualités publiées sur le site. Gardez votre communauté informée des derniers événements.
            </p>
            <span className="text-white text-sm font-medium">Voir les actualités →</span>
          </div>
        </Link>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-[var(--color-memfa-violet)]" />
              <span className="font-semibold text-sm text-[var(--color-memfa-charcoal)]">Direct Live</span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                liveActif ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"
              }`}
            >
              {liveActif ? "En direct" : "En attente"}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <Radio className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {liveActif ? liveActif.titre : "Aucune diffusion en cours."}
            </p>
            <Link
              href="/admin/live"
              className="px-4 py-2 rounded-xl bg-[var(--color-memfa-violet)] text-white text-xs font-semibold"
            >
              Configurer le direct
            </Link>
          </div>
        </div>
      </div>

      {/* Stats secondaires */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {stats.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className={`rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border ${
              highlight ? "border-[var(--color-memfa-or)]" : "border-slate-100"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-4 ${
                highlight ? "bg-[var(--color-memfa-or)]/15" : "bg-[var(--color-memfa-violet)]/8"
              }`}
            >
              <Icon className={`w-4 h-4 ${highlight ? "text-amber-600" : "text-[var(--color-memfa-violet)]"}`} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-memfa-charcoal)]">{value}</p>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Activité du site — vraies données (contenus créés / jour, 7 derniers jours) */}
      <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 mb-4">
        <h2 className="font-semibold text-[var(--color-memfa-charcoal)] mb-1">Activité du site</h2>
        <p className="text-xs text-slate-400 mb-6">Contenus publiés au cours des 7 derniers jours</p>
        <div className="flex items-end justify-between gap-3 h-40">
          {activite.map(({ label, count }, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center h-32">
                <div
                  className={`w-full max-w-10 rounded-t-lg transition-all ${
                    count === maxCount && count > 0 ? "bg-[var(--color-memfa-violet)]" : "bg-[var(--color-memfa-violet)]/30"
                  }`}
                  style={{ height: `${Math.max(6, (count / maxCount) * 100)}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dernières actualités / derniers messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-memfa-charcoal)]">Dernières actualités</h2>
            <Link href="/admin/actualites" className="text-xs text-[var(--color-memfa-violet)] font-medium">
              Voir tout
            </Link>
          </div>
          {dernieresActualites.length === 0 ? (
            <p className="text-slate-400 text-sm py-6 text-center">Aucune actualité pour le moment.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {(dernieresActualites as DashboardActualite[]).map((a) => (
                <div key={a.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-memfa-charcoal)] truncate">{a.titre}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(a.datePublication).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                      a.isPublished ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {a.isPublished ? "Publié" : "Brouillon"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[var(--color-memfa-charcoal)]">Derniers messages</h2>
            <Link href="/admin/messages" className="text-xs text-[var(--color-memfa-violet)] font-medium">
              Voir tout
            </Link>
          </div>
          {derniersMessages.length === 0 ? (
            <p className="text-slate-400 text-sm py-6 text-center">Aucun message pour le moment.</p>
          ) : (
            <div className="divide-y divide-slate-50">
              {derniersMessages.map((m) => (
                <div key={m.id} className="py-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-memfa-violet)]/10 text-[var(--color-memfa-violet)] flex items-center justify-center text-xs font-semibold shrink-0">
                    {m.nom.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-memfa-charcoal)]">{m.nom}</p>
                    <p className="text-xs text-slate-400 truncate">{m.message}</p>
                  </div>
                  {!m.isRead && <span className="w-2 h-2 rounded-full bg-[var(--color-memfa-violet)] shrink-0" />}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}