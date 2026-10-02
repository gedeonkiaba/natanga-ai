import { describe, expect, it } from 'vitest';
import {
  parseSyllabified,
  passageText,
  progressRatio,
  spokenWord,
  syllableLabel,
  syllableTone,
} from './reading';
import { canSubmitProfile, selectionLabel, toggleTheme } from './profile';

describe('lecture', () => {
  it('découpe le contenu syllabé (ponctuation détachée, trait d’union préservé)', () => {
    const p = parseSyllabified('Sou-dain, u-ne lu-ci-ole bril-la au‑des-sus des fou-gè-res.');
    expect(p[0]).toEqual({ syllables: ['Sou', 'dain'], trailing: ',' });
    expect(p[2]).toEqual({ syllables: ['lu', 'ci', 'ole'] });
    expect(p[4]).toEqual({ syllables: ['au-des', 'sus'] });
    expect(p[6]).toEqual({ syllables: ['fou', 'gè', 'res'], trailing: '.' });
  });

  it('colore la 1ʳᵉ syllabe de chaque mot en A puis alterne', () => {
    expect([0, 1, 2, 3].map(syllableTone)).toEqual(['A', 'B', 'A', 'B']);
  });

  it('produit les libellés de l’infobulle et du texte lu à voix haute', () => {
    const w = { syllables: ['lu', 'ci', 'ole'] };
    expect(syllableLabel(w)).toBe('lu · ci · ole');
    expect(spokenWord(w)).toBe('luciole');
    expect(passageText([parseSyllabified('Ni-no le pe-tit re-nard.')])).toBe(
      'Nino le petit renard.',
    );
  });

  it('borne la progression', () => {
    expect(progressRatio(6, 10)).toBe(0.6);
    expect(progressRatio(12, 10)).toBe(1);
    expect(progressRatio(3, 0)).toBe(0);
  });
});

describe('profil', () => {
  it('ajoute et retire un thème', () => {
    expect(toggleTheme(['animaux'], 'science')).toEqual(['animaux', 'science']);
    expect(toggleTheme(['animaux', 'science'], 'animaux')).toEqual(['science']);
  });

  it('accorde le libellé du compteur', () => {
    expect(selectionLabel(3)).toBe('3 sélectionnés');
    expect(selectionLabel(1)).toBe('1 sélectionné');
    expect(selectionLabel(0)).toBe('Aucun thème');
  });

  it('exige un avatar et au moins un thème', () => {
    expect(canSubmitProfile('lumi', ['animaux'])).toBe(true);
    expect(canSubmitProfile('lumi', [])).toBe(false);
    expect(canSubmitProfile(null, ['animaux'])).toBe(false);
  });
});
