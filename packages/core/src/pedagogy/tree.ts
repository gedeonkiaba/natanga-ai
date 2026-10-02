/**
 * Arbre de compétences (US-05) — déblocage séquentiel des nœuds.
 */

import type { SkillNode, SkillProgress } from './model';

/**
 * Calcule le statut de chaque nœud pour un enfant, en fonction des nœuds maîtrisés.
 * - `locked` : les prérequis ne sont pas atteints.
 * - `available` : débloqué, pas encore commencé.
 * - `in_progress` : commencé mais non maîtrisé.
 * - `mastered` : maîtrisé (score ≥ seuil).
 */
export function computeTreeState(
  nodes: SkillNode[],
  progress: SkillProgress[],
  masteryThreshold = 0.8,
): SkillProgress[] {
  const ordered = [...nodes].sort((a, b) => a.order - b.order);
  const masteredCount = progress.filter((p) => p.status === 'mastered').length;

  return ordered.map((node) => {
    const existing = progress.find((p) => p.nodeId === node.id);
    if (existing) {
      return existing;
    }
    const status: SkillProgress['status'] =
      masteredCount >= node.unlockedWhen
        ? 'available'
        : 'locked';
    const childId = progress[0]?.childId ?? '';
    return {
      childId,
      nodeId: node.id,
      status,
      masteredScore: 0,
    };
  });
}

/** Indique si un nœud est déblocable par l'enfant. */
export function isUnlocked(node: SkillNode, masteredCount: number): boolean {
  return masteredCount >= node.unlockedWhen;
}

/** Retourne l'ordre canonique des niveaux. */
export function nodeOrder(nodes: SkillNode[]): SkillNode[] {
  return [...nodes].sort((a, b) => a.order - b.order);
}
