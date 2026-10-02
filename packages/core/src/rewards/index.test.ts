import { describe, expect, it } from 'vitest';
import { GEMS_EFFORT, GEMS_SUCCESS, rewardForAnswer, softenStreak } from './index';

describe('rewardForAnswer (gamification bienveillante)', () => {
  it('récompense la réussite', () => {
    expect(rewardForAnswer(true)).toEqual({
      kind: 'gems',
      amount: GEMS_SUCCESS,
      reason: 'réussite',
    });
  });

  it('récompense aussi l’effort en cas d’erreur', () => {
    expect(rewardForAnswer(false).kind).toBe('effort');
    expect(rewardForAnswer(false).amount).toBe(GEMS_EFFORT);
  });
});

describe('softenStreak (streak adouci)', () => {
  it('conserve le streak si aucun jour manqué', () => {
    expect(softenStreak(5, 0)).toBe(5);
  });

  it('décrémente doucement sans remise à zéro brutale', () => {
    expect(softenStreak(5, 1)).toBe(4);
    expect(softenStreak(2, 1)).toBe(1);
    expect(softenStreak(1, 3)).toBe(0);
  });
});
