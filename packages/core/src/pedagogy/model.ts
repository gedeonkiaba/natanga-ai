/**
 * Modèle de données pédagogique — aligné sur la spec Lot E (US-05, US-06, US-07, US-08).
 *
 * Arbre de compétences : Lettres → Syllabes → Mots → Phrases → Textes.
 * Chaque `SkillNode` contient des `Lesson`, composées d'`Exercise`, qui référencent des `Item`.
 */

/** Niveau dans l'arbre de compétences (du plus simple au plus complexe). */
export type SkillLevel =
  'sounds' | 'letters' | 'syllables' | 'words' | 'complex-sounds' | 'sentences' | 'texts';

/** Niveau du parcours (base de connaissances `content/curriculum/niveaux.csv`). */
export interface CurriculumLevel {
  rank: number;
  key: SkillLevel;
  name: string;
  objective: string;
}

/** Type d'exercice (spec §2). */
export type ExerciseType =
  | 'sound-grapheme' // association son ⇄ graphème
  | 'word-recognition'; // reconnaissance de mots (QCM)

/** Type d'item pédagogique. */
export type ItemType = 'grapheme' | 'phoneme' | 'syllable' | 'word' | 'sentence';

export interface SkillNode {
  id: string;
  level: SkillLevel;
  title: string;
  order: number;
  /** Règle de déblocage : nombre de nœuds précédents maîtrisés requis. */
  unlockedWhen: number;
}

export interface Lesson {
  id: string;
  nodeId: string;
  title: string;
  /** Objectif de la leçon (base de connaissances). */
  objective?: string;
  /** Durée cible en minutes (5–10). */
  durationMin: number;
  order: number;
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  /** Paramètres libres (ex. distracteurs pour QCM). */
  params: ExerciseParams;
  order: number;
}

export interface ExerciseParams {
  /** Pour son⇄graphème : le phonème attendu. */
  phoneme?: string;
  /** Pour son⇄graphème : ce que dit la voix (« b, comme ballon ») ; à défaut, le phonème. */
  cue?: string;
  /** Pour word-recognition : la bonne réponse. */
  correctItemId?: string;
  /** Choix proposés. Absent pour son⇄graphème = toutes les lettres. */
  itemIds?: string[];
}

/** Item pédagogique élémentaire (grapheme = lettre, phoneme = son, word = mot). */
export interface PedagogyItem {
  id: string;
  type: ItemType;
  /** Libellé affiché (ex. « a », « ba », « chat »). */
  label: string;
  /** Phonème associé (pour la synthèse vocale). */
  phoneme?: string;
  /** Découpage syllabique (mots : « ma », « man ») pour l'affichage bicolore. */
  syllables?: string[];
  /** URL audio (optionnel — le TTS sert de fallback). */
  audioUrl?: string;
  metadata?: Record<string, unknown>;
}

/** Progression d'un enfant sur un nœud. */
export interface SkillProgress {
  childId: string;
  nodeId: string;
  status: 'locked' | 'available' | 'in_progress' | 'mastered';
  masteredScore: number; // 0..1
}
