"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { User, Mail, Lock, Save, KeyRound, CheckCircle2 } from "lucide-react";

export default function ParametresPage() {
  const { data: session } = useSession();

  return <ParametresForm key={session?.user?.id ?? "pending"} session={session} />;
}

function ParametresForm({ session }: { session: Session | null }) {
  const [username, setUsername] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email }),
    });
    const data = await res.json();
    setSavingProfile(false);

    if (!res.ok) {
      setProfileMsg({ type: "error", text: data.error ?? "Une erreur est survenue" });
    } else {
      setProfileMsg({ type: "success", text: "Profil mis à jour. Reconnecte-toi pour que le nom s'affiche partout." });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "Les deux mots de passe ne correspondent pas" });
      return;
    }

    setSavingPassword(true);
    const res = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    setSavingPassword(false);

    if (!res.ok) {
      setPasswordMsg({ type: "error", text: data.error ?? "Une erreur est survenue" });
    } else {
      setPasswordMsg({ type: "success", text: "Mot de passe mis à jour avec succès." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-memfa-charcoal mb-1">Paramètres du Système</h1>
      <p className="text-slate-400 text-sm mb-6">Gérez les informations de ton compte administrateur.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Profil administrateur */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
          <h2 className="font-semibold text-memfa-charcoal mb-4 pb-4 border-b border-slate-50">
            Profil Administrateur
          </h2>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nom d&apos;utilisateur</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Email de contact</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            {profileMsg && (
              <p className={`text-sm flex items-center gap-1.5 ${profileMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                {profileMsg.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                {profileMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-memfa-violet text-white text-sm font-semibold disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {savingProfile ? "Enregistrement..." : "Enregistrer le profil"}
            </button>
          </form>
        </div>

        {/* Sécurité et mot de passe */}
        <div className="rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6">
          <h2 className="font-semibold text-memfa-charcoal mb-4 pb-4 border-b border-slate-50">
            Sécurité et Mot de Passe
          </h2>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Mot de passe actuel</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Nouveau mot de passe</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Confirmer le mot de passe</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-memfa-violet"
                />
              </div>
            </div>

            {passwordMsg && (
              <p className={`text-sm flex items-center gap-1.5 ${passwordMsg.type === "success" ? "text-emerald-600" : "text-red-500"}`}>
                {passwordMsg.type === "success" && <CheckCircle2 className="w-4 h-4" />}
                {passwordMsg.text}
              </p>
            )}

            <button
              type="submit"
              disabled={savingPassword}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-memfa-violet text-white text-sm font-semibold disabled:opacity-60"
            >
              <KeyRound className="w-4 h-4" />
              {savingPassword ? "Mise à jour..." : "Mettre à jour le mot de passe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}