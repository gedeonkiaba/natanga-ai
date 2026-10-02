/**
 * Barrière parentale : l'appareil est souvent tendu à l'enfant avec la session du
 * parent ouverte. L'espace parent (accord, export, suppression) n'est accessible
 * qu'après une question qu'un enfant de 6–12 ans ne résout pas d'un coup d'œil.
 * Déverrouillage valable 15 min dans l'onglet ; reverrouillé dès l'entrée en lecture.
 */
const KEY = 'natanga.parentGate';
const TTL_MS = 15 * 60 * 1000;

export function unlockParent(now = Date.now()): void {
  try {
    window.sessionStorage.setItem(KEY, String(now));
  } catch {
    /* pas de stockage : la question sera reposée */
  }
}

export function lockParent(): void {
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {
    /* rien à faire */
  }
}

export function isParentUnlocked(now = Date.now()): boolean {
  try {
    const at = Number(window.sessionStorage.getItem(KEY));
    return at > 0 && now - at < TTL_MS;
  } catch {
    return false;
  }
}

/** Question « adulte » : multiplication à deux chiffres × un chiffre (ex. 37 × 6). */
export function newChallenge(rand: () => number = Math.random): {
  a: number;
  b: number;
  answer: number;
} {
  const a = 12 + Math.floor(rand() * 78); // 12..89
  const b = 3 + Math.floor(rand() * 7); // 3..9
  return { a, b, answer: a * b };
}
