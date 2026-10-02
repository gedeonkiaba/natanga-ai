// Configuration ESLint partagée (racine).
// Le lint a11y bloquant (US-32) est appliqué ici :
//   - `jsx-a11y` pour le web (Next.js, éléments DOM).
//   - Règles maison : interdire `accessibilityRole` absent sur les composants tactiles RN.
// Les apps peuvent étendre cette config.
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.next/**',
      '**/coverage/**',
      '**/.expo/**',
      '**/.turbo/**',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
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
    },
  },
];
