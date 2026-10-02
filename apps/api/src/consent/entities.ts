/**
 * Entités de persistance du Lot C.
 *
 * Note d'implémentation (Sprint 1) : persistance **en mémoire** via un repository
 * injectable. Cette abstraction sera remplacée par Prisma/Postgres (tâche A.4) sans
 * changer la couche service. Les champs suivent le dictionnaire de données
 * (spec §8) et les invariants C1–C7.
 */

import type {
  AgeBand,
  ConsentAudit,
  ConsentStatus,
  Role,
  UserStatus,
  SkillLevel,
  ExerciseType,
  ItemType,
} from '@natanga/core';

/** Compte adulte titulaire (parent). */
export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

/** Profil enfant. */
export interface ChildEntity {
  id: string;
  userId: string;
  displayName: string;
  birthYear: number;
  avatar: string | null;
  ageBand: AgeBand;
  /** Statut d'accès effectif (dérivé du consentement actif). */
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

/** Enregistrement de consentement append-only. */
export interface ConsentEntity {
  id: string;
  childId: string;
  version: number;
  status: ConsentStatus;
  grantedAt: string | null;
  revokedAt: string | null;
  audit: ConsentAudit;
  createdAt: string;
}

// ─── Pédagogie (Lot E/F) ────────────────────────────────────────────────────────

/** Nœud de l'arbre de compétences. */
export interface SkillNodeEntity {
  id: string;
  level: SkillLevel;
  title: string;
  order: number;
  unlockedWhen: number;
}

/** Leçon. */
export interface LessonEntity {
  id: string;
  nodeId: string;
  title: string;
  durationMin: number;
  order: number;
}

/** Exercice. */
export interface ExerciseEntity {
  id: string;
  lessonId: string;
  type: ExerciseType;
  params: Record<string, unknown>;
  order: number;
}

/** Item pédagogique. */
export interface ItemEntity {
  id: string;
  type: ItemType;
  label: string;
  phoneme: string | null;
  audioUrl: string | null;
  metadata: Record<string, unknown> | null;
}

/** Progression d'un enfant sur un nœud. */
export interface ProgressEntity {
  id: string;
  childId: string;
  nodeId: string;
  status: 'locked' | 'available' | 'in_progress' | 'mastered';
  masteredScore: number;
}

/** Tentative de réponse. */
export interface AttemptEntity {
  id: string;
  childId: string;
  exerciseId: string;
  itemId: string | null;
  isCorrect: boolean;
  errorKind: string | null;
} 
