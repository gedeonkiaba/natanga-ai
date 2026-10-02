/**
 * Test de positionnement v0 (US-04) — place l'enfant dans l'arbre de compétences.
 *
 * Algorithme simple : une série d'épreuves croissantes (lettres → syllabes → mots),
 * le niveau atteint détermine le nœud de départ. Explicable, déterministe.
 */

import type { SkillLevel } from './model';

export interface PlacementProbe {
  level: SkillLevel;
  /** Score 0..1 obtenu. */
  score: number;
}

export interface PlacementResult {
  /** Niveau de départ recommandé. */
  startLevel: SkillLevel;
  /** Indice de confiance (0..1). */
  confidence: number;
  /** Justification lisible (pour le parent, sans jargon). */
  explanation: string;
}

const LEVEL_ORDER: SkillLevel[] = ['letters', 'syllables', 'words', 'sentences', 'texts'];

const MASTERY_THRESHOLD = 0.7;

/**
 * Détermine le niveau de départ à partir des scores aux épreuves.
 * L'enfant démarre au premier niveau NON maîtrisé (score < seuil).
 */
export function placeStartLevel(probes: PlacementProbe[]): PlacementResult {
  if (probes.length === 0) {
    return {
      startLevel: 'letters',
      confidence: 1,
      explanation: 'Aucune évaluation renseignée — démarrage au début du parcours.',
    };
  }

  const sorted = [...probes].sort(
    (a, b) => LEVEL_ORDER.indexOf(a.level) - LEVEL_ORDER.indexOf(b.level),
  );

  let startLevel: SkillLevel = 'letters';
  for (const probe of sorted) {
    if (probe.score >= MASTERY_THRESHOLD) {
      // Niveau maîtrisé → on peut commencer au niveau suivant.
      const idx = LEVEL_ORDER.indexOf(probe.level);
      startLevel = LEVEL_ORDER[idx + 1] ?? LEVEL_ORDER[LEVEL_ORDER.length - 1] ?? 'letters';
    } else {
      // Premier niveau non maîtrisé → c'est le point de départ.
      startLevel = probe.level;
      break;
    }
  }

  const confidence = Math.min(
    1,
    sorted.reduce((acc, p) => acc + Math.abs(p.score - MASTERY_THRESHOLD), 0) / sorted.length + 0.5,
  );

  return {
    startLevel,
    confidence,
    explanation: `Démarrage au niveau « ${startLevel} », adapté au résultat du test.`,
  };
}
