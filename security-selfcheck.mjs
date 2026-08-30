#!/usr/bin/env node
/**
 * security-selfcheck.mjs
 *
 * Script autonome (pas de dépendances) qui balaye le code MEMFA et détecte
 * les régressions sur les 3 familles de vulnérabilités corrigées le 30/08/2026 :
 *   1. INPUT VALIDATION  — routes API avec req.json() brut sans Zod
 *   2. MEMORY LEAKS      — useEffect(…, [useMotionValue]) + new PrismaPg() au top-level, prisma dans jwt()
 *   3. SECURITY CONFIG   — next.config sans security headers, secret sans guard throw
 *
 * Usage :
 *   node security-selfcheck.mjs        # check complet
 *   node security-selfcheck.mjs -q     # mode quiet: exit code seulement
 *
 * Codes de sortie :
 *   0 = tout vert
 *   1 = au moins une régression détectée
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, ".");
const SRC = resolve(ROOT, "src");
const QUIET = process.argv.includes("-q") || process.argv.includes("--quiet");

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const s = statSync(full);
    if (s.isDirectory() && !["node_modules", ".next", ".git", "out"].includes(entry)) {
      walk(full, acc);
    } else if (s.isFile() && /\.(ts|tsx|mjs|js)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

function relPath(p) {
  return relative(ROOT, p).replaceAll("\\", "/");
}

let found = 0;
const issues = [];
function flag(category, file, line, msg) {
  found++;
  issues.push({ category, file: relPath(file), line, msg });
  if (!QUIET) {
    const catEmoji =
      category === "INPUT"   ? "🛡" :
      category === "MEMORY"  ? "🧠" :
      category === "CONFIG"  ? "⚙"  : "❓";
    console.error(`  ${catEmoji} [${category}] ${relPath(file)}:${line} — ${msg}`);
  }
}

// ————————————————————————————————————————————————————————————————————————————
// 1. INPUT VALIDATION
// ————————————————————————————————————————————————————————————————————————————
if (!QUIET) console.log("\n🔎 1. Input validation — routes API sans Zod parseBody…");

const ROUTE_RE = /src[\\/]app[\\/]api[\\/].*route\.ts$/;
const files = walk(SRC);
const apiRoutes = files.filter((f) => ROUTE_RE.test(f.replaceAll("\\", "/")));

for (const f of apiRoutes) {
  const content = readFileSync(f, "utf8");
  const lines = content.split("\n");
  let parseBodyFound = false;
  for (const l of lines) {
    if (/parseBody\s*\(/.test(l)) { parseBodyFound = true; break; }
  }
  // Routes qui ont un POST/PUT/PATCH mais pas parseBody -> flag
  const methodMatch = content.match(/export\s+async\s+function\s+(POST|PUT|PATCH)\s*\(/);
  if (methodMatch && !parseBodyFound) {
    // Exceptions : upload routes (utilisent formData pas json) et certaines GET-only
    const rel = relPath(f);
    if (!/upload/.test(rel)) {
      const line = lines.findIndex((l) => l.includes(methodMatch[0])) + 1;
      flag("INPUT", f, line, `Route ${methodMatch[1]} sans parseBody() Zod. Voir RULES.md § Règle 1.`);
    }
  }
}

// Validation-schemas.ts doit exister
const SCHEMAS_FILE = resolve(SRC, "lib/validation-schemas.ts");
if (!statSync(SCHEMAS_FILE).isFile()) {
  flag("INPUT", SCHEMAS_FILE, 1, "src/lib/validation-schemas.ts a disparu !");
}

// ————————————————————————————————————————————————————————————————————————————
// 2. MEMORY LEAKS
// ————————————————————————————————————————————————————————————————————————————
if (!QUIET) console.log("\n🔎 2. Memory leaks — useEffect + singletons…");

for (const f of files) {
  const content = readFileSync(f, "utf8");
  const lines = content.split("\n");

  // 2a. useEffect deps qui contient un useMotionValue (pattern: }, [mouseX, mouseY]))
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const m = l.match(/\},\s*\[\s*([a-zA-Z0-9_$]+,\s*[a-zA-Z0-9_$]+)\s*\]/);
    if (m) {
      const deps = m[1];
      if (/(^|[^a-zA-Z])(mouseX|mouseY|scrollX|scrollY|progressX|progressY)([^a-zA-Z]|$)/.test(deps)) {
        flag("MEMORY", f, i + 1, `useEffect avec useMotionValue [${deps}] dans ses deps — boucle infinie probable. RULES.md §R2.A`);
      }
    }
  }

  // 2b. new PrismaPg() ou new PrismaClient() hors singleton
  if (f.endsWith("prisma.ts")) {
    if (!/globalThis/.test(content)) {
      flag("MEMORY", f, 1, "PrismaClient n'utilise plus le singleton globalThis → fuite par HMR. RULES.md §R2.C");
    }
  } else {
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/^\s*(const|let|var)\s+\w+\s*=\s*new\s+(PrismaPg|PrismaClient|pg\.Pool|Redis|ioredis)\b/.test(l)) {
        flag("MEMORY", f, i + 1, "Client lourd instancié au top-level hors prisma.ts singleton. RULES.md §R2.C");
      }
    }
  }

  // 2c. Prisma.admin.findUnique DANS un callback jwt({ token }) → interdit formel
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (/prisma\.\w+\.findUnique\(/.test(l)) {
      // Regarder 40 lignes avant pour voir si on est dans un jwt({ token }) callback
      const blockStart = Math.max(0, i - 40);
      const block = lines.slice(blockStart, i + 1).join("\n");
      if (/async\s+jwt\s*\(\s*\{\s*token[^}]*\}\s*\)/.test(block)) {
        flag("MEMORY", f, i + 1, "Requête Prisma dans callback jwt({ token }) — surcharge DB massive. RULES.md §R2.D");
      }
    }
  }
}

// ————————————————————————————————————————————————————————————————————————————
// 3. SECURITY CONFIG
// ————————————————————————————————————————————————————————————————————————————
if (!QUIET) console.log("\n🔎 3. Security config — headers, secrets, cookies…");

// 3a. next.config.ts doit contenir nos 8 headers
const NEXT_CFG = resolve(ROOT, "next.config.ts");
if (statSync(NEXT_CFG).isFile()) {
  const cfg = readFileSync(NEXT_CFG, "utf8");
  const needed = [
    { re: /Strict-Transport-Security/, name: "HSTS (Strict-Transport-Security)" },
    { re: /X-Frame-Options/, name: "X-Frame-Options" },
    { re: /X-Content-Type-Options/, name: "X-Content-Type-Options (nosniff)" },
    { re: /Content-Security-Policy/, name: "Content-Security-Policy" },
    { re: /Referrer-Policy/, name: "Referrer-Policy" },
    { re: /Permissions-Policy/, name: "Permissions-Policy" },
    { re: /poweredByHeader\s*:\s*false/, name: "poweredByHeader: false" },
  ];
  for (const { re, name } of needed) {
    if (!re.test(cfg)) {
      flag("CONFIG", NEXT_CFG, 1, `Header / option manquant dans next.config.ts : ${name}. RULES.md §R3.A`);
    }
  }
} else {
  flag("CONFIG", NEXT_CFG, 1, "next.config.ts introuvable !");
}

// 3b. auth.ts doit avoir un guard throw sur secret + cookies config + jwt maxAge
const AUTH_FILE = resolve(SRC, "lib/auth.ts");
if (statSync(AUTH_FILE).isFile()) {
  const auth = readFileSync(AUTH_FILE, "utf8");
  if (!/throw\s+new\s+Error\s*\(\s*[`'"].*SECRET/.test(auth)) {
    flag("CONFIG", AUTH_FILE, 1, "Pas de guard throw new Error(…SECRET…) en production. RULES.md §R3.B");
  }
  if (!/cookies\s*:/.test(auth)) {
    flag("CONFIG", AUTH_FILE, 1, "Pas d'objet cookies: explicite dans authOptions. RULES.md §R3.D");
  }
  if (!/maxAge\s*:\s*\d+/.test(auth)) {
    flag("CONFIG", AUTH_FILE, 1, "Pas de jwt { maxAge:… } explicite dans authOptions. RULES.md §R3.D");
  }
  if (!/secure\s*:\s*process\.env\.NODE_ENV\s*===\s*["']production["']/.test(auth)) {
    flag("CONFIG", AUTH_FILE, 1, "Cookie sans secure=(NODE_ENV==='production'). RULES.md §R3.D");
  }
} else {
  flag("CONFIG", AUTH_FILE, 1, "src/lib/auth.ts introuvable !");
}

// 3c. download route doit avoir une whitelist ALLOWED_HOSTNAME_PATTERNS
const DL_ROUTE = resolve(SRC, "app/api/download/route.ts");
if (statSync(DL_ROUTE).isFile()) {
  const dl = readFileSync(DL_ROUTE, "utf8");
  if (!/ALLOWED_HOSTNAME_PATTERNS/.test(dl)) {
    flag("CONFIG", DL_ROUTE, 1, "Route /api/download sans whitelist ALLOWED_HOSTNAME_PATTERNS → SSRF possible. RULES.md §R3.C");
  }
  if (!/AbortSignal\.timeout/.test(dl)) {
    flag("CONFIG", DL_ROUTE, 1, "Route /api/download sans AbortSignal.timeout() → fetch infini possible. RULES.md §R3.C");
  }
  if (!/filename\*=UTF-8''/.test(dl)) {
    flag("CONFIG", DL_ROUTE, 1, "Content-Disposition sans filename*=UTF-8'' → header injection possible. RULES.md §R3.C");
  }
}

// ————————————————————————————————————————————————————————————————————————————
// Synthèse
// ————————————————————————————————————————————————————————————————————————————
if (!QUIET) {
  console.log("\n" + "=".repeat(72));
  if (found === 0) {
    console.log("✅ SECURITY SELFCHECK — 0 régression détectée. RULES.md respecté 👍");
    console.log("   Tu peux commit tranquille mon ami.");
  } else {
    console.log(`⚠️  SECURITY SELFCHECK — ${found} régression(s) détectée(s).`);
    console.log("   Corriger avant de commit, ou lire RULES.md pour comprendre.");
    if (QUIET) {
      // En mode quiet quand même afficher la liste
      for (const i of issues) {
        console.error(`  - [${i.category}] ${i.file}:${i.line} — ${i.msg}`);
      }
    }
  }
  console.log("=".repeat(72));
}

process.exit(found === 0 ? 0 : 1);
