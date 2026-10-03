/// Moteur pédagogique — portage fidèle de `packages/core/src/pedagogy` (TypeScript).
///
/// Arbre de compétences (US-05), leçons (US-06), exercices son ⇄ graphème (US-07)
/// et reconnaissance de mots (US-08), récompenses d'effort. Logique pure, sans I/O.
library;

enum ExerciseType { soundGrapheme, wordRecognition }

enum NodeStatus { locked, available, inProgress, mastered }

class SkillNode {
  const SkillNode({required this.id, required this.title, required this.order, required this.unlockedWhen});
  final String id;
  final String title;
  final int order;

  /// Nombre de nœuds maîtrisés requis pour débloquer celui-ci.
  final int unlockedWhen;
}

class Lesson {
  const Lesson({required this.id, required this.nodeId, required this.title, required this.durationMin});
  final String id;
  final String nodeId;
  final String title;
  final int durationMin;
}

class Exercise {
  const Exercise({
    required this.id,
    required this.lessonId,
    required this.type,
    required this.order,
    this.phoneme,
    this.cue,
    this.correctItemId,
    this.itemIds = const [],
  });
  final String id;
  final String lessonId;
  final ExerciseType type;
  final int order;

  /// Son ⇄ graphème : le phonème attendu.
  final String? phoneme;

  /// Son ⇄ graphème : ce que dit la voix (« b, comme ballon ») ; à défaut, le phonème.
  final String? cue;

  /// Reconnaissance de mots : la bonne réponse.
  final String? correctItemId;

  /// Choix proposés. Vide pour son ⇄ graphème = toutes les lettres.
  final List<String> itemIds;
}

enum ItemType { grapheme, word }

class PedagogyItem {
  const PedagogyItem({required this.id, required this.type, required this.label, required this.phoneme});
  final String id;
  final ItemType type;
  final String label;
  final String phoneme;
}

// --- Contenu (identique à packages/core/src/pedagogy/content.ts) ---
//
// Les leçons b/d et p/q travaillent les confusions en miroir typiques de la
// dyslexie : peu de choix (2 puis 3 lettres), un mot-repère dit par la voix,
// puis des paires de mots qui ne diffèrent que par la lettre travaillée.

const level1Graphemes = [
  PedagogyItem(id: 'g-a', type: ItemType.grapheme, label: 'a', phoneme: 'a'),
  PedagogyItem(id: 'g-i', type: ItemType.grapheme, label: 'i', phoneme: 'i'),
  PedagogyItem(id: 'g-o', type: ItemType.grapheme, label: 'o', phoneme: 'o'),
  PedagogyItem(id: 'g-b', type: ItemType.grapheme, label: 'b', phoneme: 'b'),
  PedagogyItem(id: 'g-d', type: ItemType.grapheme, label: 'd', phoneme: 'd'),
  PedagogyItem(id: 'g-p', type: ItemType.grapheme, label: 'p', phoneme: 'p'),
  PedagogyItem(id: 'g-q', type: ItemType.grapheme, label: 'q', phoneme: 'k'),
];

const level1Words = [
  PedagogyItem(id: 'w-papa', type: ItemType.word, label: 'papa', phoneme: 'papa'),
  PedagogyItem(id: 'w-maman', type: ItemType.word, label: 'maman', phoneme: 'maman'),
  PedagogyItem(id: 'w-lapin', type: ItemType.word, label: 'lapin', phoneme: 'lapin'),
  PedagogyItem(id: 'w-ballon', type: ItemType.word, label: 'ballon', phoneme: 'ballon'),
  PedagogyItem(id: 'w-doigt', type: ItemType.word, label: 'doigt', phoneme: 'doigt'),
  PedagogyItem(id: 'w-bon', type: ItemType.word, label: 'bon', phoneme: 'bon'),
  PedagogyItem(id: 'w-don', type: ItemType.word, label: 'don', phoneme: 'don'),
  PedagogyItem(id: 'w-bebe', type: ItemType.word, label: 'bébé', phoneme: 'bébé'),
  PedagogyItem(id: 'w-dodo', type: ItemType.word, label: 'dodo', phoneme: 'dodo'),
  PedagogyItem(id: 'w-pomme', type: ItemType.word, label: 'pomme', phoneme: 'pomme'),
  PedagogyItem(id: 'w-poule', type: ItemType.word, label: 'poule', phoneme: 'poule'),
  PedagogyItem(id: 'w-quatre', type: ItemType.word, label: 'quatre', phoneme: 'quatre'),
  PedagogyItem(id: 'w-coq', type: ItemType.word, label: 'coq', phoneme: 'coq'),
];

const level1Items = [...level1Graphemes, ...level1Words];

