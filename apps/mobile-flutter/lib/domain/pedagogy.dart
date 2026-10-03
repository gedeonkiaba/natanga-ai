/// Moteur pédagogique — portage fidèle de `packages/core/src/pedagogy` (TypeScript).
///
/// Arbre de compétences (US-05), leçons (US-06), exercices son ⇄ graphème (US-07)
/// et reconnaissance de mots (US-08), récompenses d'effort. Logique pure, sans I/O.
library;

part 'curriculum.g.dart';

enum ExerciseType { soundGrapheme, wordRecognition }

enum NodeStatus { locked, available, inProgress, mastered }

/// Niveau du parcours (base de connaissances `content/curriculum/niveaux.csv`).
class CurriculumLevel {
  const CurriculumLevel({required this.rank, required this.key, required this.name, required this.objective});
  final int rank;
  final String key;
  final String name;
  final String objective;
}

class SkillNode {
  const SkillNode({required this.id, required this.level, required this.title, required this.order, required this.unlockedWhen});
  final String id;

  /// Clé du niveau (`CurriculumLevel.key`).
  final String level;
  final String title;
  final int order;

  /// Nombre de nœuds maîtrisés requis pour débloquer celui-ci.
  final int unlockedWhen;
}

class Lesson {
  const Lesson({required this.id, required this.nodeId, required this.title, this.objective = '', required this.durationMin});
  final String id;
  final String nodeId;
  final String title;
  final String objective;
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

enum ItemType { grapheme, syllable, word, sentence }

class PedagogyItem {
  const PedagogyItem({required this.id, required this.type, required this.label, required this.phoneme, this.syllables = const []});
  final String id;
  final ItemType type;
  final String label;
  final String phoneme;

  /// Découpage syllabique (mots : « ma », « man ») pour l'affichage bicolore.
  final List<String> syllables;
}

// --- Contenu : généré depuis content/curriculum/*.csv (voir curriculum.g.dart) ---

List<PedagogyItem> get curriculumGraphemes => curriculumItems.where((i) => i.type == ItemType.grapheme).toList();

/// Nœuds d'un niveau, dans l'ordre du parcours.
List<SkillNode> nodesOfLevel(String levelKey) => curriculumNodes.where((n) => n.level == levelKey).toList();

Lesson? firstLessonOf(String nodeId) {
  for (final l in curriculumLessons) {
    if (l.nodeId == nodeId) return l;
  }
  return null;
}

List<Exercise> exercisesOf(String lessonId) =>
    curriculumExercises.where((e) => e.lessonId == lessonId).toList()..sort((a, b) => a.order.compareTo(b.order));

PedagogyItem? itemById(String id) => curriculumItems.where((i) => i.id == id).firstOrNull;

/// Choix affichés : ceux de l'exercice, sinon toutes les lettres (son ⇄ graphème).
List<PedagogyItem> choicesOf(Exercise exercise) {
  if (exercise.itemIds.isEmpty && exercise.type == ExerciseType.soundGrapheme) {
    return curriculumGraphemes;
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
  // Les nœuds retirés du parcours (progression d'une ancienne version) ne comptent pas.
  final ids = {for (final n in nodes) n.id};
  final mastered = progress.entries.where((e) => ids.contains(e.key) && e.value.$1 == NodeStatus.mastered).length;
  return [
    for (final n in ordered)
      if (progress[n.id] case final p?)
        NodeState(n, p.$1, p.$2)
      else
        NodeState(n, mastered >= n.unlockedWhen ? NodeStatus.available : NodeStatus.locked, 0),
  ];
}
