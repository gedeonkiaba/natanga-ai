import { describe, expect, it } from 'vitest';
import { colors, contrast, fontFamilies } from './index';

describe('tokens — palette', () => {
  it('expose les couleurs de base non saturées', () => {
    expect(colors.background).toBeDefined();
    expect(colors.warning).toBeDefined();
    // Pas de rouge agressif : la couleur d'erreur est un orange doux.
    expect(colors.warning.toLowerCase()).not.toBe('#ff0000');
  });

  it('documente des contrastes conformes AA (>= 4.5:1)', () => {
    for (const ratio of Object.values(contrast)) {
      const value = parseFloat(ratio.replace(':', ''));
      expect(value).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('priorise une police dyslexie-friendly', () => {
    expect(fontFamilies.body).toContain('OpenDyslexic');
    expect(fontFamilies.body).toContain('Lexend');
  });
});
