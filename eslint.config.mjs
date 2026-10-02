// Configuration ESLint partagée (racine).
// Le lint a11y bloquant (US-32) est appliqué ici :
//   - `jsx-a11y` pour le web (Next.js, éléments DOM).
//   - Règles maison : interdire `accessibilityRole` absent sur les composants tactiles RN.
// Les apps peuvent étendre cette config.
import jsxA11y from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/.turbo/**',
      '**/e2e-results/**',
      '**/e2e-report/**',
      '**/next-env.d.ts',
      'apps/mobile-flutter/**',
      'apps/api-laravel/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      'jsx-a11y': jsxA11y,
    },
    rules: {
      'no-console': 'warn',
      // Règles a11y fondamentales (web DOM).
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
      'jsx-a11y/no-autofocus': 'warn',
      'jsx-a11y/label-has-associated-control': ['error', { assert: 'either' }],
      'jsx-a11y/click-events-have-key-events': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/anchor-is-valid': 'error',
      // Champs de formulaire : couverts par label-has-associated-control (htmlFor).
      'jsx-a11y/control-has-associated-label': ['error', { ignoreElements: ['input', 'select', 'textarea'] }],
    },
  },
];
