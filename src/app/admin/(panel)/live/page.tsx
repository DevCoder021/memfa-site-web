"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus, Pencil, Trash2, X, Video, Link as LinkIcon, Type, Calendar, Send, Square,
} from "lucide-react";

type Live = {
  id: string;
  titre: string;
  videoUrl: string;
  isActive: boolean;
  scheduledFor: string | null;
};

export default function LiveAdminPage() {
  const [items, setItems] = useState<Live[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Live | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/live");
      if (!res.ok) throw new Error("Impossible de charger les lives");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce live ?")) return;
    await fetch(`/api/admin/live/${id}`, { method: "DELETE" });
    void load();
  };

  const handleStop = async (item: Live) => {
    await fetch(`/api/admin/live/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isActive: false }),
    });
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-memfa-charcoal">Gestion du Direct (Live)</h1>
        <button
          onClick={() => {
            setEditing(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-memfa-violet text-white text-sm font-semibold shadow-md shadow-memfa-violet/20"
        >
          <Plus className="w-4 h-4" /> Nouveau
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6">Ajoutez, modifiez ou supprimez du contenu.</p>

      {loading ? (
        <p className="text-slate-400 text-sm py-10 text-center">Chargement...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-10 text-center">
          <p className="text-slate-400 text-sm">Aucun live configuré pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((l) => (
            <div key={l.id} className="rounded-2xl border border-slate-100 overflow-hidden">
              <div className="relative h-32 bg-linear-to-br from-memfa-violet to-purple-400 flex items-center justify-center">
                <Video className="w-8 h-8 text-white/80" />
                {l.isActive && (
                  <span className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    En ligne
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-memfa-charcoal mb-1">{l.titre}</h3>
                <a
                  href={l.videoUrl}
                  target="_blank"
                  className="text-xs text-memfa-violet truncate block mb-3"
                >
                  {l.videoUrl}
                </a>

                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Date</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <p className="text-sm text-memfa-charcoal font-medium">
                    {l.scheduledFor
                      ? new Date(l.scheduledFor).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                      : "—"}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditing(l);
                        setShowModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {l.isActive && (
                      <button
                        onClick={() => handleStop(l)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-semibold"
                      >
                        <Square className="w-3 h-3" /> Arrêter
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <LiveModal
          live={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            void load();
          }}
        />
      )}
    </div>
  );
}

function LiveModal({
  live,
  onClose,
  onSaved,
}: {
  live: Live | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titre, setTitre] = useState(live?.titre ?? "");
  const [videoUrl, setVideoUrl] = useState(live?.videoUrl ?? "");
  const [scheduledFor, setScheduledFor] = useState(
    live?.scheduledFor ? new Date(live.scheduledFor).toISOString().slice(0, 16) : ""
  );
  const [isActive, setIsActive] = useState(live?.isActive ?? false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = { titre, videoUrl, scheduledFor: scheduledFor || null, isActive };

    if (live) {
      await fetch(`/api/admin/live/${live.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-memfa-violet/10 flex items-center justify-center">
              <Video className="w-4 h-4 text-memfa-violet" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-memfa-charcoal">
                {live ? "Modifier le live" : "Nouveau Live"}
              </h2>
              <p className="text-xs text-slate-400">Configurez un direct YouTube/Facebook</p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Titre du direct
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={titre}
                onChange={(e) => setTitre(e.target.value)}
                placeholder="Ex: Grande Convention Spirituelle 2026"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              URL du live
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Collez l&apos;URL complète de votre diffusion YouTube ou Facebook.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
              Date de programmation
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-memfa-violet/5 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="mt-0.5"
            />
            <div>
              <p className="text-sm font-medium text-memfa-charcoal">Activer ce live immédiatement</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Cette action désactivera automatiquement toute autre diffusion en cours.
              </p>
            </div>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-memfa-violet text-white text-sm font-semibold disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {saving ? "Publication..." : "Publier"}
          </button>
        </div>
      </form>
    </div>
  );
}