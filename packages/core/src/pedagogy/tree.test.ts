import { describe, expect, it } from 'vitest';
import { computeTreeState, isUnlocked } from './tree';
import { LEVEL1_NODES } from './content';

describe('arbre de compétences (US-05)', () => {
  it('débloque séquentiellement les nœuds', () => {
    const state = computeTreeState(LEVEL1_NODES, []);
    // Aucun masterisé → nœud 1 disponible, les autres verrouillés.
    expect(state[0]!.status).toBe('available');
    expect(state[1]!.status).toBe('locked');
    expect(state[2]!.status).toBe('locked');
  });

  it('débloque le nœud 2 après maîtrise du nœud 1', () => {
    const mastered = [
      { childId: 'c', nodeId: 'n-letters-a', status: 'mastered' as const, masteredScore: 1 },
    ];
    const state = computeTreeState(LEVEL1_NODES, mastered);
    expect(state[1]!.status).toBe('available');
  });

  it('expose la règle de déblocage', () => {
    expect(isUnlocked(LEVEL1_NODES[0]!, 0)).toBe(true);
    expect(isUnlocked(LEVEL1_NODES[1]!, 0)).toBe(false);
    expect(isUnlocked(LEVEL1_NODES[1]!, 1)).toBe(true);
    expect(isUnlocked(LEVEL1_NODES[2]!, 2)).toBe(true);
  });

  it('ordonne les nœuds par ordre canonique', () => {
    const shuffled = [LEVEL1_NODES[2]!, LEVEL1_NODES[0]!, LEVEL1_NODES[1]!];
    expect(computeTreeState(shuffled, []).map((n) => n.nodeId)).toEqual([
      'n-letters-a',
      'n-letters-bd',
      'n-letters-pq',
    ]);
  });
});
