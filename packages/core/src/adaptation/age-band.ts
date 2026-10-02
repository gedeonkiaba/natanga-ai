/**
 * Dérivation de la tranche d'âge à partir de l'année de naissance.
 * Minimisation : on ne stocke pas la date de naissance complète, seulement l'année,
 * puis on dérive une tranche (6-8 / 9-12).
 */

import type { AgeBand } from '../domain';

/** Années de tranches (bornes inclusives). */
const BANDS: Array<{ band: AgeBand; min: number; max: number }> = [
  { band: '6-8', min: 6, max: 8 },
  { band: '9-12', min: 9, max: 12 },
];

/**
 * Calcule la tranche d'âge à partir d'une année de naissance et d'une année de référence.
 * L'année de référence vaut par défaut l'année courante.
 */
export function deriveAgeBand(
  birthYear: number,
  referenceYear: number = new Date().getFullYear(),
): AgeBand | null {
  const age = referenceYear - birthYear;
  const match = BANDS.find((b) => age >= b.min && age <= b.max);
  return match ? match.band : null;
}

/** Indique si l'âge est dans le périmètre produit (6–12 ans). */
export function isSupportedAge(birthYear: number, referenceYear = new Date().getFullYear()): boolean {
  return deriveAgeBand(birthYear, referenceYear) !== null;
}
