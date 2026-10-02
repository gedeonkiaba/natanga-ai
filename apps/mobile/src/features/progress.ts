/**
 * Progression de l'enfant, conservée sur l'appareil (fonctionne hors connexion).
 * Fonctions pures et testées ; la persistance est dans `src/storage/progressStore.tsx`.
 *
 * Chaque changement ajoute aussi un événement à la file `outbox` : quand l'app sera
 * reliée à l'API, ces événements seront envoyés au serveur au retour du réseau.
 */
import type { SkillProgress } from '@natanga/core';
import type { ThemeKey } from './profile';

/** Même règle que l'API (AttemptService) : ≥ 3 réponses et ≥ 70 % de réussite. */
export const MASTERY_THRESHOLD = 0.7;
export const MASTERY_MIN_ANSWERS = 3;
/** Taille max de la file d'envoi (les plus anciens événements sont abandonnés). */
export const OUTBOX_LIMIT = 500;

export const SCHEMA_VERSION = 1;

export type NodeStatus = 'in_progress' | 'mastered';

export interface PendingEvent {
  id: string;
  type: 'profile_saved' | 'lesson_completed' | 'reading_completed';
  at: string;
  payload: Record<string, unknown>;
}

export interface ProgressState {
  version: typeof SCHEMA_VERSION;
  profile: { avatar: string; themes: ThemeKey[] } | null;
  /** Statut et meilleur score par nœud de l'arbre. */
  nodes: Record<string, { status: NodeStatus; bestScore: number }>;
  gems: number;
  stars: number;
  readings: number;
  outbox: PendingEvent[];
}

export const initialProgress: ProgressState = {
  version: SCHEMA_VERSION,
  profile: null,
  nodes: {},
  gems: 0,
  stars: 0,
  readings: 0,
  outbox: [],
};

let seq = 0;
function event(
  type: PendingEvent['type'],
  payload: Record<string, unknown>,
  now: Date,
): PendingEvent {
  seq += 1;
  return { id: `${now.getTime().toString(36)}-${seq}`, type, at: now.toISOString(), payload };
}

function enqueue(outbox: PendingEvent[], e: PendingEvent): PendingEvent[] {
  const next = [...outbox, e];
  return next.length > OUTBOX_LIMIT ? next.slice(next.length - OUTBOX_LIMIT) : next;
}

export function saveProfile(
  state: ProgressState,
  profile: { avatar: string; themes: ThemeKey[] },
  now = new Date(),
): ProgressState {
  return {
    ...state,
    profile: { avatar: profile.avatar, themes: [...profile.themes] },
    outbox: enqueue(state.outbox, event('profile_saved', { ...profile }, now)),
  };
}

export interface LessonOutcome {
  nodeId: string;
  lessonId: string;
  correct: number;
  total: number;
  gems: number;
}

export function isMastered(correct: number, total: number): boolean {
  return total >= MASTERY_MIN_ANSWERS && correct / total >= MASTERY_THRESHOLD;
}

/** Fin de leçon : gemmes gagnées, nœud « en cours » ou « maîtrisé » (jamais rétrogradé). */
export function recordLesson(
  state: ProgressState,
  o: LessonOutcome,
  now = new Date(),
): ProgressState {
  const score = o.total > 0 ? o.correct / o.total : 0;
  const previous = state.nodes[o.nodeId];
  const mastered = previous?.status === 'mastered' || isMastered(o.correct, o.total);
  return {
    ...state,
    gems: state.gems + Math.max(0, o.gems),
    nodes: {
      ...state.nodes,
      [o.nodeId]: {
        status: mastered ? 'mastered' : 'in_progress',
        bestScore: Math.max(previous?.bestScore ?? 0, score),
      },
    },
    outbox: enqueue(state.outbox, event('lesson_completed', { ...o, score }, now)),
  };
}

export interface ReadingOutcome {
  lessonId: string;
  durationSec: number;
  wordsRead: number;
  correctWords: number;
}

/** Étoiles d'une lecture terminée : même règle que l'API (1, +1 si ≥ 80 % de mots lus seul). */
export function readingStars(wordsRead: number, correctWords: number): number {
  return 1 + (wordsRead > 0 && correctWords / wordsRead >= 0.8 ? 1 : 0);
}

/** Lecture terminée ; la charge utile correspond au corps de POST /children/{id}/sessions. */
export function recordReading(
  state: ProgressState,
  r: ReadingOutcome,
  now = new Date(),
): ProgressState {
  const stars = readingStars(r.wordsRead, r.correctWords);
  return {
    ...state,
    stars: state.stars + stars,
    readings: state.readings + 1,
    outbox: enqueue(
      state.outbox,
      event('reading_completed', { ...r, completed: true, stars }, now),
    ),
  };
}

/** Progression au format attendu par `computeTreeState` (@natanga/core). */
export function treeProgress(state: ProgressState): SkillProgress[] {
  return Object.entries(state.nodes).map(([nodeId, n]) => ({
    childId: 'local',
    nodeId,
    status: n.status,
    masteredScore: n.bestScore,
  }));
}

/** Relit l'état sauvegardé ; données absentes, corrompues ou d'un autre schéma → état neuf. */
export function parseProgress(raw: string | null): ProgressState {
  if (!raw) return initialProgress;
  try {
    const data = JSON.parse(raw) as Partial<ProgressState>;
    if (data?.version !== SCHEMA_VERSION) return initialProgress;
    return {
      ...initialProgress,
      ...data,
      nodes: data.nodes ?? {},
      outbox: Array.isArray(data.outbox) ? data.outbox : [],
    } as ProgressState;
  } catch {
    return initialProgress;
  }
}
