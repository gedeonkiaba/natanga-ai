import { palette } from '../tokens';

/** Couples fond / encre réutilisés par pastilles, tuiles d'icône et badges. */
export const tones = {
  indigo: { bg: palette.indigo50, fg: palette.indigo500 },
  violet: { bg: palette.purple100, fg: palette.violet500 },
  amber: { bg: palette.amber100, fg: palette.amber600 },
  teal: { bg: palette.teal100, fg: palette.teal700 },
  green: { bg: palette.green50, fg: palette.green800 },
  emerald: { bg: palette.emerald50, fg: palette.teal600 },
  sky: { bg: palette.sky100, fg: palette.sky600 },
  fuchsia: { bg: palette.fuchsia100, fg: palette.fuchsia600 },
  slate: { bg: '#F1F3F9', fg: '#5A637D' },
  purple: { bg: palette.purple50, fg: palette.violet500 },
} as const;

export type Tone = keyof typeof tones;
