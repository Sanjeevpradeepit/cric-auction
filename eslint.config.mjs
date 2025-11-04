import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
     'react/no-unescaped-entities': 'warn', // Warn on unescaped characters like ' in JSX
    'jsx-a11y/alt-text': 'warn',           // Warn when <img> elements lack alt attribute

    // Next.js specific rules
    '@next/next/no-img-element': 'warn',   // Warn for <img>, recommend usage of <Image>

    // TypeScript linting rules
    '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
  },
  },
];

export default eslintConfig;
