/** Contrats de l'API Laravel consommés par le web (camelCase). */

export interface Child {
  id: string;
  displayName: string;
  birthYear: number;
  ageBand: string;
  status: 'ACTIVE' | 'INACTIVE' | string;
  placementLevel: '1' | '2' | '3' | null;
  avatar: string | null;
}

export interface ReadingText {
  id: string;
  title: string;
  text: string;
  readingLevel: string;
  interest: string;
  phonemes: string[];
  ageMin: number;
  durationMin: number;
}

export interface Lesson {
  id: string;
  title: string;
  text: string | null;
  kind: string;
  durationMin: number;
}

export interface Settings {
  voiceSpeed: number;
  syllableColoring: boolean;
  fontFamily: 'system' | 'dyslexic' | 'lexend';
  fontScale: number;
}

export interface Consent {
  id: string;
  version: number;
  status: 'GRANTED' | 'DENIED' | 'REVOKED' | string;
  grantedAt: string | null;
  revokedAt: string | null;
}

export interface SessionResult {
  session: { id: string; stars: number; wordsRead: number; correctWords: number; durationSec: number };
  reward: { kind: string; amount: number } | null;
  unlocked: Array<{ kind: string; key: string }>;
}

export interface Dashboard {
  child: { id: string; displayName: string; placementLevel: string | null; avatar: string | null };
  today: { sessionsCount: number; durationSec: number; starsEarnedToday: number };
  totals: { sessions: number; durationSec: number; stars: number; gems: number; masteredNodes: number };
  progression: { mastered: number; inProgress: number; total: number; percent: number };
  confusions: Array<{ errorKind: string; count: number; label?: string }>;
  recentSessions: Array<{
    id: string;
    lessonId: string | null;
    durationSec: number;
    wordsRead: number;
    correctWords: number;
    stars: number;
    createdAt: string;
  }>;
  diagnostic: unknown;
  recommendations: string[];
}

export const INTERESTS: Array<{ key: string; label: string; emoji: string }> = [
  { key: 'animaux', label: 'Animaux', emoji: '🐾' },
  { key: 'espace', label: 'Espace', emoji: '🚀' },
  { key: 'contes', label: 'Contes', emoji: '🏰' },
  { key: 'dinosaures', label: 'Dinosaures', emoji: '🦕' },
  { key: 'nature', label: 'Nature', emoji: '🌳' },
  { key: 'musique', label: 'Musique', emoji: '🎵' },
];

/** `GET /children` et `GET /children/{id}` renvoient le modèle brut (snake_case). */
export function toChild(raw: Record<string, unknown>): Child {
  const pick = (camel: string, snake: string) => raw[camel] ?? raw[snake];
  return {
    id: String(raw.id),
    displayName: String(pick('displayName', 'display_name') ?? ''),
    birthYear: Number(pick('birthYear', 'birth_year')),
    ageBand: String(pick('ageBand', 'age_band') ?? ''),
    status: String(raw.status ?? ''),
    placementLevel: (pick('placementLevel', 'placement_level') as Child['placementLevel']) ?? null,
    avatar: (raw.avatar as string | null) ?? null,
  };
}
