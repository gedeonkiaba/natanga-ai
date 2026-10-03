import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';

void main() {
  group('contenu (identique à packages/core)', () {
    test('4 nœuds, chacun avec une leçon jouable', () {
      expect(level1Nodes.map((n) => n.title), ['Les voyelles', 'Les sons b / d', 'Les sons p / q', 'Mots simples']);
      expect(exercisesOf('l-vowels-1').map((e) => e.id), ['e-vowel-a', 'e-vowel-i', 'e-vowel-o', 'e-word-papa']);
      for (final node in level1Nodes) {
        final lesson = firstLessonOf(node.id);
        expect(lesson, isNotNull, reason: node.id);
        // La maîtrise exige au moins 3 réponses : chaque leçon peut faire progresser.
        expect(exercisesOf(lesson!.id).length, greaterThanOrEqualTo(3), reason: lesson.id);
      }
    });

    test('chaque exercice propose sa bonne réponse parmi des choix existants', () {
      for (final e in level1Exercises) {
        final choices = choicesOf(e);
        expect(choices.length, e.itemIds.isEmpty ? level1Graphemes.length : e.itemIds.length, reason: e.id);
        expect(choices.length, greaterThanOrEqualTo(2), reason: e.id);
        final right = choices.where((c) => e.type == ExerciseType.soundGrapheme ? checkSoundGrapheme(e, level1Items, c.id).correct : c.id == e.correctItemId);
        expect(right.length, 1, reason: e.id);
        expect(spokenPrompt(e), isNotEmpty, reason: e.id);
      }
    });

    test('b/d et p/q : seulement les lettres en miroir, avec un mot-repère', () {
      final bd = exercisesOf('l-bd-1');
      expect(choicesOf(bd.first).map((c) => c.label), ['b', 'd']);
      expect(spokenPrompt(bd.first), 'b, comme ballon');
      final q = exercisesOf('l-pq-1')[1];
      expect(spokenPrompt(q), 'q, comme quatre');
      expect(checkSoundGrapheme(q, level1Items, 'g-q').correct, isTrue);
      expect(checkSoundGrapheme(q, level1Items, 'g-p').feedback, 'Presque ! C’est « q ». On réessaie.');
      // Reconnaissance de mots : la voix dit le mot à trouver.
      expect(spokenPrompt(bd[3]), 'bon');
      expect(choicesOf(bd[3]).map((c) => c.label), ['don', 'bon']);
    });

    test('voyelles : sans liste de choix, toutes les lettres', () {
      expect(choicesOf(exercisesOf('l-vowels-1').first).length, level1Graphemes.length);
    });
  });

  group('correction (jamais punitive)', () {
    final a = exercisesOf('l-vowels-1').first;
    final papa = exercisesOf('l-vowels-1').last;

    test('son ⇄ graphème', () {
      expect(checkSoundGrapheme(a, level1Items, 'g-a').feedback, 'Bravo !');
      final wrong = checkSoundGrapheme(a, level1Items, 'g-o');
      expect(wrong.correct, isFalse);
      expect(wrong.feedback, 'Presque ! C’est « a ». On réessaie.');
      expect(wrong.correctId, 'g-a');
      // « q » se prononce /k/ : correspondance par phonème.
      final q = Exercise(id: 'x', lessonId: 'l', type: ExerciseType.soundGrapheme, phoneme: 'k', order: 1);
      expect(checkSoundGrapheme(q, level1Items, 'g-q').correct, isTrue);
    });

    test('reconnaissance de mots', () {
      expect(checkWordRecognition(papa, 'w-papa').feedback, 'Bien joué !');
      expect(checkWordRecognition(papa, 'w-lapin').correctId, 'w-papa');
    });
  });

  group('leçon', () {
    test('une réponse par exercice ; l’effort rapporte aussi des gemmes', () {
      final run = LessonRun(exercisesOf('l-vowels-1'));
      expect(run.answer(false), isFalse);
      expect(run.answer(true), isFalse);
      expect(run.answer(true), isFalse);
      expect(run.answer(true), isTrue);
      expect(run.answer(true), isTrue); // réponse en trop ignorée
      final r = run.result;
      expect((r.correct, r.total, r.gems, r.score), (3, 4, 35, 0.75));
    });

    test('une leçon vide est terminée d’emblée sans exercice courant', () {
      final run = LessonRun(const []);
      expect(run.current, isNull);
      expect(run.answer(true), isFalse);
    });
  });

  group('arbre', () {
    test('déblocage séquentiel selon le nombre de nœuds maîtrisés', () {
      final fresh = computeTreeState(level1Nodes, {});
      expect(fresh.map((n) => n.status), [NodeStatus.available, NodeStatus.locked, NodeStatus.locked, NodeStatus.locked]);
      final after = computeTreeState(level1Nodes, {'n-letters-a': (NodeStatus.mastered, 0.75)});
      expect(after.map((n) => n.status), [NodeStatus.mastered, NodeStatus.available, NodeStatus.locked, NodeStatus.locked]);
    });
  });
}
