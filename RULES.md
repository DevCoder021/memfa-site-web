# SECURITY FIRST — Règles obligatoires pour toute IA générant du code sur MEMFA

Ces règles existent pour éliminer à la SOURCE les 3 familles de vulnérabilités qui ont
fait chuter le score de sécurité à 62/100. Toute IA (Codex, Claude, Cursor, etc.) qui
ne respecte PAS ces règles dans le code qu'elle génère sur ce projet est en erreur.

---

## 🔴 RÈGLE 1 — Validation d'entrée schématique OBLIGATOIRE sur TOUTES les routes API

### Principe
Toute route `POST`, `PUT`, `PATCH`, `DELETE` sous `src/app/api/**/route.ts` DOIT :
1. Valider le `req.json()` (ou `formData`) **AVANT** de toucher à la base de données
2. Utiliser EXCLUSIVEMENT les helpers de `@/lib/api-validation` et les schémas de `@/lib/validation-schemas`
3. Ne JAMAIS faire de `if (!body.champ)` — c'est insuffisant

### Modèle obligatoire
```ts
import { parseBody } from "@/lib/api-validation";
import { MonSchemaCreate } from "@/lib/validation-schemas";

export async function POST(req: Request) {
  // 1. (si route admin) requireApiAdmin()
  // 2. PARSE OBLIGATOIRE
  const parsed = await parseBody(req, MonSchemaCreate);
  if (!parsed.ok) return parsed.response; // ← réponse 400 formatée
  const { champ1, champ2 } = parsed.data;  // ← données TYPÉES ET NETTOYÉES

  // 3. Maintenant on peut utiliser Prisma
  await prisma.tbl.create({ data: { champ1, champ2 } });
  ...
}
```

### Règles d'écriture d'un nouveau schéma Zod dans `validation-schemas.ts`
- Toujours définir une taille **max** sur toute string (empêche payload DoS)
- Email : `z.string().email()` — JAMAIS regex maison
- URL : `z.string().url()` — JAMAIS string sans validation
- Telephone : regex stricte ou max + regex digits
- Password : au minimum (8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)
- Champs libres (textarea, contenu article) : .trim() + max(5000-100000) selon usage
- Valeurs optionnelles : `.optional().or(z.literal("")).transform(v => v ? v : null)`
- Dates en entrée string : `.refine(v => !v || !isNaN(Date.parse(v)), "Date invalide")` — puis convertion

### Checklist avant de générer / modifier une route API
- [ ] Import de `parseBody` présent
- [ ] Import du schema Zod adapté présent (créer un nouveau schéma si besoin, ne PAS le mettre inline)
- [ ] `const parsed = await parseBody(req, Schema); if (!parsed.ok) return parsed.response`
- [ ] Plus aucun `const body = await req.json()` brut en dehors de `parseBody`
- [ ] Pas de conversion `new Date(champ)` directe sans vérification préalable

---

## 🔴 RÈGLE 2 — Fuites mémoire : useEffect + listeners + singletons stricts

### Principe
Toute IA qui écrit un `useEffect`, un singleton, ou attache un event listener DOIT
appliquer ces garde-fous — c'est la règle numéro 1 qui cause les fuites invisibles
en production.

### A — Tableau de dépendances useEffect (critique)
- **JAMAIS** mettre un `useMotionValue` (framer-motion), un `useRef`, ou une fonction
  crée dans le render dans les dépendances `[]` d'un useEffect. Vérifie systématiquement.
- Si tu utilises `setState` basé sur des events (scroll, mousemove…), passe PAR un
  `useRef` pour lire l'état sans retrigger l'effect :

  ❌ Interdit (retrigger chaque frame) :
  ```ts
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(window.scrollY > 500); }, [show]);
  ```

  ✅ Obligatoire :
  ```ts
  const showRef = useRef(false);
  const [, setShowState] = useState(false);
  useEffect(() => {
    const handler = () => {
      const s = window.scrollY > 500;
      if (s !== showRef.current) { showRef.current = s; setShowState(s); }
    };
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  ```

### B — Event listeners & cleanup complet
- Toute IA qui écrit `addEventListener` (window, document, ou un element ref) DOIT
  écrire le cleanup symétrique **avant** de fermer la parenthèse de `useEffect`.
- Toute animation GSAP DOIT être enveloppée dans un `gsap.context(() => {...}, ref)`
  avec `return () => ctx.revert()` en cleanup. Ne jamais écrire de `gsap.fromTo()`
  orphelin sans contexte.

### C — Singletons globaux (Prisma, adapters, clients)
- Tout client lourd (Prisma, Redis, SDK DB) doit être mis dans un `globalForTruc`
  sous `globalThis` en suivant EXACTEMENT le modèle de `src/lib/prisma.ts` :
  ```ts
  const globalFor = globalThis as unknown as { instance?: MonClient; adapter?: MonAdapter };
  function getAdapter() { if (!globalFor.adapter) globalFor.adapter = new Adapter(); return globalFor.adapter; }
  export const client = globalFor.instance ?? new Client({ adapter: getAdapter() });
  if (process.env.NODE_ENV !== "production") globalFor.instance = client;
  ```
