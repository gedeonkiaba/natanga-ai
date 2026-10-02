/**
 * Thème clair/sombre — sélection via `getTheme`/`select`.
 * Les composants utilisent directement les tokens ; ce module fournit la sélection
 * et l'accès aux palettes (clair/sombre) pour l'application hôte.
 */
import { colors, darkColors, type ThemeMode } from './tokens';

/** Palette de couleurs (les valeurs sont des chaînes hex, clés partagées). */
export type ColorPalette = Record<keyof typeof colors, string>;

export interface Theme {
  mode: ThemeMode;
  colors: ColorPalette;
}

export const lightTheme: Theme = { mode: 'light', colors: { ...colors } };
export const darkTheme: Theme = { mode: 'dark', colors: { ...darkColors } };

export function getTheme(mode: ThemeMode): Theme {
  return mode === 'dark' ? darkTheme : lightTheme;
}

export function select(token: keyof typeof colors, mode: ThemeMode): string {
  return getTheme(mode).colors[token];
}
