/// Contenu des écrans, repris mot pour mot de la maquette approuvée (identique à
/// l'app Expo `apps/mobile/src/content/demo.ts`). Point unique à brancher sur l'API.
library;

import '../features/profile.dart';
import '../features/reading.dart';

class Child {
  static const label = 'Léo (8 ans)';
}

class Benefit {
  const Benefit(this.icon, this.tone, this.title, this.badge, this.text);
  final String icon;
  final String tone;
  final String title;
  final String badge;
  final String text;
}

class HomeContent {
  static const timeChip = '10 min / jour';
  static const privacyChip = 'Sans pub · Sans micro';
  static const promise = 'Read Joyfully,\nGrow Confidently';
  static const pitch = "L'aventure de lecture sur-mesure pour les enfants dyslexiques et TDAH. Des progrès chaque jour, sans stress.";
  static const streak = '5 jours';
  static const sectionLabel = '3 atouts pour progresser';
  static const benefits = [
    Benefit(
      'type',
      'indigo',
      'Polices adaptées & Syllabes',
      'OpenDyslexic',
      'Espacements optimisés et syllabes bicolores pour éviter la confusion visuelle.',
    ),
    Benefit(
      'volume-2',
      'violet',
      'Aide audio mot à mot',
      'Vitesse douce',
      "Un mot difficile ? Touchez-le pour l'écouter instantanément à voix haute.",
    ),
    Benefit(
      'star',
      'amber',
      'Étoiles & Trésors',
      'Sans échec',
      "Chaque effort est valorisé. Des récompenses positives pour booster l'estime.",
    ),
  ];
  static const storyLabel = 'Histoire du jour';
  static const storyTitle = "Le Mystère de l'Île Bleue";
  static const storyMeta = 'Chapitre 3 · 6 min';
  static const storyReward = '+15 étoiles';
  static const footnoteBefore = 'Conçu sous la guidance bienveillante d’';
  static const footnoteStrong = 'orthophonistes';
}

class AvatarInfo {
  const AvatarInfo(this.key, this.name);
  final String key;
  final String name;
}

class ThemeInfo {
  const ThemeInfo(this.key, this.label, this.emoji, this.tint);
  final ThemeKey key;
  final String label;
  final String emoji;
  final int tint;
}

class ProfileContent {
  static const avatars = [AvatarInfo('lumi', 'Lumi'), AvatarInfo('noa', 'Noa'), AvatarInfo('malo', 'Malo'), AvatarInfo('tobi', 'Tobi')];
  static const themes = [
    ThemeInfo(ThemeKey.animaux, 'Animaux', 'emoji:paw-prints', 0xFFCCFBF1),
    ThemeInfo(ThemeKey.science, 'Science', 'emoji:rocket', 0xFFE0E7FF),
    ThemeInfo(ThemeKey.aventure, 'Aventure', 'emoji:compass', 0xFFFEF3C7),
    ThemeInfo(ThemeKey.fantaisie, 'Fantaisie', 'emoji:sparkles', 0xFFF3E8FF),
    ThemeInfo(ThemeKey.sports, 'Sports', 'emoji:soccer-ball', 0xFFFEE2E2),
    ThemeInfo(ThemeKey.famille, 'Famille', 'emoji:house-with-garden', 0xFFDCFCE7),
  ];
  static const step = 'Étape 2/3';
  static const title = 'Mon Univers de Lecture';
  static const subtitle = 'Choisis ton compagnon et tes histoires favorites.';
  static const avatarLabel = 'Choisis ton avatar';
  static const avatarCount = '4 personnages';
  static const themesLabel = 'Thèmes préférés';
  static const initialAvatar = 'lumi';
  static const initialThemes = [ThemeKey.animaux, ThemeKey.science, ThemeKey.aventure];
  static const infoBefore = 'Police ';
  static const infoStrong = 'Lexend adaptée';
  static const infoAfter = ' activée · 10 min de lecture douce par jour sans stress.';
  static const cta = 'Valider et Commencer';
}

class ReadingContent {
  static const stars = '3 étoiles';
  static const goalDone = 6;
  static const goalTotal = 10;
  static const goalLabel = 'Objectif : 6 min / 10 min';
  static const pageLabel = 'Page 3 sur 5';
  static const story = 'Nino et la forêt dorée · Niv. 2';
  static const untimed = 'Sans chrono';
  static const lessonId = 'nino-foret-doree';
  static final paragraphs = [
    parseSyllabified('Ni-no le pe-tit re-nard mar-chait len-te-ment sur le che-min de mous-se.'),
    parseSyllabified('Sou-dain, u-ne lu-ci-ole bril-la au‑des-sus des fou-gè-res.'),
  ];

  /// Mot mis en avant à l'ouverture, comme sur la maquette (« luciole »).
  static const highlighted = (1, 2);
  static const hintSyllables = 'Syllabes bicolores actives';
  static const hintTap = "Touche un mot pour l'écouter";
  static const listenAll = 'Écouter tout';
  static const done = "J'ai fini !";
}

class Stat {
  const Stat(
    this.icon,
    this.tone,
    this.value,
    this.caption, {
    this.valueEmoji,
    this.captionEmoji,
    this.highlight = false,
    this.filled = true,
  });
  final String icon;
  final String tone;
  final String value;
  final String caption;
  final String? valueEmoji;
  final String? captionEmoji;
  final bool highlight;
  final bool filled;
}

class AchievementContent {
  static const title = 'Bravo champion !';
  static const story = 'Le Mystère de la Forêt Bleue · Ch. 2';
  static const messageBefore = 'Tu as lu avec attention pendant ';
  static const messageStrong = '11 minutes';
  static const messageAfter = '. Ton cerveau de grand lecteur devient de plus en plus fort !';
  static const stats = [
    Stat('star', 'amber', '+3', 'Total : 48', valueEmoji: 'emoji:star'),
    Stat('timer', 'sky', '11 min', 'Objectif : 10 min', filled: false),
    Stat('zap', 'fuchsia', '5 jours', 'Série active', captionEmoji: 'emoji:fire', highlight: true),
  ];
  static const treasureBadge = 'Nouveau trésor';
  static const treasureTitle = 'Insigne “Explorateur Agile”';
  static const treasureText = "Débloque l'avatar Renard Cosmique";
  static const magicLabel = 'Mot magique maîtrisé :';
  static const magicSyllables = ['Ex', 'plo', 'ra', 'teur'];
  static const continueLabel = "Continuer l'aventure";
  static const parentLabel = 'Voir le suivi parent';
  static const parentCode = 'Code';
}
