"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, X, Search, Music, User, FileAudio, Send, Play, Pause,
} from "lucide-react";

type Audio = {
  id: string;
  titre: string;
  speaker: string | null;
  description: string | null;
  filePath: string;
  duration: string | null;
};

export default function AudiosAdminPage() {
  const [items, setItems] = useState<Audio[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Audio | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audios");
      if (!res.ok) throw new Error("Impossible de charger les audios");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    return () => {
      audioElRef.current?.pause();
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cet audio ?")) return;
    await fetch(`/api/admin/audios/${id}`, { method: "DELETE" });
    void load();
  };

  const toggleListen = (item: Audio) => {
    if (playingId === item.id) {
      audioElRef.current?.pause();
      setPlayingId(null);
      return;
    }
    audioElRef.current?.pause();
    const el = new Audio(item.filePath);
    audioElRef.current = el;
    el.play();
    el.onended = () => setPlayingId(null);
    setPlayingId(item.id);
  };

  const filtered = items.filter((a) =>
    a.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-memfa-charcoal">Gestion des Audios / Podcasts</h1>
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

      <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-memfa-charcoal">Liste des Audios / Podcasts</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un audio..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-memfa-violet w-56"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm py-10 text-center">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-100 overflow-hidden">
                <div className="relative h-32 bg-memfa-violet flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-white/15 text-white">
                    AUDIO
                  </span>
                </div>
                <div className="p-4">
                  {a.speaker && (
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      {a.speaker}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-memfa-charcoal line-clamp-2 mb-3 min-h-10">
                    {a.titre}
                  </h3>
                  <span className="inline-block text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg mb-3">
                    {a.duration || "N/A"}
                  </span>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <button
                      onClick={() => toggleListen(a)}
                      className="flex items-center gap-1.5 text-xs font-medium text-memfa-violet"
                    >
                      {playingId === a.id ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      {playingId === a.id ? "Pause" : "Écouter"}
                    </button>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditing(a);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={() => {
                setEditing(null);
                setShowModal(true);
              }}
              className="rounded-2xl border-2 border-dashed border-memfa-violet/30 bg-memfa-violet/5 flex flex-col items-center justify-center text-center p-8 min-h-[220px] hover:bg-memfa-violet/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Plus className="w-5 h-5 text-memfa-violet" />
              </div>
              <p className="font-semibold text-sm text-memfa-charcoal">Ajouter un nouveau podcast</p>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <AudioModal
          audio={editing}
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

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function AudioModal({
  audio,
  onClose,
  onSaved,
}: {
  audio: Audio | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titre, setTitre] = useState(audio?.titre ?? "");
  const [speaker, setSpeaker] = useState(audio?.speaker ?? "");
  const [description, setDescription] = useState(audio?.description ?? "");
  const [filePath, setFilePath] = useState(audio?.filePath ?? "");
  const [fileName, setFileName] = useState("");
  const [duration, setDuration] = useState(audio?.duration ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setFileName(file.name);

    // Durée réelle du fichier, lue avant l'upload
    const tempUrl = URL.createObjectURL(file);
    const probe = new window.Audio(tempUrl);
    probe.onloadedmetadata = () => {
      setDuration(formatDuration(probe.duration));
      URL.revokeObjectURL(tempUrl);
    };

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload-audio", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.url) setFilePath(data.url);
    else alert(data.error ?? "Erreur lors de l'upload");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePath) {
      alert("Merci de choisir un fichier audio.");
      return;
    }
    setSaving(true);

    const payload = { titre, speaker, description, filePath, duration };

    if (audio) {
      await fetch(`/api/admin/audios/${audio.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/audios", {
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
              <Music className="w-4 h-4 text-memfa-violet" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-memfa-charcoal">
                {audio ? "Modifier l'audio" : "Nouvel Audio"}
              </h2>
              <p className="text-xs text-slate-400">Ajoutez un podcast ou enseignement audio</p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Titre</label>
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex: Grande Convention Spirituelle 2026"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Intervenant</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
                placeholder="Nom de l'auteur"
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Fichier Audio <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50">
                <FileAudio className="w-4 h-4 text-memfa-violet" />
                Choisir un fichier
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
                />
              </label>
              <span className="text-xs text-slate-400 italic truncate">
                {uploading ? "Envoi en cours..." : fileName || (audio ? "Fichier actuel conservé" : "Aucun fichier choisi")}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5">Formats supportés : MP3, WAV. Taille max : 50 Mo.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Description courte</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Résumé..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet resize-none"
            />
          </div>
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
            disabled={saving || uploading}
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