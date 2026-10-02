/**
 * Jeton Bearer du parent. Stocké en localStorage (MVP) : effacé à la déconnexion
 * et dès que l'API répond 401. Voir docs/26 §Risques (passage en cookie httpOnly).
 */
const KEY = 'natanga.token';

export function getToken(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    window.localStorage.setItem(KEY, token);
  } catch {
    /* stockage indisponible : la session ne survivra pas au rechargement */
  }
}

export function clearToken(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* rien à effacer */
  }
}