const level1Nodes = [
  SkillNode(id: 'n-letters-a', title: 'Les voyelles', order: 1, unlockedWhen: 0),
  SkillNode(id: 'n-letters-bd', title: 'Les sons b / d', order: 2, unlockedWhen: 1),
  SkillNode(id: 'n-letters-pq', title: 'Les sons p / q', order: 3, unlockedWhen: 2),
  SkillNode(id: 'n-mots-simples', title: 'Mots simples', order: 4, unlockedWhen: 3),
];

const level1Lessons = [
  Lesson(id: 'l-vowels-1', nodeId: 'n-letters-a', title: 'Écouter les voyelles', durationMin: 6),
  Lesson(id: 'l-bd-1', nodeId: 'n-letters-bd', title: 'b ou d ?', durationMin: 6),
  Lesson(id: 'l-pq-1', nodeId: 'n-letters-pq', title: 'p ou q ?', durationMin: 6),
  Lesson(id: 'l-mots-1', nodeId: 'n-mots-simples', title: 'Lire des mots', durationMin: 6),
];

const _sg = ExerciseType.soundGrapheme;
const _wr = ExerciseType.wordRecognition;

const level1Exercises = [
  // Les voyelles
  Exercise(id: 'e-vowel-a', lessonId: 'l-vowels-1', type: _sg, phoneme: 'a', order: 1),
  Exercise(id: 'e-vowel-i', lessonId: 'l-vowels-1', type: _sg, phoneme: 'i', order: 2),
  Exercise(id: 'e-vowel-o', lessonId: 'l-vowels-1', type: _sg, phoneme: 'o', order: 3),
  Exercise(id: 'e-word-papa', lessonId: 'l-vowels-1', type: _wr, correctItemId: 'w-papa', itemIds: ['w-papa', 'w-maman', 'w-lapin'], order: 4),
  // b ou d ?
  Exercise(id: 'e-bd-b1', lessonId: 'l-bd-1', type: _sg, phoneme: 'b', cue: 'b, comme ballon', itemIds: ['g-b', 'g-d'], order: 1),
  Exercise(id: 'e-bd-d1', lessonId: 'l-bd-1', type: _sg, phoneme: 'd', cue: 'd, comme doigt', itemIds: ['g-b', 'g-d'], order: 2),
  Exercise(id: 'e-bd-b2', lessonId: 'l-bd-1', type: _sg, phoneme: 'b', cue: 'b, comme bébé', itemIds: ['g-d', 'g-p', 'g-b'], order: 3),
  Exercise(id: 'e-bd-bon', lessonId: 'l-bd-1', type: _wr, correctItemId: 'w-bon', itemIds: ['w-don', 'w-bon'], order: 4),
  Exercise(id: 'e-bd-dodo', lessonId: 'l-bd-1', type: _wr, correctItemId: 'w-dodo', itemIds: ['w-bebe', 'w-dodo', 'w-ballon'], order: 5),
  // p ou q ?
  Exercise(id: 'e-pq-p1', lessonId: 'l-pq-1', type: _sg, phoneme: 'p', cue: 'p, comme papa', itemIds: ['g-p', 'g-q'], order: 1),
  Exercise(id: 'e-pq-q1', lessonId: 'l-pq-1', type: _sg, phoneme: 'k', cue: 'q, comme quatre', itemIds: ['g-p', 'g-q'], order: 2),
  Exercise(id: 'e-pq-p2', lessonId: 'l-pq-1', type: _sg, phoneme: 'p', cue: 'p, comme pomme', itemIds: ['g-q', 'g-b', 'g-p'], order: 3),
  Exercise(id: 'e-pq-quatre', lessonId: 'l-pq-1', type: _wr, correctItemId: 'w-quatre', itemIds: ['w-pomme', 'w-quatre', 'w-poule'], order: 4),
  Exercise(id: 'e-pq-coq', lessonId: 'l-pq-1', type: _wr, correctItemId: 'w-coq', itemIds: ['w-coq', 'w-poule', 'w-papa'], order: 5),
  // Mots simples
  Exercise(id: 'e-mots-lapin', lessonId: 'l-mots-1', type: _wr, correctItemId: 'w-lapin', itemIds: ['w-papa', 'w-lapin', 'w-ballon'], order: 1),
  Exercise(id: 'e-mots-maman', lessonId: 'l-mots-1', type: _wr, correctItemId: 'w-maman', itemIds: ['w-maman', 'w-pomme', 'w-papa'], order: 2),
  Exercise(id: 'e-mots-ballon', lessonId: 'l-mots-1', type: _wr, correctItemId: 'w-ballon', itemIds: ['w-bon', 'w-dodo', 'w-ballon'], order: 3),
  Exercise(id: 'e-mots-poule', lessonId: 'l-mots-1', type: _wr, correctItemId: 'w-poule', itemIds: ['w-poule', 'w-coq', 'w-pomme'], order: 4),
  Exercise(id: 'e-mots-bebe', lessonId: 'l-mots-1', type: _wr, correctItemId: 'w-bebe', itemIds: ['w-dodo', 'w-papa', 'w-bebe'], order: 5),
];

