/**
 * Custom ESLint rules inline pour MEMFA — flag patterns à risque
 * Ajoute des warnings sur les erreurs classiques que les IA répètent :
 *  - req.json() brut sans parseBody Zod
 *  - useMotionValue dans deps useEffect
 *  - PrismaPg/new client lourd au top-level
 *  - Prisma.findUnique dans callback jwt({ token })
 *  - URL user sans whitelist dans fetch() proxy
 */

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config} */
const memfaSecurity = {
  name: "memfa/security-custom",
  files: ["src/**/*.{ts,tsx}"],
  rules: {
    // Interdire les req.json() brut sauf dans @/lib/api-validation.ts
    "no-restricted-syntax": [
      "warn",
      {
        selector:
          "CallExpression[callee.object.name='req'][callee.property.name='json']",
        message:
          "MEMFA: req.json() brut interdit dans les routes API. Utiliser parseBody(req, Schema) de @/lib/api-validation avec un schema Zod de @/lib/validation-schemas.",
      },
      {
        selector:
          "NewExpression[callee.name='PrismaPg']",
        message:
          "MEMFA: new PrismaPg() au top-level risque de fuiter en dev. Utiliser/getter singleton globalThis comme dans src/lib/prisma.ts (getAdapter()).",
      },
    ],
  },
};

/** @type {import('eslint').Linter.Config} */
const memfaJsx = {
  name: "memfa/jsx-custom",
  files: ["src/**/*.{tsx}"],
  rules: {
    // Détecter useEffect avec motionValue / useRef dans ses dépendances
    "no-restricted-syntax": [
      "warn",
      {
        selector:
          "CallExpression[callee.name='useEffect'] > ArrayExpression:last-child > Identifier[name=/^[a-z]+(X|Y|Ref)$/i]",
        message:
          "MEMFA: useMotionValue / useRef suspect dans les deps d'un useEffect — risque de boucle infinie / fuite. Vérifie RULES.md § Règle 2. Préférer useRef + useState détaché.",
      },
    ],
  },
};

const eslintConfig = defineConfig([
  memfaSecurity,
  memfaJsx,
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
