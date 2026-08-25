"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Newspaper,
  Radio,
  HandHeart,
  User,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

const features = [
  { icon: Newspaper, label: "Actualités" },
  { icon: Radio, label: "Live & audios" },
  { icon: HandHeart, label: "Dons" },
];

// Courbe franche façon traction de rideau
const CURTAIN_EASE = [0.76, 0, 0.24, 1] as const;

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", { username, password, redirect: false });

    if (res?.error) {
      setLoading(false);
      setError("Identifiants incorrects.");
      return;
    }

    // Connexion réussie : on déclenche l'ouverture du rideau,
    // la navigation se fait à la fin de l'animation (voir onAnimationComplete).
    setLoading(false);
    setSuccess(true);
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-[var(--color-memfa-violet-soft)]">
      {/* Fond neutre révélé derrière les deux panneaux — le vrai dashboard s'affiche après la navigation */}
      <div className="fixed inset-0 z-0 bg-[var(--color-memfa-violet-soft)]" />

      {/* Panneau gauche — marque, tout centré */}
      <motion.div
        animate={{ x: success ? "-100%" : "0%" }}
        transition={{ duration: 0.9, ease: CURTAIN_EASE }}
        onAnimationComplete={() => {
          if (success) router.push("/admin/dashboard");
        }}
        className="hidden md:flex w-1/2 min-h-screen bg-[var(--color-memfa-violet-deep)] flex-col items-center justify-center text-center px-16 py-16 relative overflow-hidden z-10"
      >
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-[var(--color-memfa-or)]/10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative flex flex-col items-center"
        >
          <Image src="/assets/logo.png" alt="MEMFA" width={120} height={120} className="mb-6" />
          <h1 className="text-white font-bold text-4xl mb-3">MEMFA</h1>
          <p className="text-white/70 text-base mb-10 max-w-sm">
            Mission Évangélique Maranatha Foi et Action — espace d&apos;administration du site.
          </p>

          {/* Ligne horizontale : icône au-dessus, label en dessous, 3 colonnes */}
          <div className="flex items-start justify-center gap-8">
            {features.map(({ icon: Icon, label }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="flex flex-col items-center gap-2 w-20"
              >
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs font-medium text-white/90">{label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Panneau droit — formulaire */}
      <motion.div
        animate={{ x: success ? "100%" : "0%" }}
        transition={{ duration: 0.9, ease: CURTAIN_EASE }}
        className="flex-1 min-h-screen flex items-center justify-center bg-[var(--background)] px-8 py-16 md:px-12 z-10"
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-[var(--color-memfa-charcoal)] mb-1">
            Bienvenue
          </h2>
          <p className="text-slate-400 text-sm mb-8">Connectez-vous à l&apos;espace admin</p>

          <label className="block text-slate-500 text-sm mb-1.5">Nom d&apos;utilisateur</label>
          <div className="relative mb-4">
            <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border-2 border-slate-300 text-[var(--color-memfa-charcoal)] placeholder-slate-400 outline-none transition-all focus:border-[var(--color-memfa-violet)] focus:ring-4 focus:ring-[var(--color-memfa-violet)]/10"
              placeholder="admin"
              required
            />
          </div>

          <label className="block text-slate-500 text-sm mb-1.5">Mot de passe</label>
          <div className="relative mb-4">
            <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-11 py-3 rounded-xl bg-white border-2 border-slate-300 text-[var(--color-memfa-charcoal)] placeholder-slate-400 outline-none transition-all focus:border-[var(--color-memfa-violet)] focus:ring-4 focus:ring-[var(--color-memfa-violet)]/10"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[var(--color-memfa-charcoal)] transition-colors"
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[var(--color-memfa-violet)] focus:ring-[var(--color-memfa-violet)]/30"
              />
              Se souvenir de moi
            </label>
            <a
              href="/admin/mot-de-passe-oublie"
              className="text-sm font-medium text-[var(--color-memfa-violet)] hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-red-500 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={loading || success}
            whileHover={{ scale: loading || success ? 1 : 1.02 }}
            whileTap={{ scale: loading || success ? 1 : 0.97 }}
            className="w-full py-3 rounded-full font-semibold text-white bg-[var(--color-memfa-violet)] shadow-lg shadow-[var(--color-memfa-violet)]/25 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Connexion...
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Se connecter
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}