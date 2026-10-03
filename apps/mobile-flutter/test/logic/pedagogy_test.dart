import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';

void main() {
  group('contenu niveau 1 (identique à packages/core)', () {
    test('3 nœuds, 2 leçons, 4 exercices pour les voyelles, aucun encore pour b/d', () {
      expect(level1Nodes.map((n) => n.title), ['Les voyelles', 'Les sons b / d', 'Les sons p / q']);
      expect(exercisesOf('l-vowels-1').map((e) => e.id), ['e-vowel-a', 'e-vowel-i', 'e-vowel-o', 'e-word-papa']);
      expect(exercisesOf('l-bd-1'), isEmpty);
      expect(firstLessonOf('n-letters-pq'), isNull);
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
      expect(fresh.map((n) => n.status), [NodeStatus.available, NodeStatus.locked, NodeStatus.locked]);
      final after = computeTreeState(level1Nodes, {'n-letters-a': (NodeStatus.mastered, 0.75)});
      expect(after.map((n) => n.status), [NodeStatus.mastered, NodeStatus.available, NodeStatus.locked]);
    });
  });
}
