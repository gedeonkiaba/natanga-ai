import { describe, expect, it } from 'vitest';
import { computeTreeState, isUnlocked } from './tree';
import { CURRICULUM_NODES } from './content';

describe('arbre de compétences (US-05)', () => {
  it('débloque séquentiellement les nœuds', () => {
    const state = computeTreeState(CURRICULUM_NODES, []);
    // Aucun masterisé → nœud 1 disponible, les autres verrouillés.
    expect(state[0]!.status).toBe('available');
    expect(state[1]!.status).toBe('locked');
    expect(state[2]!.status).toBe('locked');
  });

  it('débloque le nœud 2 après maîtrise du nœud 1', () => {
    const mastered = [
      { childId: 'c', nodeId: 'n-son-a', status: 'mastered' as const, masteredScore: 1 },
    ];
    const state = computeTreeState(CURRICULUM_NODES, mastered);
    expect(state[1]!.status).toBe('available');
  });

  it('expose la règle de déblocage', () => {
    expect(isUnlocked(CURRICULUM_NODES[0]!, 0)).toBe(true);
    expect(isUnlocked(CURRICULUM_NODES[1]!, 0)).toBe(false);
    expect(isUnlocked(CURRICULUM_NODES[1]!, 1)).toBe(true);
    expect(isUnlocked(CURRICULUM_NODES[2]!, 2)).toBe(true);
  });

  it('ordonne les nœuds par ordre canonique', () => {
    const shuffled = [CURRICULUM_NODES[2]!, CURRICULUM_NODES[0]!, CURRICULUM_NODES[1]!];
    expect(computeTreeState(shuffled, []).map((n) => n.nodeId)).toEqual([
      'n-son-a',
      'n-son-e',
      'n-son-i',
    ]);
  });

  it('ignore une progression sur un nœud retiré du parcours', () => {
    const legacy = [
      { childId: 'c', nodeId: 'n-letters-a', status: 'mastered' as const, masteredScore: 1 },
    ];
    expect(computeTreeState(CURRICULUM_NODES, legacy)[1]!.status).toBe('locked');
  });
});
