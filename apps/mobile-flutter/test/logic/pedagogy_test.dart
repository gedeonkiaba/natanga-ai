import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';

void main() {
  group('contenu généré depuis la base de connaissances', () {
    test('7 niveaux, 77 leçons (dont 7 bilans) : chaque nœud a une leçon jouable', () {
      expect(curriculumLevels.map((l) => l.name), [
        'Sons et écoute',
        'Lettres et sons',
        'Syllabes',
        'Mots simples',
        'Sons complexes',
        'Phrases et compréhension',
        'Textes courts',
      ]);
      expect(curriculumNodes, hasLength(77));
      expect(curriculumNodes.first.title, 'Le son /a/');
      for (final node in curriculumNodes) {
        final lesson = firstLessonOf(node.id);
        expect(lesson, isNotNull, reason: node.id);
        // La maîtrise exige au moins 3 réponses : chaque leçon peut faire progresser.
        expect(exercisesOf(lesson!.id).length, greaterThanOrEqualTo(3), reason: lesson.id);
      }
      // Déblocage strictement séquentiel.
      expect([for (final n in curriculumNodes) n.unlockedWhen], [for (var i = 0; i < 77; i++) i]);
    });

    test('chaque exercice propose une seule bonne réponse, un seul type de choix, une consigne orale', () {
      for (final e in curriculumExercises.where((e) => e.type == ExerciseType.soundGrapheme || e.type == ExerciseType.wordRecognition)) {
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

    test('assemblage : les tuiles contiennent les syllabes du mot et une seule syllabe piège', () {
      final assemblies = curriculumExercises.where((e) => e.type == ExerciseType.syllableAssembly).toList();
      expect(assemblies, hasLength(13));
      for (final e in assemblies) {
        final answer = itemById(e.correctItemId!)!.syllables;
        final pool = [for (final t in choicesOf(e)) t.label];
        for (final syl in answer) {
          expect(pool.remove(syl), isTrue, reason: '${e.id} : $syl');
        }
        expect(pool, hasLength(1), reason: e.id);
        expect(answer, isNot(contains(pool.single)), reason: e.id);
        // Jamais déjà dans l'ordre de la réponse.
        expect(choicesOf(e).take(answer.length).map((t) => t.label), isNot(answer), reason: e.id);
      }
      final maman = exercisesOf('l-mot-maman').last;
      expect(spokenPrompt(maman), 'maman');
      expect(checkSyllableAssembly(maman, ['s-ma', 's-man']).feedback, 'Bravo !');
      final wrong = checkSyllableAssembly(maman, ['s-man', 's-ma']);
      expect(wrong.correct, isFalse);
      expect(wrong.feedback, 'Presque ! C’est « ma · man ». On réessaie.');
    });

    test('lis et trouve l’image : texte à lire, images seulement, une bonne réponse', () {
      final matches = curriculumExercises.where((e) => e.type == ExerciseType.pictureMatch).toList();
      expect(matches.length, greaterThanOrEqualTo(20));
      for (final e in matches) {
        expect(itemById(e.textItemId!), isNotNull, reason: e.id);
        expect(choicesOf(e).every((c) => c.image != null), isTrue, reason: e.id);
        expect(e.itemIds.where((id) => id == e.correctItemId), hasLength(1), reason: e.id);
        // La voix ne lit jamais le texte à lire : seulement la consigne.
        expect(spokenPrompt(e), isNot(contains(itemById(e.textItemId!)!.label)), reason: e.id);
      }
      final maman = exercisesOf('l-mot-maman').first;
      expect(maman.type, ExerciseType.pictureMatch, reason: 'lire avant d’entendre');
      expect(checkPictureMatch(maman, 'w-maman').feedback, 'Bravo, tu as bien lu !');
      expect(checkPictureMatch(maman, maman.itemIds.firstWhere((i) => i != 'w-maman')).feedback, 'Presque ! C’est « maman ». On réessaie.');
      final chat = exercisesOf('l-phrase-1')[1];
      expect((chat.question, itemById(chat.textItemId!)!.label, chat.correctItemId), ('Qui dort ?', 'Le chat dort.', 'w-chat'));
    });

    test('bilan à la fin de chaque niveau : 6 exercices revus, sans tracé, sans mot-repère', () {
      for (final level in curriculumLevels) {
        final nodes = nodesOfLevel(level.key);
        expect(nodes.last.id, 'n-bilan-${level.rank}');
        expect(nodes.last.title, 'Bilan : ${level.name}');
        final review = exercisesOf('l-bilan-${level.rank}');
        expect(review, hasLength(6));
        expect(review.any((e) => e.type == ExerciseType.tracing), isFalse);
        expect(review.where((e) => e.cue?.contains('comme') ?? false), isEmpty);
      }
    });

    test('sons ajoutés : jamais d’homophone parmi les choix ; textes courts lus seuls', () {
      // ai/ei, en/an, au/o, ph/f, qu/c, gu/g se prononcent pareil : l'oreille ne peut pas choisir.
      const homophones = [
        {'ai', 'ei', 'è'},
        {'en', 'an'},
        {'au', 'o', 'eau'},
        {'ph', 'f'},
        {'qu', 'c', 'k', 'q'},
        {'gu', 'g'},
      ];
      for (final e in curriculumExercises.where((e) => e.type == ExerciseType.soundGrapheme)) {
        final labels = choicesOf(e).map((c) => c.label).toSet();
        for (final group in homophones) {
          expect(labels.intersection(group).length, lessThanOrEqualTo(1), reason: '${e.id} : $labels');
        }
      }
      expect(spokenPrompt(exercisesOf('l-son-c').first), 'ka, comme dans carotte');
      expect(spokenPrompt(exercisesOf('l-son-gn').last), 'Avec ton doigt, trace les lettres g, n');
      final texte = exercisesOf('l-texte-1');
      expect(texte.map((e) => e.type), [
        ExerciseType.pictureMatch,
        ExerciseType.wordRecognition,
        ExerciseType.pictureMatch,
        ExerciseType.wordRecognition,
      ]);
      expect(itemById(texte.first.textItemId!)!.label, 'Papa a un petit chat. Le chat aime le lait. Il dort sur le lit.');
      expect(texte.first.question, 'Qui a un petit chat ?');
      expect(spokenPrompt(texte.first), 'Lis le texte. Qui a un petit chat ?');
    });

    test('tracé : une lettre par leçon de son, et b/d, p/q', () {
      final traces = curriculumExercises.where((e) => e.type == ExerciseType.tracing).toList();
      expect(traces, hasLength(40));
      expect(spokenPrompt(exercisesOf('l-son-a').last), 'Avec ton doigt, trace la lettre a');
      expect(spokenPrompt(exercisesOf('l-son-ou').last), 'Avec ton doigt, trace les lettres o, u');
      expect(exercisesOf('l-bd-1').last.correctItemId, 'g-d');
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
    final papa = exercisesOf('l-son-a')[3];

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
      final run = LessonRun(exercisesOf('l-son-a').take(4).toList());
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
