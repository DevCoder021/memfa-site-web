"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Search, ImagePlus, Bold, Italic,
  Underline as UnderlineIcon, List, ListOrdered, AlignLeft, AlignCenter,
  AlignRight, Undo2, Redo2, Link as LinkIcon, Eraser,
  Quote, Send, FileText,
} from "lucide-react";

type Actualite = {
  id: string;
  titre: string;
  contenu: string;
  imageUrl: string | null;
  dateEvenement: string | null;
  isPublished: boolean;
  datePublication: string;
};

export default function ActualitesAdminPage() {
  const [items, setItems] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Actualite | null>(null);
  const [showModal, setShowModal] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/actualites");
      if (!res.ok) {
        throw new Error("Impossible de charger les actualités");
      }
      const data = await res.json();
      setItems(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette actualité ?")) return;
    await fetch(`/api/admin/actualites/${id}`, { method: "DELETE" });
    void load();
  };

  const filtered = items.filter((a) =>
    a.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-memfa-charcoal">
          Gestion des Actualités
        </h1>
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
          <h2 className="font-semibold text-memfa-charcoal">Liste des Actualités</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm outline-none focus:border-memfa-violet w-56"
            />
          </div>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm py-10 text-center">Chargement...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((a) => (
              <div key={a.id} className="rounded-2xl border border-slate-100 overflow-hidden group">
                <div className="relative h-40 bg-slate-100">
                  {a.imageUrl ? (
                    <Image src={a.imageUrl} alt={a.titre} fill unoptimized className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <FileText className="w-8 h-8" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-full bg-memfa-violet/10 text-memfa-violet backdrop-blur">
                    ARTICLE
                  </span>
                </div>
                <div className="p-4">
                  <p className="text-xs text-memfa-violet font-medium mb-1">
                    {new Date(a.datePublication).toLocaleDateString("fr-FR", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </p>
                  <h3 className="text-sm font-semibold text-memfa-charcoal line-clamp-2 mb-3 min-h-10">
                    {a.titre}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <a
                      href="/#actualites"
                      target="_blank"
                      className="text-xs font-medium text-memfa-violet"
                    >
                      Voir l&apos;article →
                    </a>
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

            {/* Carte "créer un brouillon" */}
            <button
              onClick={() => {
                setEditing(null);
                setShowModal(true);
              }}
              className="rounded-2xl border-2 border-dashed border-memfa-violet/30 bg-memfa-violet/5 flex flex-col items-center justify-center text-center p-8 min-h-70 hover:bg-memfa-violet/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <ImagePlus className="w-5 h-5 text-memfa-violet" />
              </div>
              <p className="font-semibold text-sm text-memfa-charcoal mb-1">
                Créer un brouillon
              </p>
              <p className="text-xs text-slate-400">
                Commencez à rédiger une nouvelle actualité pour la plateforme.
              </p>
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <ActualiteModal
          actualite={editing}
          onClose={() => setShowModal(false)}
          onSaved={() => {
            setShowModal(false);
            load();
          }}
        />
      )}
    </div>
  );
}

function ActualiteModal({
  actualite,
  onClose,
  onSaved,
}: {
  actualite: Actualite | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [titre, setTitre] = useState(actualite?.titre ?? "");
  const [dateEvenement, setDateEvenement] = useState(actualite?.dateEvenement?.slice(0, 10) ?? "");
  const [imageUrl, setImageUrl] = useState(actualite?.imageUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleImageChange = async (file: File | null) => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.url) setImageUrl(data.url);
    else alert(data.error ?? "Erreur lors de l'upload");
  };

  const format = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = window.prompt("URL du lien");
    if (url?.trim()) format("createLink", url.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const contenu = editorRef.current?.innerHTML ?? "";
    if (!contenu.replace(/<[^>]*>/g, "").trim()) {
      setError("Le contenu de l’article est requis.");
      setSaving(false);
      return;
    }
    const payload = { titre, contenu, imageUrl, dateEvenement: dateEvenement || null };

    try {
      const res = await fetch(
        actualite ? `/api/admin/actualites/${actualite.id}` : "/api/admin/actualites",
        {
          method: actualite ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(actualite ? { ...payload, isPublished: actualite.isPublished } : payload),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? "Impossible d’enregistrer l’actualité.");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Impossible d’enregistrer l’actualité.");
      setSaving(false);
      return;
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
              <FileText className="w-4 h-4 text-memfa-violet" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-memfa-charcoal">
                {actualite ? "Modifier l'actualité" : "Nouvelle Actualité"}
              </h2>
              <p className="text-xs text-slate-400">Rédigez et illustrez votre article.</p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
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
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Date de l&apos;activité</label>
            <input
              type="date"
              value={dateEvenement}
              onChange={(e) => setDateEvenement(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
            />
            <p className="text-xs text-slate-400 mt-1">Si vide, la date de publication sera utilisée par défaut.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Contenu de l&apos;article</label>
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 bg-slate-50 border-b border-slate-200">
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("undo")} className="p-1.5 rounded hover:bg-white" title="Annuler">
                  <Undo2 className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("redo")} className="p-1.5 rounded hover:bg-white" title="Rétablir">
                  <Redo2 className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <select
                  defaultValue="p"
                  onChange={(e) => format("formatBlock", e.target.value)}
                  className="h-7 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 outline-none"
                  aria-label="Style du texte"
                >
                  <option value="p">Paragraphe</option>
                  <option value="h1">Titre 1</option>
                  <option value="h2">Titre 2</option>
                  <option value="h3">Titre 3</option>
                </select>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("bold")} className="p-1.5 rounded hover:bg-white" title="Gras">
                  <Bold className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("italic")} className="p-1.5 rounded hover:bg-white" title="Italique">
                  <Italic className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("underline")} className="p-1.5 rounded hover:bg-white" title="Souligné">
                  <UnderlineIcon className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("justifyLeft")} className="p-1.5 rounded hover:bg-white" title="Aligner à gauche">
                  <AlignLeft className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("justifyCenter")} className="p-1.5 rounded hover:bg-white" title="Centrer">
                  <AlignCenter className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("justifyRight")} className="p-1.5 rounded hover:bg-white" title="Aligner à droite">
                  <AlignRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("insertUnorderedList")} className="p-1.5 rounded hover:bg-white" title="Liste à puces">
                  <List className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("insertOrderedList")} className="p-1.5 rounded hover:bg-white" title="Liste numérotée">
                  <ListOrdered className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("formatBlock", "blockquote")} className="p-1.5 rounded hover:bg-white" title="Citation">
                  <Quote className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={insertLink} className="p-1.5 rounded hover:bg-white" title="Insérer un lien">
                  <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => format("removeFormat")} className="p-1.5 rounded hover:bg-white" title="Effacer le formatage">
                  <Eraser className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: actualite?.contenu ?? "" }}
                className="min-h-35 px-4 py-3 outline-none text-sm text-memfa-charcoal italic-placeholder"
                data-placeholder="Rédigez votre message inspirant ici..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Image de couverture</label>
            {imageUrl ? (
              <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200">
                <Image src={imageUrl} alt="" fill unoptimized className="object-cover" />
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-memfa-violet/30 rounded-xl py-8 cursor-pointer hover:bg-memfa-violet/5 transition-colors">
                <ImagePlus className="w-5 h-5 text-memfa-violet" />
                <span className="text-sm text-slate-500">
                  {uploading ? "Envoi en cours..." : "Cliquez ou glissez une image ici"}
                </span>
                <span className="text-xs text-slate-400">PNG, JPG, WEBP (Max 5 Mo)</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
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