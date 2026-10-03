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
  { id: 'w-bon', type: 'word', label: 'bon', phoneme: 'bon' },
  { id: 'w-don', type: 'word', label: 'don', phoneme: 'don' },
  { id: 'w-bebe', type: 'word', label: 'bébé', phoneme: 'bébé' },
  { id: 'w-dodo', type: 'word', label: 'dodo', phoneme: 'dodo' },
  { id: 'w-pomme', type: 'word', label: 'pomme', phoneme: 'pomme' },
  { id: 'w-poule', type: 'word', label: 'poule', phoneme: 'poule' },
  { id: 'w-quatre', type: 'word', label: 'quatre', phoneme: 'quatre' },
  { id: 'w-coq', type: 'word', label: 'coq', phoneme: 'coq' },
];

/** Quatre premiers nœuds de l'arbre (US-05 partiel), chacun avec une leçon jouable. */
export const LEVEL1_NODES: SkillNode[] = [
  { id: 'n-letters-a', level: 'letters', title: 'Les voyelles', order: 1, unlockedWhen: 0 },
  { id: 'n-letters-bd', level: 'letters', title: 'Les sons b / d', order: 2, unlockedWhen: 1 },
  { id: 'n-letters-pq', level: 'letters', title: 'Les sons p / q', order: 3, unlockedWhen: 2 },
  { id: 'n-mots-simples', level: 'words', title: 'Mots simples', order: 4, unlockedWhen: 3 },
];

/** Une leçon par nœud. */
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
  { id: 'l-pq-1', nodeId: 'n-letters-pq', title: 'p ou q ?', durationMin: 6, order: 1 },
  { id: 'l-mots-1', nodeId: 'n-mots-simples', title: 'Lire des mots', durationMin: 6, order: 1 },
];

/**
 * Exercices. Les leçons b/d et p/q travaillent les confusions en miroir : peu de
 * choix (2 puis 3 lettres), un mot-repère dit par la voix, puis des paires de mots
 * qui ne diffèrent que par la lettre travaillée.
 */
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
  // b ou d ?
  {
    id: 'e-bd-b1',
    lessonId: 'l-bd-1',
    type: 'sound-grapheme',
    params: { phoneme: 'b', cue: 'b, comme ballon', itemIds: ['g-b', 'g-d'] },
    order: 1,
  },
  {
    id: 'e-bd-d1',
    lessonId: 'l-bd-1',
    type: 'sound-grapheme',
    params: { phoneme: 'd', cue: 'd, comme doigt', itemIds: ['g-b', 'g-d'] },
    order: 2,
  },
  {
    id: 'e-bd-b2',
    lessonId: 'l-bd-1',
    type: 'sound-grapheme',
    params: { phoneme: 'b', cue: 'b, comme bébé', itemIds: ['g-d', 'g-p', 'g-b'] },
    order: 3,
  },
  {
    id: 'e-bd-bon',
    lessonId: 'l-bd-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-bon', itemIds: ['w-don', 'w-bon'] },
    order: 4,
  },
  {
    id: 'e-bd-dodo',
    lessonId: 'l-bd-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-dodo', itemIds: ['w-bebe', 'w-dodo', 'w-ballon'] },
    order: 5,
  },
  // p ou q ?
  {
    id: 'e-pq-p1',
    lessonId: 'l-pq-1',
    type: 'sound-grapheme',
    params: { phoneme: 'p', cue: 'p, comme papa', itemIds: ['g-p', 'g-q'] },
    order: 1,
  },
  {
    id: 'e-pq-q1',
    lessonId: 'l-pq-1',
    type: 'sound-grapheme',
    params: { phoneme: 'k', cue: 'q, comme quatre', itemIds: ['g-p', 'g-q'] },
    order: 2,
  },
  {
    id: 'e-pq-p2',
    lessonId: 'l-pq-1',
    type: 'sound-grapheme',
    params: { phoneme: 'p', cue: 'p, comme pomme', itemIds: ['g-q', 'g-b', 'g-p'] },
    order: 3,
  },
  {
    id: 'e-pq-quatre',
    lessonId: 'l-pq-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-quatre', itemIds: ['w-pomme', 'w-quatre', 'w-poule'] },
    order: 4,
  },
  {
    id: 'e-pq-coq',
    lessonId: 'l-pq-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-coq', itemIds: ['w-coq', 'w-poule', 'w-papa'] },
    order: 5,
  },
  // Mots simples
  {
    id: 'e-mots-lapin',
    lessonId: 'l-mots-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-lapin', itemIds: ['w-papa', 'w-lapin', 'w-ballon'] },
    order: 1,
  },
  {
    id: 'e-mots-maman',
    lessonId: 'l-mots-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-maman', itemIds: ['w-maman', 'w-pomme', 'w-papa'] },
    order: 2,
  },
  {
    id: 'e-mots-ballon',
    lessonId: 'l-mots-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-ballon', itemIds: ['w-bon', 'w-dodo', 'w-ballon'] },
    order: 3,
  },
  {
    id: 'e-mots-poule',
    lessonId: 'l-mots-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-poule', itemIds: ['w-poule', 'w-coq', 'w-pomme'] },
    order: 4,
  },
  {
    id: 'e-mots-bebe',
    lessonId: 'l-mots-1',
    type: 'word-recognition',
    params: { correctItemId: 'w-bebe', itemIds: ['w-dodo', 'w-papa', 'w-bebe'] },
    order: 5,
  },
];

/** Tous les items niveau 1 (graphemes + mots). */
export const LEVEL1_ITEMS: PedagogyItem[] = [...LEVEL1_GRAPHEMES, ...LEVEL1_WORDS];
