/**
 * Contenu des écrans, repris mot pour mot de la maquette approuvée.
 * Point d'entrée unique pour brancher plus tard l'API (profil, histoires, récompenses).
 */
import type { IconName } from '../design/icons.generated';
import { parseSyllabified, type Paragraph } from '../features/reading';
import type { ThemeKey } from '../features/profile';

export const child = { name: 'Léo', age: 8, label: 'Léo (8 ans)' };

export const home = {
  chips: { time: '10 min / jour', privacy: 'Sans pub · Sans micro' },
  promise: 'Read Joyfully,\nGrow Confidently',
  pitch:
    "L'aventure de lecture sur-mesure pour les enfants dyslexiques et TDAH. Des progrès chaque jour, sans stress.",
  streak: '5 jours',
  sectionLabel: '3 atouts pour progresser',
  benefits: [
    {
      icon: 'type',
      tone: 'indigo',
      title: 'Polices adaptées & Syllabes',
      badge: 'OpenDyslexic',
      text: 'Espacements optimisés et syllabes bicolores pour éviter la confusion visuelle.',
    },
    {
      icon: 'volume-2',
      tone: 'violet',
      title: 'Aide audio mot à mot',
      badge: 'Vitesse douce',
      text: "Un mot difficile ? Touchez-le pour l'écouter instantanément à voix haute.",
    },
    {
      icon: 'star',
      tone: 'amber',
      title: 'Étoiles & Trésors',
      badge: 'Sans échec',
      text: "Chaque effort est valorisé. Des récompenses positives pour booster l'estime.",
    },
  ] as const satisfies ReadonlyArray<{
    icon: IconName;
    tone: 'indigo' | 'violet' | 'amber';
    title: string;
    badge: string;
    text: string;
  }>,
  storyOfTheDay: {
    label: 'Histoire du jour',
    title: "Le Mystère de l'Île Bleue",
    meta: 'Chapitre 3 · 6 min',
    reward: '+15 étoiles',
  },
  footnote: { before: 'Conçu sous la guidance bienveillante d’', strong: 'orthophonistes' },
};

export const avatars = [
  { key: 'lumi', name: 'Lumi' },
  { key: 'noa', name: 'Noa' },
  { key: 'malo', name: 'Malo' },
  { key: 'tobi', name: 'Tobi' },
] as const;

export type AvatarKey = (typeof avatars)[number]['key'];

export const themes: ReadonlyArray<{
  key: ThemeKey;
  label: string;
  emoji: IconName;
  tint: string;
}> = [
  { key: 'animaux', label: 'Animaux', emoji: 'emoji:paw-prints', tint: '#CCFBF1' },
  { key: 'science', label: 'Science', emoji: 'emoji:rocket', tint: '#E0E7FF' },
  { key: 'aventure', label: 'Aventure', emoji: 'emoji:compass', tint: '#FEF3C7' },
  { key: 'fantaisie', label: 'Fantaisie', emoji: 'emoji:sparkles', tint: '#F3E8FF' },
  { key: 'sports', label: 'Sports', emoji: 'emoji:soccer-ball', tint: '#FEE2E2' },
  { key: 'famille', label: 'Famille', emoji: 'emoji:house-with-garden', tint: '#DCFCE7' },
];

export const profileSetup = {
  step: 'Étape 2/3',
  title: 'Mon Univers de Lecture',
  subtitle: 'Choisis ton compagnon et tes histoires favorites.',
  avatarLabel: 'Choisis ton avatar',
  avatarCount: '4 personnages',
  themesLabel: 'Thèmes préférés',
  initialAvatar: 'lumi' as AvatarKey,
  initialThemes: ['animaux', 'science', 'aventure'] as ThemeKey[],
  info: {
    before: 'Police ',
    strong: 'Lexend adaptée',
    after: ' activée · 10 min de lecture douce par jour sans stress.',
  },
  cta: 'Valider et Commencer',
};

export const reading = {
  stars: '3 étoiles',
  goal: { done: 6, total: 10, label: 'Objectif : 6 min / 10 min' },
  page: { current: 3, total: 5, label: 'Page 3 sur 5' },
  story: 'Nino et la forêt dorée · Niv. 2',
  untimed: 'Sans chrono',
  paragraphs: [
    parseSyllabified('Ni-no le pe-tit re-nard mar-chait len-te-ment sur le che-min de mous-se.'),
    parseSyllabified('Sou-dain, u-ne lu-ci-ole bril-la au‑des-sus des fou-gè-res.'),
  ] as Paragraph[],
  /** Mot mis en avant à l'ouverture, comme sur la maquette (« luciole »). */
  highlighted: { paragraph: 1, word: 2 },
  hints: { syllables: 'Syllabes bicolores actives', tap: "Touche un mot pour l'écouter" },
  listenAll: 'Écouter tout',
  done: "J'ai fini !",
};

export const achievement = {
  title: 'Bravo champion !',
  story: 'Le Mystère de la Forêt Bleue · Ch. 2',
  message: {
    before: 'Tu as lu avec attention pendant ',
    strong: '11 minutes',
    after: '. Ton cerveau de grand lecteur devient de plus en plus fort !',
  },
  stats: [
    { icon: 'star', tone: 'amber', value: '+3', valueEmoji: 'emoji:star', caption: 'Total : 48' },
    { icon: 'timer', tone: 'sky', value: '11 min', caption: 'Objectif : 10 min' },
    {
      icon: 'zap',
      tone: 'fuchsia',
      value: '5 jours',
      caption: 'Série active',
      captionEmoji: 'emoji:fire',
      highlight: true,
    },
  ] as const,
  treasure: {
    badge: 'Nouveau trésor',
    title: 'Insigne “Explorateur Agile”',
    text: "Débloque l'avatar Renard Cosmique",
  },
  magicWord: { label: 'Mot magique maîtrisé :', syllables: ['Ex', 'plo', 'ra', 'teur'] },
  continue: "Continuer l'aventure",
  parent: { label: 'Voir le suivi parent', code: 'Code' },
};