Lesson? firstLessonOf(String nodeId) {
  for (final l in level1Lessons) {
    if (l.nodeId == nodeId) return l;
  }
  return null;
}

List<Exercise> exercisesOf(String lessonId) =>
    level1Exercises.where((e) => e.lessonId == lessonId).toList()..sort((a, b) => a.order.compareTo(b.order));

PedagogyItem? itemById(String id) => level1Items.where((i) => i.id == id).firstOrNull;

/// Choix affichés : ceux de l'exercice, sinon toutes les lettres (son ⇄ graphème).
List<PedagogyItem> choicesOf(Exercise exercise) {
  if (exercise.itemIds.isEmpty && exercise.type == ExerciseType.soundGrapheme) {
    return level1Items.where((i) => i.type == ItemType.grapheme).toList();
  }
  return exercise.itemIds.map(itemById).whereType<PedagogyItem>().toList();
}

/// Ce que la voix dit pour poser la question : le son (ou son mot-repère), ou le mot à trouver.
String spokenPrompt(Exercise exercise) => switch (exercise.type) {
  ExerciseType.soundGrapheme => exercise.cue ?? exercise.phoneme ?? '',
  ExerciseType.wordRecognition => itemById(exercise.correctItemId ?? '')?.phoneme ?? '',
};

// --- Correction (jamais punitive) ---

class AnswerCheck {
  const AnswerCheck({required this.correct, required this.feedback, this.correctId});
  final bool correct;
  final String feedback;
  final String? correctId;
}

AnswerCheck checkSoundGrapheme(Exercise exercise, List<PedagogyItem> items, String chosenId) {
  final phoneme = exercise.phoneme;
  final chosen = items.where((i) => i.id == chosenId).firstOrNull;
  final correct = chosen != null && (chosen.phoneme == phoneme || chosen.label == phoneme);
  if (correct) return AnswerCheck(correct: true, feedback: 'Bravo !', correctId: chosenId);
  final right = items.where((i) => i.phoneme == phoneme).firstOrNull;
  return AnswerCheck(correct: false, feedback: 'Presque ! C’est « ${right?.label ?? phoneme} ». On réessaie.', correctId: right?.id);
}

AnswerCheck checkWordRecognition(Exercise exercise, String chosenId) {
  if (chosenId == exercise.correctItemId) {
    return AnswerCheck(correct: true, feedback: 'Bien joué !', correctId: chosenId);
  }
  return AnswerCheck(
    correct: false,
    feedback: 'Pas tout à fait. Regarde bien les lettres, on réessaie.',
    correctId: exercise.correctItemId,
  );
}

// --- Récompenses : l'effort est récompensé aussi ---

const gemsSuccess = 10;
const gemsEffort = 5;

int gemsForAnswer(bool isCorrect) => isCorrect ? gemsSuccess : gemsEffort;

// --- Session de leçon ---

class LessonResult {
  const LessonResult({required this.total, required this.correct, required this.gems});
  final int total;
  final int correct;
  final int gems;
  double get score => total == 0 ? 0 : correct / total;
}

/// Déroulé d'une leçon : une réponse par exercice, dans l'ordre.
class LessonRun {
  LessonRun(List<Exercise> exercises) : exercises = List.unmodifiable(exercises);
  final List<Exercise> exercises;
  int _index = 0;
  int _correct = 0;
  int _gems = 0;
  bool _finished = false;

  Exercise? get current => _finished || exercises.isEmpty ? null : exercises[_index];
  int get answered => _finished ? exercises.length : _index;
  int get correct => _correct;
  int get gems => _gems;
  bool get finished => _finished;

  /// Enregistre la réponse à l'exercice courant ; retourne `true` si la leçon est finie.
  bool answer(bool isCorrect) {
    if (_finished || exercises.isEmpty) return _finished;
    if (isCorrect) _correct++;
    _gems += gemsForAnswer(isCorrect);
    if (_index >= exercises.length - 1) {
      _finished = true;
    } else {
      _index++;
    }
    return _finished;
  }

  LessonResult get result => LessonResult(total: exercises.length, correct: _correct, gems: _gems);
}

// --- Arbre de compétences ---

class NodeState {
  const NodeState(this.node, this.status, this.bestScore);
  final SkillNode node;
  final NodeStatus status;
  final double bestScore;
}

/// Statut de chaque nœud : progression connue, sinon déblocage séquentiel.
List<NodeState> computeTreeState(List<SkillNode> nodes, Map<String, (NodeStatus, double)> progress) {
  final ordered = [...nodes]..sort((a, b) => a.order.compareTo(b.order));
  final mastered = progress.values.where((p) => p.$1 == NodeStatus.mastered).length;
  return [
    for (final n in ordered)
      if (progress[n.id] case final p?)
        NodeState(n, p.$1, p.$2)
      else
        NodeState(n, mastered >= n.unlockedWhen ? NodeStatus.available : NodeStatus.locked, 0),
  ];
}
