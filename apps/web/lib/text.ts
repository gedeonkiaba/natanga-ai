/**
 * Découpage d'un texte de lecture en mots cliquables, et des mots en syllabes
 * (coloration syllabique, aide classique pour les lecteurs DYS).
 *
 * Le découpage syllabique est une heuristique écrite (règles scolaires V-CV,
 * VC-CV, groupes consonantiques inséparables) : il sert à rythmer la lecture,
 * pas à faire de la phonétique exacte.
 */

export type Token = { kind: 'word'; text: string; index: number } | { kind: 'sep'; text: string };

const WORD = /[\p{L}\p{M}]+(?:['’-][\p{L}\p{M}]+)*/gu;

/** Découpe un texte en mots (indexés) et séparateurs (espaces, ponctuation). */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let index = 0;
  for (const match of text.matchAll(WORD)) {
    const start = match.index ?? 0;
    if (start > last) tokens.push({ kind: 'sep', text: text.slice(last, start) });
    tokens.push({ kind: 'word', text: match[0], index: index++ });
    last = start + match[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'sep', text: text.slice(last) });
  return tokens;
}

/** Nombre de mots d'un texte. */
export function countWords(text: string): number {
  return tokenize(text).filter((t) => t.kind === 'word').length;
}

const VOWELS = new Set('aeiouyàâäéèêëîïôöùûüÿœæ');
const INSEPARABLE = new Set([
  'bl',
  'br',
  'ch',
  'cl',
  'cr',
  'dr',
  'fl',
  'fr',
  'gl',
  'gr',
  'gn',
  'ph',
  'pl',
  'pr',
  'th',
  'tr',
  'vr',
]);

function isVowelAt(lower: string, i: number): boolean {
  const c = lower[i] ?? '';
  if (!VOWELS.has(c)) return false;
  // « qu » et « gu » devant voyelle : le u ne se prononce pas, il fait partie de la consonne.
  if (
    c === 'u' &&
    i > 0 &&
    (lower[i - 1] === 'q' || lower[i - 1] === 'g') &&
    VOWELS.has(lower[i + 1] ?? '')
  ) {
    return false;
  }
  return true;
}

function splitSimple(word: string): string[] {
  const lower = word.toLowerCase();
  // Noyaux vocaliques : suites de voyelles consécutives [début, fin[.
  const nuclei: Array<[number, number]> = [];
  for (let i = 0; i < lower.length;) {
    if (isVowelAt(lower, i)) {
      const start = i;
      while (i < lower.length && isVowelAt(lower, i)) i++;
      nuclei.push([start, i]);
    } else {
      i++;
    }
  }
  // Un « e » final après consonne (« lune ») reste une syllabe à l'écrit ; un mot
  // sans voyelle ou à un seul noyau ne se découpe pas.
  if (nuclei.length < 2) return [word];

  const cuts: number[] = [];
  for (let k = 0; k < nuclei.length - 1; k++) {
    const end = nuclei[k]![1];
    const next = nuclei[k + 1]![0];
    const cluster = lower.slice(end, next);
    let cut: number;
    if (cluster.length <= 1) {
      cut = end; // V-CV (ou hiatus sans consonne)
    } else if (cluster.length === 2) {
      cut = INSEPARABLE.has(cluster) ? end : end + 1; // V-CCV ou VC-CV
    } else {
      cut = INSEPARABLE.has(cluster.slice(-2)) ? next - 2 : next - 1;
    }
    // Ne jamais séparer « qu » / « gu » (« quel-que », pas « quelq-ue »).
    if (lower[cut] === 'u' && (lower[cut - 1] === 'q' || lower[cut - 1] === 'g')) cut -= 1;
    cuts.push(cut);
  }

  const parts: string[] = [];
  let from = 0;
  for (const cut of cuts) {
    parts.push(word.slice(from, cut));
    from = cut;
  }
  parts.push(word.slice(from));
  return parts.filter((p) => p.length > 0);
}

/**
 * Découpe un mot en syllabes écrites. Les apostrophes et traits d'union restent
 * collés à la partie qui les précède (« l'ar-bre », « grand-mè-re »).
 */
export function syllables(word: string): string[] {
  const out: string[] = [];
  const pieces = word.split(/(['’-])/);
  for (const piece of pieces) {
    if (piece === '') continue;
    if (/^['’-]$/.test(piece) && out.length > 0) {
      out[out.length - 1] += piece;
    } else {
      out.push(...splitSimple(piece));
    }
  }
  return out;
}