- Créer `new MonAdapter()` ou `new PrismaPg()` DANS le corps du module = INTERDIT.

### D — Callbacks d'authentification JWT (NextAuth / Auth.js)
- Ne **JAMAIS** faire de requête Prisma/DB dans le callback `jwt({ token })`.
  Ce callback est exécuté à CHAQUE requête = surcharge DB + fuite progressive pool.
- Faire les vérifications existence compte seulement dans `requireApiAdmin()` /
  `requirePageAdmin()` déjà présents dans `src/lib/admin-auth.ts`.

### Checklist avant de générer un useEffect / client singleton
- [ ] Dépendances `[]` inspectées une à une — pas de motionValue / ref dedans
- [ ] `addEventListener` = `removeEventListener` symétrique dans le cleanup
- [ ] GSAP dans un `gsap.context(() => {...}, scope)` avec `ctx.revert()` en return
- [ ] Client singleton avec `globalThis` guard — pas de `new Xxx()` au module top-level

---

## 🔴 RÈGLE 3 — Configurations de sécurité : jamais de valeurs vides

### Principe
Ne JAMAIS laisser un fichier de configuration "vide" du type `{/* options here */}`.
Chaque nouveau déploiement / nouvelle route introduisant un paramètre de sécurité
doit être configuré explicitement.

### A — next.config.ts
- Les headers de sécurité sont centralisés dans `next.config.ts` via
  `async headers()`. Si une nouvelle route a besoin d'un en-tête différent, ajouter
  un item avec une source `source: '/chemin/specifique/*'` — **ne jamais retirer**
  les headers globaux `/\:path*`.
- `poweredByHeader: false` est obligatoire.

### B — Secrets variables d'environnement
- Toute variable `*_SECRET` / `DATABASE_URL` DOIT avoir un garde explicite :
  ```ts
  if (process.env.NODE_ENV === "production" && !process.env.TRUCS_SECRET) {
    throw new Error("TRUCS_SECRET obligatoire en production");
  }
  ```
- Ne **jamais** se contenter d'un `process.env.MACHIN ?? undefined` silencieux
  sur un secret en production.

### C — Routes proxy / téléchargement (fetch vers URL externe)
- Toute route qui fait `fetch(userControlledUrl)` (téléchargement, proxy) DOIT
  posséder une **whitelist** stricte :
  - Protocol `https:` only
  - Hostname match une regex fermée (ex: `/\.public\.blob\.vercel-storage\.com$/`)
  - Timeout explicite via `AbortSignal.timeout(ms)`
- Ne JAMAIS utiliser `filename` utilisateur brut dans l'en-tête Content-Disposition.
  Toujours sanitizer + encoder via `encodeURIComponent` + format RFC 5987
  `filename*=UTF-8''${safe}`.

### D — Cookies de session (NextAuth / Auth.js)
- Toujours configurer explicitement l'objet `cookies:` dans `authOptions` avec :
  - `httpOnly: true`
  - `sameSite: 'lax'` ou `'strict'`
  - `secure: process.env.NODE_ENV === 'production'`
  - Préfixe `__Secure-` sur le nom en production
- Toujours un `jwt: { maxAge: secondes }` explicite.

### Checklist avant de commit une nouvelle config
- [ ] Pas de valeur "à remplir plus tard" laissée en commentaire
- [ ] Chaque secret a son guard `throw new Error(...)` en prod
- [ ] Les routes proxy ont une whitelist hostname + timeout
- [ ] next.config.ts garde les headers globaux

---

## ✅ Checklist pré-soumission — L'IA doit répondre OUI à TOUTES
Avant de considérer une feature / un fix comme terminé sur ce projet :

| Catégorie | Question |
|-----------|----------|
| **Valider** | Toute route POST/PUT/PATCH parse le body via `parseBody(..., SchemaZod)` ? |
| **Valider** | Les nouveaux schemas Zod ont-ils tous un `.max(n)` sur les strings + formats (email/url/date) ? |
| **Mémoire** | Chaque useEffect avec listeners a-t-il son cleanup symétrique ? |
| **Mémoire** | Aucune dépendance `useMotionValue` / `useRef` dans un `[]` de useEffect ? |
| **Mémoire** | GSAP est-il dans un `gsap.context` qui `.revert()` au cleanup ? |
| **Mémoire** | Pas de `new PrismaPg()` / client lourd au top-level d'un module ? |
| **Mémoire** | Le callback `jwt()` de NextAuth ne fait-il AUCUN appel Prisma ? |
| **Config** | Y a-t-il un `throw new Error(...)` pour chaque secret obligatoire en prod ? |
| **Config** | Les cookies session ont-ils `httpOnly + secure + sameSite + maxAge` explicites ? |
| **Config** | next.config.ts garde-t-il ses 8 headers de sécurité globaux ? |

Si l'IA ne peut pas répondre OUI à ces 10 questions, son travail N'EST PAS TERMINÉ.
