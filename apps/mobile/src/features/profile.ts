/** Choix du profil enfant (avatar + thèmes), pur et testé. */

export type ThemeKey = 'animaux' | 'science' | 'aventure' | 'fantaisie' | 'sports' | 'famille';

export function toggleTheme(selected: readonly ThemeKey[], key: ThemeKey): ThemeKey[] {
  return selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key];
}

/** « 3 sélectionnés », « 1 sélectionné », « Aucun thème ». */
export function selectionLabel(count: number): string {
  if (count === 0) return 'Aucun thème';
  return count === 1 ? '1 sélectionné' : `${count} sélectionnés`;
}

/** Il faut au moins un thème pour proposer des histoires. */
export function canSubmitProfile(avatar: string | null, themes: readonly ThemeKey[]): boolean {
  return avatar !== null && themes.length > 0;
}
