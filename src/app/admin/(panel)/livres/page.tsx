"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Search, Download, BookOpen, User, FileText, Image as ImageIcon, Send,
} from "lucide-react";

type Livre = {
  id: string;
  titre: string;
  auteur: string | null;
  description: string | null;
  filePath: string;
  coverImage: string | null;
  downloadCount: number;
};

export default function LivresAdminPage() {
  const [items, setItems] = useState<Livre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Livre | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/livres");
      if (!res.ok) throw new Error("Impossible de charger les livres");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce livre ?")) return;
    await fetch(`/api/admin/livres/${id}`, { method: "DELETE" });
    void load();
  };

  const filtered = items.filter((l) =>
    l.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-memfa-charcoal">Gestion de la Bibliothèque</h1>
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
          <h2 className="font-semibold text-memfa-charcoal">Liste des Livres</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un livre..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-memfa-violet w-56"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm py-10 text-center">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((l) => (
              <div key={l.id} className="rounded-2xl border border-slate-100 overflow-hidden">
                <div className="relative h-48 bg-memfa-violet/5 flex items-center justify-center">
                  {l.coverImage ? (
                    <Image src={l.coverImage} alt={l.titre} fill unoptimized className="object-cover" />
                  ) : (
                    <BookOpen className="w-10 h-10 text-memfa-violet/30" />
                  )}
                  <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wide px-2 py-1 rounded bg-red-500 text-white">
                    PDF
                  </span>
                </div>
                <div className="p-4">
                  {l.auteur && (
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                      {l.auteur}
                    </p>
                  )}
                  <h3 className="text-sm font-semibold text-memfa-charcoal line-clamp-2 mb-3 min-h-10">
                    {l.titre}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <a
                      href={l.filePath}
                      target="_blank"
                      className="flex items-center gap-1.5 text-xs font-medium text-memfa-violet"
                    >
                      <Download className="w-3.5 h-3.5" /> Télécharger
                    </a>
                    <div className="flex gap-1">
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
              className="rounded-2xl border-2 border-dashed border-memfa-violet/30 bg-memfa-violet/5 flex flex-col items-center justify-center text-center p-8 min-h-70 hover:bg-memfa-violet/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-3 shadow-sm">
                <Plus className="w-5 h-5 text-memfa-violet" />
              </div>
              <p className="font-semibold text-sm text-memfa-charcoal">Ajouter un livre</p>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <LivreModal
          livre={editing}
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

function LivreModal({
  livre,
  onClose,
  onSaved,
}: {
  livre: Livre | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titre, setTitre] = useState(livre?.titre ?? "");
  const [auteur, setAuteur] = useState(livre?.auteur ?? "");
  const [description, setDescription] = useState(livre?.description ?? "");
  const [filePath, setFilePath] = useState(livre?.filePath ?? "");
  const [fileName, setFileName] = useState("");
  const [coverImage, setCoverImage] = useState(livre?.coverImage ?? "");
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [saving, setSaving] = useState(false);

  const handlePdfChange = async (file: File | null) => {
    if (!file) return;
    setFileName(file.name);
    setUploadingPdf(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload-pdf", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingPdf(false);
    if (data.url) setFilePath(data.url);
    else alert(data.error ?? "Erreur lors de l'upload");
  };

  const handleCoverChange = async (file: File | null) => {
    if (!file) return;
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploadingCover(false);
    if (data.url) setCoverImage(data.url);
    else alert(data.error ?? "Erreur lors de l'upload");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePath) {
      alert("Merci de choisir un fichier PDF.");
      return;
    }
    setSaving(true);

    const payload = { titre, auteur, description, filePath, coverImage };

    if (livre) {
      await fetch(`/api/admin/livres/${livre.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/admin/livres", {
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
        className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-memfa-violet/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-memfa-violet" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-memfa-charcoal">
                {livre ? "Modifier le livre" : "Nouveau Livre"}
              </h2>
              <p className="text-xs text-slate-400">Ajoutez un livre à la bibliothèque</p>
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
              placeholder="Ex: Devenir un homme solide"
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Auteur</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={auteur}
                  onChange={(e) => setAuteur(e.target.value)}
                  placeholder="Nom de l'auteur"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">
                Fichier PDF <span className="text-red-500">*</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50">
                <FileText className="w-4 h-4 text-memfa-violet shrink-0" />
                <span className="truncate">
                  {uploadingPdf ? "Envoi..." : fileName || (livre ? "Fichier conservé" : "Choisir un fichier")}
                </span>
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  disabled={uploadingPdf}
                  onChange={(e) => handlePdfChange(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
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

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              Couverture du livre <span className="text-slate-400 font-normal">(Optionnel)</span>
            </label>
            {coverImage ? (
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200 w-32">
                <Image src={coverImage} alt="" fill unoptimized className="object-cover" />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-memfa-violet/30 rounded-xl py-8 cursor-pointer hover:bg-memfa-violet/5 transition-colors">
                <ImageIcon className="w-5 h-5 text-memfa-violet" />
                <span className="text-sm text-slate-500">
                  {uploadingCover ? "Envoi en cours..." : "Cliquez ou glissez une image ici"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingCover}
                  onChange={(e) => handleCoverChange(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
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
            disabled={saving || uploadingPdf || uploadingCover}
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