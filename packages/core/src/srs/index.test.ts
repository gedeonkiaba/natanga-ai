import { describe, expect, it } from 'vitest';
import { createCard, review } from './index';

describe('SRS - review', () => {
  it('remet la carte en révision rapprochée sur un échec (grade < 3)', () => {
    const card = createCard('c1');
    const updated = review({ ...card, repetitions: 3, intervalDays: 10 }, 1);
    expect(updated.repetitions).toBe(0);
    expect(updated.intervalDays).toBe(1);
  });

  it('augmente l’intervalle après des réussites successives', () => {
    let card = createCard('c1');
    card = review(card, 5); // 1re répétition -> 1 jour
    expect(card.intervalDays).toBe(1);
    card = review(card, 5); // 2e -> 6 jours
    expect(card.intervalDays).toBe(6);
    card = review(card, 5); // 3e -> interval * ease
    expect(card.intervalDays).toBeGreaterThan(6);
  });

  it('borne la facilité entre 1.3 et 2.5', () => {
    let card = createCard('c1');
    for (let i = 0; i < 50; i++) card = review(card, 1);
    expect(card.ease).toBeGreaterThanOrEqual(1.3);
    expect(card.ease).toBeLessThanOrEqual(2.5);
  });
});
