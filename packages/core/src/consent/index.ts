/**
 * Machine à états du consentement — aligné sur la spec Lot C §3.
 *
 * Règles :
 * - PENDING → GRANTED | DENIED
 * - GRANTED → REVOKED | EXPIRED
 * - REVOKED → GRANTED (nouvelle version, jamais de réouverture d'enregistrement)
 * - DENIED  → GRANTED (nouvelle tentative crée une nouvelle version)
 *
 * Chaque transition produit un NOUVEL enregistrement append-only ;
 * on n'écrase jamais un historique.
 */

import type { ConsentStatus } from '../domain';

/** Transitions autorisées (table de transitions). */
const TRANSITIONS: Record<ConsentStatus, readonly ConsentStatus[]> = {
  PENDING: ['GRANTED', 'DENIED'],
  GRANTED: ['REVOKED', 'EXPIRED'],
  REVOKED: ['GRANTED'],
  EXPIRED: ['GRANTED'],
  DENIED: ['GRANTED'],
};

export type ConsentAction = 'grant' | 'deny' | 'revoke' | 'expire';

/** Mappe une action utilisateur vers l'état cible correspondant. */
const ACTION_TO_TARGET: Record<ConsentAction, ConsentStatus> = {
  grant: 'GRANTED',
  deny: 'DENIED',
  revoke: 'REVOKED',
  expire: 'EXPIRED',
};

export interface ConsentTransition {
  valid: boolean;
  from: ConsentStatus;
  to: ConsentStatus;
  reason?: string;
}

/** Indique si une transition est autorisée depuis un état donné. */
export function canTransition(from: ConsentStatus, to: ConsentStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

/**
 * Applique une action et retourne l'état cible si valide, sinon `null`.
 * Pure fonction, sans effet de bord.
 */
export function applyAction(from: ConsentStatus, action: ConsentAction): ConsentTransition {
  const to = ACTION_TO_TARGET[action];
  const valid = canTransition(from, to);
  return {
    valid,
    from,
    to,
    reason: valid ? undefined : `Transition interdite : ${from} → ${to}`,
  };
}

/**
 * Détermine si une transition aboutit à un état dans lequel l'enfant est « utilisable »
 * (consentement actif non révoqué).
 */
export function isChildActive(status: ConsentStatus): boolean {
  return status === 'GRANTED';
}
