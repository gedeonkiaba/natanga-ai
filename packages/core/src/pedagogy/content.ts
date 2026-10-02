/**
 * Contenu pédagogique niveau 1 — graines initiales (US Lot E.2).
 *
 * Lettres/sons ciblant les confusions classiques (b/d, p/q) dès le départ,
 * conformément à l'exigence produit (détection des confusions b/d, p/q, inversions).
 */

import type { Exercise, Lesson, PedagogyItem, SkillNode } from './model';

/** Graphemes/lettres ciblés (le sous-ensemble b/d/p/q travaille la confusion classique). */
export const LEVEL1_GRAPHEMES: PedagogyItem[] = [
  { id: 'g-a', type: 'grapheme', label: 'a', phoneme: 'a' },
  { id: 'g-i', type: 'grapheme', label: 'i', phoneme: 'i' },
  { id: 'g-o', type: 'grapheme', label: 'o', phoneme: 'o' },
  { id: 'g-b', type: 'grapheme', label: 'b', phoneme: 'b' },
  { id: 'g-d', type: 'grapheme', label: 'd', phoneme: 'd' },
  { id: 'g-p', type: 'grapheme', label: 'p', phoneme: 'p' },
  { id: 'g-q', type: 'grapheme', label: 'q', phoneme: 'k' },
];

/** Mots simples (révision de la reconnaissance). */
export const LEVEL1_WORDS: PedagogyItem[] = [
  { id: 'w-papa', type: 'word', label: 'papa', phoneme: 'papa' },
  { id: 'w-maman', type: 'word', label: 'maman', phoneme: 'maman' },
  { id: 'w-lapin', type: 'word', label: 'lapin', phoneme: 'lapin' },
  { id: 'w-ballon', type: 'word', label: 'ballon', phoneme: 'ballon' },
  { id: 'w-doigt', type: 'word', label: 'doigt', phoneme: 'doigt' },
];

/** Trois premiers nœuds de l'arbre (US-05 partiel). */
export const LEVEL1_NODES: SkillNode[] = [
  { id: 'n-letters-a', level: 'letters', title: 'Les voyelles', order: 1, unlockedWhen: 0 },
  { id: 'n-letters-bd', level: 'letters', title: 'Les sons b / d', order: 2, unlockedWhen: 1 },
  { id: 'n-letters-pq', level: 'letters', title: 'Les sons p / q', order: 3, unlockedWhen: 2 },
];

/** Leçons du nœud « Les voyelles ». */
export const LEVEL1_LESSONS: Lesson[] = [
  {
    id: 'l-vowels-1',
    nodeId: 'n-letters-a',
    title: 'Écouter les voyelles',
    durationMin: 6,
    order: 1,
  },
  {
    id: 'l-bd-1',
    nodeId: 'n-letters-bd',
    title: 'b ou d ?',
    durationMin: 6,
    order: 1,
  },
];

/** Exercices de la leçon voyelles (son ⇄ graphème). */
export const LEVEL1_EXERCISES: Exercise[] = [
  {
    id: 'e-vowel-a',
    lessonId: 'l-vowels-1',
    type: 'sound-grapheme',
    params: { phoneme: 'a' },
    order: 1,
  },
  {
    id: 'e-vowel-i',
    lessonId: 'l-vowels-1',
    type: 'sound-grapheme',
    params: { phoneme: 'i' },
    order: 2,
  },
  {
    id: 'e-vowel-o',
    lessonId: 'l-vowels-1',
    type: 'sound-grapheme',
    params: { phoneme: 'o' },
    order: 3,
  },
  {
    id: 'e-word-papa',
    lessonId: 'l-vowels-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-papa', itemIds: ['w-papa', 'w-maman', 'w-lapin'] },
    order: 4,
  },
];

/** Tous les items niveau 1 (graphemes + mots). */
export const LEVEL1_ITEMS: PedagogyItem[] = [...LEVEL1_GRAPHEMES, ...LEVEL1_WORDS];
