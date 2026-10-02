/**
 * Design system Natanga mobile — source unique des couleurs, typographies, espacements.
 *
 * Valeurs relevées au pixel sur la maquette approuvée (Sleek, 4 écrans). La maquette
 * suit l'échelle Tailwind : indigo pour l'action, teal pour la sélection et la réussite,
 * ambre / fuchsia / ciel pour les récompenses. Jamais de rouge d'erreur.
 */

export const palette = {
  // Fonds
  cream: '#F9F6EF',
  surface: '#FFFFFF',
  surfaceMuted: '#F8FAFC',
  footnote: '#FCFBF8',

  // Encres
  ink: '#1A1A2E',
  inkDeep: '#1E1B4B', // titres de célébration, infobulle
  inkBody: '#5A5A74',
  inkSoft: '#757794',
  inkLabel: '#73738C',
  inkMeta: '#4B5563',
  inkFaint: '#9CA3AF',
  slate700: '#334155',
  slate500: '#64748B',

  // Bordures
  border: '#EEEAE2',
  borderSlate: '#E2E8F0',
  borderSoft: '#F1F5F9',

  // Indigo (action principale)
  indigo50: '#EEF2FF',
  indigo100: '#E0E7FF',
  indigo300: '#A5B4FC',
  indigo500: '#6366F1',
  indigo600: '#4F46E5',

  // Violet / pourpre
  violet500: '#8B5CF6',
  violet900: '#4C1D95',
  purple50: '#FAF5FF',
  purple100: '#F3E8FF',
  purple200: '#E9D5FF',

  // Teal (sélection, syllabes, trésor)
  teal50: '#F0FDFA',
  teal100: '#CCFBF1',
  teal300: '#99D2CC',
  teal600: '#0D9488',
  teal700: '#0F766E',
  emerald50: '#ECFDF5',

  // Vert
  green50: '#F0FDF4',
  green100: '#DCFCE7',
  green800: '#166534',

  // Récompenses
  amber100: '#FEF3C7',
  amber500: '#F59E0B',
  amber600: '#D97706',
  yellow200: '#FEF08A',
  yellow800: '#854D0E',
  sky100: '#E0F2FE',
  sky600: '#0284C7',
  fuchsia50: '#FDF4FF',
  fuchsia100: '#FAE8FF',
  fuchsia200: '#F5D0FE',
  fuchsia600: '#C026D3',
  pink100: '#FCE7F3',
  rose100: '#FEE2E2', // fond de pictogramme « Sports » uniquement (pas un état d'erreur)

  // Barre de progression
  track: '#E5E0D5',

  white: '#FFFFFF',
} as const;

/** Rôles sémantiques : les écrans n'utilisent que ces noms. */
export const colors = {
  background: palette.cream,
  surface: palette.surface,
  text: palette.ink,
  textMuted: palette.inkBody,
  textSoft: palette.inkSoft,
  label: palette.inkLabel,
  primary: palette.indigo500,
  primaryDeep: palette.indigo600,
  primarySoft: palette.indigo50,
  onPrimary: palette.white,
  selection: palette.teal600,
  selectionSoft: palette.teal50,
  navIdle: '#9EA5B0',
  /** Syllabes bicolores : 1ʳᵉ syllabe de chaque mot en teal, puis alternance ardoise. */
  syllableA: palette.teal700,
  syllableB: palette.slate700,
} as const;

/** Lexend (Google Fonts) à toutes les graisses, chargée par `useAppFonts`. */
export const fonts = {
  regular: 'Lexend_400Regular',
  medium: 'Lexend_500Medium',
  semibold: 'Lexend_600SemiBold',
  bold: 'Lexend_700Bold',
  extrabold: 'Lexend_800ExtraBold',
} as const;

export type FontWeight = keyof typeof fonts;

/** Échelle typographique (pt). */
export const type = {
  brand: { size: 24, line: 30, weight: 'extrabold' },
  hero: { size: 24, line: 30, weight: 'bold' },
  title: { size: 22, line: 28, weight: 'bold' },
  celebration: { size: 23, line: 30, weight: 'bold' },
  reading: { size: 22, line: 46, weight: 'semibold' },
  stat: { size: 17, line: 22, weight: 'bold' },
  cardTitle: { size: 15, line: 19, weight: 'semibold' },
  button: { size: 16, line: 20, weight: 'bold' },
  body: { size: 14, line: 21, weight: 'regular' },
  bodySmall: { size: 13, line: 18, weight: 'regular' },
  caption: { size: 12, line: 16, weight: 'medium' },
  label: { size: 12.5, line: 16, weight: 'bold' },
  micro: { size: 10.5, line: 13, weight: 'semibold' },
  nav: { size: 11, line: 14, weight: 'medium' },
} as const satisfies Record<string, { size: number; line: number; weight: FontWeight }>;

export type TypeVariant = keyof typeof type;

/** Espacements (pt). */
export const space = { xxs: 4, xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;

/** Rayons (pt). */
export const radius = { sm: 8, md: 12, lg: 16, xl: 20, pill: 999 } as const;

/** Gouttière latérale des écrans. */
export const gutter = 20;

/** Cible tactile minimale (WCAG / consigne produit). */
export const touch = 48;

/** Ombres douces (iOS + Android + web). */
export const shadow = {
  card: {
    shadowColor: '#1E1B4B',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  primary: {
    shadowColor: palette.indigo500,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  teal: {
    shadowColor: palette.teal600,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
} as const;
