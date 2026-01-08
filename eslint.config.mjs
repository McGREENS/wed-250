import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Your Next.js configs (keep the defaults + overrides)
  ...nextVitals,
  ...nextTs,

  // Global ignores: Keep Next.js defaults + add shadcn/ui folder
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "app/components/ui/**",  // ← This silences all linting/TS errors in shadcn components
  ]),
]);

export default eslintConfig;