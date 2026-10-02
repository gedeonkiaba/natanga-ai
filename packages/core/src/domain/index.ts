/**
 * Types de domaine — alignés sur `docs/08-spec-lot-c-consentement-rgpd.md` (§8)
 * et `docs/06-plan-sprint-1.md` (§5).
 */

export type Role = 'parent' | 'pro';

export type UserStatus = 'PENDING_VERIFICATION' | 'ACTIVE';

export type ChildStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

/** Tranche d'âge dérivée de l'année de naissance (minimisation de la donnée brute). */
export type AgeBand = '6-8' | '9-12';

/** État d'un consentement — machine à états (spec Lot C §3.1). */
export type ConsentStatus = 'PENDING' | 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'DENIED';

export interface User {
  id: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

export interface Child {
  id: string;
  userId: string;
  displayName: string;
  birthYear: number;
  avatar: string | null;
  ageBand: AgeBand;
  status: ChildStatus;
  createdAt: string;
}

export interface ConsentRecord {
  id: string;
  childId: string;
  version: number;
  status: ConsentStatus;
  grantedAt: string | null;
  revokedAt: string | null;
  auditJson: ConsentAudit;
}

/** Trace d'audit immuable (preuve de consentement). */
export interface ConsentAudit {
  source: 'web' | 'mobile';
  userAgent: string;
  ipPrefix: string; // IP tronquée (jamais l'IP complète, minimisation)
  timestamp: string;
}
