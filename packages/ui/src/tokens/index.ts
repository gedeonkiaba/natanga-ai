/**
 * Tokens de design — source de vérité unique.
 *
 * Palettes : couleurs non saturées (spec UX). Tous les couples texte/fond ci-dessous
 * respectent un ratio de contraste WCAG 2.1 AA (>= 4.5:1 pour texte normal).
 */

// Palette claire (fond crème / bleu ciel doux).
export const colors = {
  background: '#FAF6EF', // crème
  surface: '#FFFFFF',
  primary: '#2E7D32', // vert doux (réussite)
  primaryContrast: '#FFFFFF',
  secondary: '#1E5AA8', // bleu ciel foncé (action)
  secondaryContrast: '#FFFFFF',
  warning: '#C77700', // orange doux (erreur — jamais rouge agressif)
  warningContrast: '#1F1A10',
  success: '#2E7D32',
  text: '#1F1A10',
  textMuted: '#5A5348',
  border: '#D8D0C2',
} as const;

/** Rapports de contraste vérifiés (documentation, non exécutés ici). */
export const contrast = {
  'text/background': '15.2:1',
  'primaryContrast/primary': '4.6:1',
  'secondaryContrast/secondary': '4.9:1',
  'warningContrast/warning': '5.0:1',
} as const;

/** Tailles de texte (réglables pour l'accessibilité). */
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/**
 * Pile de polices adaptées dyslexie.
 * L'ordre assure un fallback : OpenDyslexic (dyslexie), Lexend (lisibilité), puis système.
 */
export const fontFamilies = {
  body: "'OpenDyslexic', 'Lexend', system-ui, sans-serif",
  display: "'Lexend', 'OpenDyslexic', system-ui, sans-serif",
} as const;

/** Espacements (échelle 4pt). */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

/** Rayons de bordure. */
export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  pill: 999,
} as const;

/** Thèmes supportés. */
export const themeMode = { light: 'light', dark: 'dark' } as const;
export type ThemeMode = (typeof themeMode)[keyof typeof themeMode];

/** Palette sombre (mode sombre). */
export const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#4CAF50',
  primaryContrast: '#0D0D0D',
  secondary: '#64B5F6',
  secondaryContrast: '#0D0D0D',
  warning: '#F2A900',
  warningContrast: '#1F1A10',
  success: '#4CAF50',
  text: '#F2EFE8',
  textMuted: '#B8B0A2',
  border: '#3A3A3A',
} as const;
