/**
 * Logique de lecture, pure (sans React Native) et testée.
 *
 * Un texte est découpé en paragraphes de mots ; chaque mot porte ses syllabes écrites,
 * relues par un humain (« lu·ci·ole », pas un découpage automatique approximatif).
 */

export interface Word {
  /** Syllabes du mot, ponctuation exclue (« Sou », « dain »). */
  syllables: string[];
  /** Ponctuation collée au mot (« , », « . »). */
  trailing?: string;
}

export type Paragraph = Word[];

export type SyllableTone = 'A' | 'B';

/**
 * Coloration bicolore : dans chaque mot, la 1ʳᵉ syllabe prend la teinte A (teal),
 * la suivante B (ardoise), puis alternance. Règle relevée sur la maquette
 * (Ni·no, pe·tit, re·nard, mar·chait, mous·se, Sou·dain).
 */
export function syllableTone(index: number): SyllableTone {
  return index % 2 === 0 ? 'A' : 'B';
}

/** Texte prononcé par la synthèse vocale pour un mot. */
export function spokenWord(word: Word): string {
  return word.syllables.join('');
}

/** Libellé de l'infobulle d'un mot touché : « lu · ci · ole ». */
export function syllableLabel(word: Word): string {
  return word.syllables.join(' · ');
}

/** Texte complet (pour « Écouter tout »). */
export function passageText(paragraphs: Paragraph[]): string {
  return paragraphs
    .map((p) => p.map((w) => spokenWord(w) + (w.trailing ?? '')).join(' '))
    .join(' ');
}

/** Ratio de progression borné entre 0 et 1. */
export function progressRatio(done: number, goal: number): number {
  if (!(goal > 0)) return 0;
  return Math.min(1, Math.max(0, done / goal));
}

/**
 * Raccourci d'écriture du contenu : « Ni-no le pe-tit re-nard » → mots syllabés.
 * Les tirets séparent les syllabes ; la ponctuation finale est détachée.
 * Les traits d'union du français s'écrivent « ‑ » (insécable) : « au‑des-sus ».
 */
export function parseSyllabified(source: string): Paragraph {
  return source
    .trim()
    .split(/\s+/)
    .map((token) => {
      const match = token.match(/^(.*?)([.,;:!?…]+)?$/u);
      const body = match?.[1] ?? token;
      const trailing = match?.[2];
      const syllables = body
        .split('-')
        .map((s) => s.replace(/‑/g, '-'))
        .filter(Boolean);
      return trailing ? { syllables, trailing } : { syllables };
    });
}
