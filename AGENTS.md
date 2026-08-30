<!-- BEGIN:memfa-security-rules — LES LIRE AVANT TOUTE GÉNÉRATION DE CODE SUR CE PROJET -->

# ⚠ RÈGLES DE SÉCURITÉ OBLIGATOIRES — MEMFA PROJECT

Avant d'écrire **une seule ligne** sur ce projet, TOUTE IA (Codex, Claude, Cursor, etc.)
DOIT avoir lu et appliquer `RULES.md` à la racine. Ce fichier définit 3 familles de
règles non négociables qui ont déjà coûté 38% de score de sécurité sur le projet.

## Résumé ultra-court — 3 règles cardinales à ne JAMAIS violer

### 🔴 1. Validation Zod OBLIGATOIRE sur TOUTE route POST/PUT/PATCH API
- Importer `parseBody` depuis `@/lib/api-validation`
- Importer un schema depuis `@/lib/validation-schemas` (en créer un nouveau si manque,
  ne JAMAIS faire de validation ad-hoc `if (!body.champ)`)
- Pattern obligatoire : `const parsed = await parseBody(req, MonSchema); if (!parsed.ok) return parsed.response`
- Interdit formel : `const body = await req.json()` + `if (!body.x)` à la place

### 🔴 2. Fuites mémoire — useEffect + singletons
- Aucun `useMotionValue` / `useRef` dans le tableau `[, deps]` d'un useEffect.
- Toute écriture `addEventListener` → cleanup symétrique écrit avant de fermer l'effect.
- Toute animation GSAP → wrapper dans `gsap.context(() => {...}, ref)` + `return () => ctx.revert()`.
- Pas de `new PrismaPg()` / client lourd au top-level d'un module → singleton `globalThis`
  (modèle dans `src/lib/prisma.ts`)
- Interdit formel : requête Prisma dans le callback `jwt()` de NextAuth.

### 🔴 3. Configs jamais vides, jamais permissives
- next.config.ts : conserver les 8 headers de sécurité globaux `/\:path*`
- Secrets obligatoires en prod : guard `throw new Error("SECRET obligatoire")` si absent
- Route proxy/fetch avec URL user : whitelist hostname + https only + `AbortSignal.timeout`
- Cookies NextAuth : `httpOnly + sameSite=lax + secure=(NODE_ENV==='production') + maxAge`

## Checklist finale — 10 OBLIGATOIRES avant de dire "c'est fini"

- [ ] 1. Toute nouvelle route POST/PUT/PATCH parse avec `parseBody` + un schema Zod
- [ ] 2. Chaque schema nouveau a `.max()` sur ses strings et formats (email/url/date)
- [ ] 3. Chaque useEffect avec listener a son cleanup symétrique
- [ ] 4. Aucun `useMotionValue` / `useRef` dans des deps de useEffect
- [ ] 5. GSAP orphelin ? → Non, tout dans `gsap.context` qui `.revert()`
- [ ] 6. Pas de `new ClientLourd()` au top-level d'un module
- [ ] 7. Callback `jwt()` NextAuth sans aucun appel Prisma/DB
- [ ] 8. Guard `throw new Error` sur chaque nouveau secret en production
- [ ] 9. Cookies session : httpOnly + secure(prod) + sameSite + maxAge explicites
- [ ] 10. Les headers de sécurité dans next.config.ts sont intacts

Si une réponse à 1..10 est "non" → le travail n'est PAS terminé. Corriger avant.

<!-- END:memfa-security-rules -->

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:post-generation-checks — LANCER SYSTÉMATIQUEMENT APRÈS TOUTE MODIFICATION -->

# Vérifications post-génération

Après chaque lot de modifications sur ce projet, l'IA DOIT exécuter DANS CET ORDRE :

1. **TypeScript** : `npx tsc --noEmit` — 0 erreur → OK
2. **ESLint** : `npm run lint` — les seuls warnings tolérés sont ceux existants AVANT
   la modification (img > Image, no-unescaped-entities sur pages légales, etc.)
3. **Diagnostics IDE** : Appel `GetDiagnostics` — tableau vide → OK

Si l'une des 3 étapes produit une NOUVELLE erreur liée aux modifs → corriger
immédiatement, ne PAS attendre que l'utilisateur la signale.

<!-- END:post-generation-checks -->
