"use client";

import { useCallback, useEffect, useState } from "react";
import { Mail, RefreshCw, Trash2, X, Send, CheckCircle2 } from "lucide-react";

type Message = {
  id: string;
  nom: string;
  email: string;
  telephone: string | null;
  message: string;
  reponse: string | null;
  reponduLe: string | null;
  reponduPar: string | null;
  isRead: boolean;
  createdAt: string;
};

export default function MessagesAdminPage() {
  const [items, setItems] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Message | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (!res.ok) throw new Error("Impossible de charger les messages");
      setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openMessage = async (m: Message) => {
    setSelected(m);
    if (!m.isRead) {
      await fetch(`/api/admin/messages/${m.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      void load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setSelected(null);
    void load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-memfa-charcoal">Gestion des Messages</h1>
        <button
          onClick={() => void load()}
          className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <p className="text-slate-400 text-sm mb-6">Consultez et répondez aux messages reçus.</p>

      {loading ? (
        <p className="text-slate-400 text-sm py-10 text-center">Chargement...</p>
      ) : items.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-16 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-memfa-violet/10 flex items-center justify-center mb-5">
            <Mail className="w-7 h-7 text-memfa-violet" />
          </div>
          <h2 className="font-bold text-lg text-memfa-charcoal mb-1">Boîte de réception vide</h2>
          <p className="text-slate-400 text-sm">Aucun message reçu pour le moment.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] divide-y divide-slate-50">
          {items.map((m) => (
            <button
              key={m.id}
              onClick={() => void openMessage(m)}
              className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-50/60 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-memfa-violet/10 text-memfa-violet flex items-center justify-center text-xs font-semibold shrink-0">
                {m.nom.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm ${m.isRead ? "font-medium text-slate-600" : "font-bold text-memfa-charcoal"}`}>
                    {m.nom}
                  </p>
                  {m.reponse && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Répondu
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{m.message}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400">
                  {new Date(m.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                </span>
                {!m.isRead && <span className="w-2 h-2 rounded-full bg-memfa-violet" />}
              </div>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <MessageModal
          message={selected}
          onClose={() => setSelected(null)}
          onDelete={() => handleDelete(selected.id)}
          onReplied={() => {
            setSelected(null);
            void load();
          }}
        />
      )}
    </div>
  );
}

function MessageModal({
  message,
  onClose,
  onDelete,
  onReplied,
}: {
  message: Message;
  onClose: () => void;
  onDelete: () => void;
  onReplied: () => void;
}) {
  const [reponse, setReponse] = useState(message.reponse ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reponse.trim()) return;
    setSaving(true);
    await fetch(`/api/admin/messages/${message.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reponse }),
    });
    setSaving(false);
    onReplied();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-memfa-violet/10 text-memfa-violet flex items-center justify-center text-sm font-semibold">
              {message.nom.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="font-bold text-lg text-memfa-charcoal">{message.nom}</h2>
              <p className="text-xs text-slate-400">
                {message.email}{message.telephone ? ` · ${message.telephone}` : ""}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-sm text-memfa-charcoal whitespace-pre-line">{message.message}</p>
            <p className="text-xs text-slate-400 mt-2">
              {new Date(message.createdAt).toLocaleString("fr-FR")}
            </p>
          </div>

          {message.reponse && (
            <div className="bg-memfa-violet/5 rounded-xl p-4 border border-memfa-violet/10">
              <p className="text-[10px] font-semibold text-memfa-violet uppercase tracking-wide mb-1">
                Réponse envoyée {message.reponduPar ? `par ${message.reponduPar}` : ""}
              </p>
              <p className="text-sm text-memfa-charcoal whitespace-pre-line">{message.reponse}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-slate-600 mb-1.5">
              {message.reponse ? "Modifier la réponse" : "Votre réponse"}
            </label>
            <textarea
              value={reponse}
              onChange={(e) => setReponse(e.target.value)}
              placeholder="Rédigez votre réponse..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet resize-none mb-4"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" /> Supprimer
              </button>
              <button
                type="submit"
                disabled={saving || !reponse.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-memfa-violet text-white text-sm font-semibold disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {saving ? "Enregistrement..." : "Enregistrer la réponse"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}