import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';

void main() {
  group('contenu généré depuis la base de connaissances', () {
    test('6 niveaux, 52 leçons : chaque nœud a une leçon jouable', () {
      expect(curriculumLevels.map((l) => l.name), [
        'Sons et écoute',
        'Lettres et sons',
        'Syllabes',
        'Mots simples',
        'Sons complexes',
        'Phrases et compréhension',
      ]);
      expect(curriculumNodes, hasLength(52));
      expect(curriculumNodes.first.title, 'Le son /a/');
      for (final node in curriculumNodes) {
        final lesson = firstLessonOf(node.id);
        expect(lesson, isNotNull, reason: node.id);
        // La maîtrise exige au moins 3 réponses : chaque leçon peut faire progresser.
        expect(exercisesOf(lesson!.id).length, greaterThanOrEqualTo(3), reason: lesson.id);
      }
      // Déblocage strictement séquentiel.
      expect([for (final n in curriculumNodes) n.unlockedWhen], [for (var i = 0; i < 52; i++) i]);
    });

    test('chaque exercice propose une seule bonne réponse, un seul type de choix, une consigne orale', () {
      for (final e in curriculumExercises) {
        final choices = choicesOf(e);
        expect(choices.length, e.itemIds.length, reason: e.id);
        expect(choices.length, greaterThanOrEqualTo(2), reason: e.id);
        expect(choices.map((c) => c.type).toSet(), hasLength(1), reason: e.id);
        final right = choices.where(
          (c) => e.type == ExerciseType.soundGrapheme ? checkSoundGrapheme(e, curriculumItems, c.id).correct : c.id == e.correctItemId,
        );
        expect(right.length, 1, reason: e.id);
        expect(spokenPrompt(e), isNotEmpty, reason: e.id);
        if (e.type == ExerciseType.soundGrapheme) {
          // Une erreur montre toujours une bonne réponse visible à l'écran.
          final wrong = choices.firstWhere((c) => !checkSoundGrapheme(e, curriculumItems, c.id).correct);
          expect(choices.map((c) => c.id), contains(checkSoundGrapheme(e, curriculumItems, wrong.id).correctId), reason: e.id);
        }
      }
    });

    test('corrections de la base : mot-repère qui contient vraiment le son', () {
      expect(spokenPrompt(exercisesOf('l-son-e').first), 'e, comme dans cheval');
      expect(spokenPrompt(exercisesOf('l-son-an').first), 'an, comme dans maman');
    });

    test('b/d et p/q : seulement les lettres en miroir, avec un mot-repère', () {
      final bd = exercisesOf('l-bd-1');
      expect(choicesOf(bd.first).map((c) => c.label), ['b', 'd']);
      expect(spokenPrompt(bd.first), 'b, comme ballon');
      final q = exercisesOf('l-pq-1')[1];
      expect(spokenPrompt(q), 'q, comme quatre');
      expect(checkSoundGrapheme(q, curriculumItems, 'g-q').correct, isTrue);
      expect(checkSoundGrapheme(q, curriculumItems, 'g-p').feedback, 'Presque ! C’est « q ». On réessaie.');
      expect(spokenPrompt(bd[3]), 'bon');
    });

    test('mots découpés en syllabes pour l’affichage bicolore', () {
      expect(itemById('w-elephant')!.syllables, ['é', 'lé', 'phant']);
      expect(itemById('w-maman')!.syllables, ['ma', 'man']);
    });

    test('sans liste de choix, son ⇄ graphème propose toutes les lettres', () {
      const bare = Exercise(id: 'x', lessonId: 'l', type: ExerciseType.soundGrapheme, phoneme: 'a', order: 1);
      expect(choicesOf(bare).length, curriculumGraphemes.length);
    });
  });

  group('correction (jamais punitive)', () {
    final a = exercisesOf('l-son-a').first;
    final papa = exercisesOf('l-son-a').last;

    test('son ⇄ graphème', () {
      expect(checkSoundGrapheme(a, curriculumItems, 'g-a').feedback, 'Bravo !');
      final wrong = checkSoundGrapheme(a, curriculumItems, 'g-o');
      expect(wrong.correct, isFalse);
      expect(wrong.feedback, 'Presque ! C’est « a ». On réessaie.');
      expect(wrong.correctId, 'g-a');
    });

    test('reconnaissance de mots', () {
      expect(checkWordRecognition(papa, 'w-papa').feedback, 'Bien joué !');
      expect(checkWordRecognition(papa, 'w-pomme').correctId, 'w-papa');
    });
  });

  group('leçon', () {
    test('une réponse par exercice ; l’effort rapporte aussi des gemmes', () {
      final run = LessonRun(exercisesOf('l-son-a'));
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
    test('déblocage séquentiel ; une ancienne progression hors parcours ne débloque rien', () {
      final fresh = computeTreeState(curriculumNodes, {});
      expect(fresh.take(3).map((n) => n.status), [NodeStatus.available, NodeStatus.locked, NodeStatus.locked]);
      final after = computeTreeState(curriculumNodes, {'n-son-a': (NodeStatus.mastered, 0.75)});
      expect(after.take(3).map((n) => n.status), [NodeStatus.mastered, NodeStatus.available, NodeStatus.locked]);
      final legacy = computeTreeState(curriculumNodes, {'n-letters-a': (NodeStatus.mastered, 1)});
      expect(legacy.take(2).map((n) => n.status), [NodeStatus.available, NodeStatus.locked]);
    });
  });
}
