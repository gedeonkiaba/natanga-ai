import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:natanga_mobile/auth/token_storage.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';
import 'package:natanga_mobile/domain/tracing.dart';
import 'package:natanga_mobile/features/progress.dart';
import 'package:natanga_mobile/main.dart';
import 'package:natanga_mobile/services/tts_service.dart';
import 'package:natanga_mobile/state/glyph_mask_provider.dart';
import 'package:natanga_mobile/state/progress_controller.dart';
import 'package:natanga_mobile/state/tts_provider.dart';
import 'package:natanga_mobile/theme/natanga_theme.dart';

/// Synthèse vocale factice : enregistre ce qui serait lu à voix haute.
class FakeTts implements TtsService {
  final spoken = <String>[];
  @override
  Future<void> speak(String text) async => spoken.add(text);
  @override
  Future<void> stop() async {}
}

/// Application sans réseau ni stockage plateforme : stockage local simulé (persistant
/// entre deux « lancements » du test), aucun jeton parent.
Future<(Widget, FakeTts, SharedPreferences)> testApp({SharedPreferences? prefs}) async {
  if (prefs == null) SharedPreferences.setMockInitialValues({});
  final p = prefs ?? await SharedPreferences.getInstance();
  final tts = FakeTts();
  return (
    ProviderScope(
      overrides: [
        tokenStorageProvider.overrideWithValue(InMemoryTokenStorage()),
        sharedPreferencesProvider.overrideWithValue(p),
        ttsServiceProvider.overrideWithValue(tts),
        // Lettre modèle simplifiée (barre verticale) : notation du tracé déterministe en test.
        glyphMaskProvider.overrideWithValue((_) async => verticalBar),
      ],
      child: const NatangaApp(),
    ),
    tts,
    p,
  );
}

Future<void> phone(WidgetTester tester) async {
  tester.view.physicalSize = const Size(430 * 3, 932 * 3);
  tester.view.devicePixelRatio = 3;
  addTearDown(tester.view.reset);
}

final verticalBar = GlyphMask(48, [for (var y = 0; y < 48; y++) for (var x = 0; x < 48; x++) x >= 22 && x <= 25 && y >= 6 && y <= 42]);

/// Repasse au doigt sur la barre verticale de la zone de tracé.
Future<void> traceBar(WidgetTester tester) async {
  final canvas = find.byKey(const ValueKey('tracing-canvas'));
  await tester.ensureVisible(canvas);
  final box = tester.getRect(canvas);
  final gesture = await tester.startGesture(Offset(box.center.dx, box.top + box.height * 0.14));
  for (var i = 1; i <= 20; i++) {
    await gesture.moveTo(Offset(box.center.dx, box.top + box.height * (0.14 + 0.72 * i / 20)));
  }
  await gesture.up();
  await tester.pump();
}

Finder sem(String label) => find.bySemanticsLabel(label);

Future<void> tapSem(WidgetTester tester, String label) async {
  await tester.ensureVisible(sem(label).first);
  await tester.tap(sem(label).first);
  await tester.pumpAndSettle();
}

/// Libellé accessible d'une carte de leçon de « Mon parcours » (« Le son /a/ — Disponible »).
Future<String> nodeLabel(WidgetTester tester, String title) async {
  final finder = find.bySemanticsLabel(RegExp('^${RegExp.escape(title)} — '));
  await tester.ensureVisible(finder);
  return tester.getSemantics(finder).label;
}

/// Progression où les [count] premières leçons du parcours sont maîtrisées.
String masteredFirst(int count) {
  var s = ProgressState.initial;
  for (final n in curriculumNodes.take(count)) {
    s = recordLesson(s, nodeId: n.id, lessonId: firstLessonOf(n.id)!.id, correct: 4, total: 4, gems: 40);
  }
  return s.toJsonString();
}

Future<void> answer(WidgetTester tester, String label) async {
  await tapSem(tester, label);
  await tester.pump(feedbackDurationForTests);
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('accueil de la maquette et navigation vers « Mon parcours »', (tester) async {
    await phone(tester);
    final (app, _, _) = await testApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();

    expect(find.text('Read Joyfully,\nGrow Confidently'), findsOneWidget);
    expect(find.text('Polices adaptées & Syllabes'), findsOneWidget);
    expect(find.textContaining('orthophonistes', findRichText: true), findsOneWidget);

    await tapSem(tester, 'Bibliothèque');
    expect(find.text('Mon parcours'), findsOneWidget);
    expect(find.text('Niveau 1 · Sons et écoute'), findsOneWidget);
    expect(await nodeLabel(tester, 'Le son /a/'), 'Le son /a/ — Disponible');
    expect(await nodeLabel(tester, 'Le son /e/'), 'Le son /e/ — Verrouillé');
    // Niveaux pas encore atteints : repliés (en-tête seulement).
    expect(find.text('Niveau 6 · Phrases et compréhension'), findsOneWidget);
    expect(find.text('Le son /m/'), findsNothing);
  });

  testWidgets('l’espace parent sans session redirige vers la connexion', (tester) async {
    await phone(tester);
    final (app, _, _) = await testApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();

    await tapSem(tester, 'Espace Parent');

    expect(find.text('Se connecter'), findsWidgets); // titre + bouton
    expect(find.text('Pas encore de compte ? Créer un compte'), findsOneWidget);
  });

  testWidgets('leçon complète hors connexion : retour lisible, une réponse comptée, progression conservée au redémarrage', (tester) async {
    await phone(tester);
    final (app, tts, prefs) = await testApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');

    expect(find.text('Le son /a/'), findsOneWidget);
    expect(find.text('Reconnaître, entendre, associer et tracer le son /a/.'), findsOneWidget);
    expect(tts.spoken, ['a, comme dans avion']); // la consigne est dite à l'arrivée de l'exercice
    await tapSem(tester, 'Réécouter le son');
    expect(tts.spoken, ['a, comme dans avion', 'a, comme dans avion']);
    expect(sem('Choisir la lettre i'), findsNothing); // seulement a et la lettre voisine o

    // Mauvaise réponse : le retour s'affiche sur l'exercice en cours ; une 2ᵉ touche est ignorée.
    await tester.tap(sem('Choisir la lettre o'));
    await tester.pump();
    await tester.tap(sem('Choisir la lettre a'));
    await tester.pump();
    expect(find.text('Presque ! C’est « a ». On réessaie.'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    expect(find.text('Presque ! C’est « a ». On réessaie.'), findsNothing);

    expect(find.text('Écoute, puis touche le mot entendu :'), findsOneWidget);
    expect(tts.spoken.last, 'avion');
    await answer(tester, 'Choisir le mot avion');
    expect(tts.spoken.last, 'a');
    await answer(tester, 'Choisir la lettre a');
    expect(tts.spoken.last, 'papa');
    await answer(tester, 'Choisir le mot papa');

    // Tracé : « J'ai fini » attend un premier trait ; repasser sur la lettre réussit.
    expect(find.text('Avec ton doigt, repasse sur la lettre grise :'), findsOneWidget);
    expect(tts.spoken.last, 'Avec ton doigt, trace la lettre a');
    expect(tester.getSemantics(sem('J’ai fini')), isSemantics(isButton: true, hasEnabledState: true, isEnabled: false));
    await traceBar(tester);
    await tapSem(tester, 'J’ai fini');
    expect(find.text('Bravo, belle lettre !'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();

    expect(find.text('Leçon terminée !'), findsOneWidget);
    expect(find.text('4 bonnes réponses sur 5.'), findsOneWidget);
    await tapSem(tester, 'Continuer');
    expect(await nodeLabel(tester, 'Le son /a/'), 'Le son /a/ — Terminé');
    expect(await nodeLabel(tester, 'Le son /e/'), 'Le son /e/ — Disponible');

    final saved = ProgressState.parse(prefs.getString(progressStorageKey));
    expect(saved.gems, 45);
    expect(saved.outbox.map((e) => e.type), ['lesson_completed']);

    // « Redémarrage » : nouvelle app, même stockage → le parcours est intact.
    final (app2, _, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(app2);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    expect(await nodeLabel(tester, 'Le son /a/'), 'Le son /a/ — Terminé');
  });

  testWidgets('leçon miroir « b ou d ? » en fin de niveau 2 : 2 lettres, mot-repère dit, suite débloquée', (tester) async {
    await phone(tester);
    final bd = curriculumNodes.indexWhere((n) => n.id == 'n-letters-bd');
    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(bd)});
    final prefs = await SharedPreferences.getInstance();
    final (app, tts, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    expect(await nodeLabel(tester, 'b ou d ?'), 'b ou d ? — Disponible');
    await tapSem(tester, 'Commencer'); // seule leçon « Disponible »

    expect(find.text('b ou d ?'), findsOneWidget);
    expect(tts.spoken.last, 'b, comme ballon');
    expect(sem('Choisir la lettre a'), findsNothing);

    // Confusion b/d : retour bienveillant qui montre la bonne lettre.
    await tapSem(tester, 'Choisir la lettre d');
    expect(find.text('Presque ! C’est « b ». On réessaie.'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();

    expect(tts.spoken.last, 'd, comme doigt');
    await answer(tester, 'Choisir la lettre d');
    await answer(tester, 'Choisir la lettre b');
    expect(tts.spoken.last, 'bon');
    await answer(tester, 'Choisir le mot bon');
    await answer(tester, 'Choisir le mot dodo');
    expect(tts.spoken.last, 'Avec ton doigt, trace la lettre d');
    await traceBar(tester);
    await answer(tester, 'J’ai fini');

    expect(find.text('5 bonnes réponses sur 6.'), findsOneWidget);
    await tapSem(tester, 'Continuer');
    expect(await nodeLabel(tester, 'b ou d ?'), 'b ou d ? — Terminé');
    expect(await nodeLabel(tester, 'p ou q ?'), 'p ou q ? — Disponible');
  });

  testWidgets('syllabes : inversion « ma / am » ; phrases : une par ligne', (tester) async {
    await phone(tester);
    final ma = curriculumNodes.indexWhere((n) => n.id == 'n-syl-ma');
    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(ma)});
    var prefs = await SharedPreferences.getInstance();
    var (app, tts, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');

    expect(find.text('Écoute, puis touche la syllabe entendue :'), findsOneWidget);
    expect(tts.spoken.last, 'ma, comme dans maman');
    await answer(tester, 'Choisir la syllabe ma');
    expect(sem('Choisir la syllabe am'), findsOneWidget); // inversion, confusion fréquente
    await answer(tester, 'Choisir la syllabe ma');

    final phrase = curriculumNodes.indexWhere((n) => n.id == 'n-phrase-1');
    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(phrase)});
    prefs = await SharedPreferences.getInstance();
    (app, tts, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');

    expect(find.text('Écoute, puis touche la phrase entendue :'), findsOneWidget);
    expect(tts.spoken.last, 'Le chat dort.');
    final first = tester.getTopLeft(find.text('Le chat dort.'));
    final second = tester.getTopLeft(find.text('Papa lit un livre.'));
    expect(second.dy, greaterThan(first.dy)); // empilées, pas côte à côte
    await answer(tester, 'Choisir la phrase Le chat dort.');
    // Compréhension : lire la phrase, répondre en image (la voix ne lit pas la phrase).
    expect(find.text('Qui dort ?'), findsOneWidget);
    expect(tts.spoken.last, 'Lis la phrase. Qui dort ?');
    await answer(tester, 'Image : chat');
    expect(tts.spoken.last, 'chat');
    expect(sem('Choisir le mot dort'), findsOneWidget);
  });

  testWidgets('assemblage « ma-man » : on retire une syllabe, piège « am », bonne réponse', (tester) async {
    await phone(tester);
    final maman = curriculumNodes.indexWhere((n) => n.id == 'n-mot-maman');
    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(maman)});
    final prefs = await SharedPreferences.getInstance();
    final (app, tts, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');
    // D'abord lire seul : la voix dit la consigne, pas le mot.
    expect(find.text('Lis le mot, puis touche la bonne image :'), findsOneWidget);
    expect(tts.spoken.last, 'Lis le mot, puis touche la bonne image.');
    expect(sem('Mot à lire : maman'), findsOneWidget);
    await tapSem(tester, 'Image : maison');
    expect(find.text('Presque ! C’est « maman ». On réessaie.'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    for (var i = 0; i < 3; i++) {
      await answer(tester, 'Choisir le mot maman');
    }

    expect(find.text('Écoute, puis remets les syllabes dans l’ordre :'), findsOneWidget);
    expect(tts.spoken.last, 'maman');
    expect(sem('Ajouter la syllabe am'), findsOneWidget); // syllabe piège (inversion)
    await tapSem(tester, 'Ajouter la syllabe man');
    expect(sem('Case 1 : man, toucher pour retirer'), findsOneWidget);
    await tapSem(tester, 'Case 1 : man, toucher pour retirer');
    expect(sem('Case 1 vide'), findsOneWidget);
    await tapSem(tester, 'Ajouter la syllabe ma');
    await tapSem(tester, 'Ajouter la syllabe man');
    expect(find.text('Bravo !'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    expect(find.text('4 bonnes réponses sur 5.'), findsOneWidget);
  });

  testWidgets('assemblage dans le désordre : la bonne réponse est montrée ; tracé : « Passer » toujours possible', (tester) async {
    await phone(tester);
    final ma = curriculumNodes.indexWhere((n) => n.id == 'n-syl-ma');
    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(ma)});
    var prefs = await SharedPreferences.getInstance();
    var (app, _, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');
    for (final l in ['ma', 'ma', 'ma']) {
      await answer(tester, 'Choisir la syllabe $l');
    }
    await answer(tester, 'Choisir le mot maman');
    await answer(tester, 'Image : maman');
    await tapSem(tester, 'Ajouter la syllabe man');
    await tapSem(tester, 'Ajouter la syllabe ma');
    expect(find.text('Presque ! C’est « ma · man ». On réessaie.'), findsOneWidget);
    expect(tester.getSemantics(sem('Case 1 : man')), isSemantics(label: 'Case 1 : man')); // figé pendant le retour
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    expect(find.text('5 bonnes réponses sur 6.'), findsOneWidget);

    SharedPreferences.setMockInitialValues({progressStorageKey: masteredFirst(0)});
    prefs = await SharedPreferences.getInstance();
    (app, _, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer');
    for (final label in ['Choisir la lettre a', 'Choisir le mot avion', 'Choisir la lettre a', 'Choisir le mot papa']) {
      await answer(tester, label);
    }
    await tapSem(tester, 'Passer');
    expect(find.text('Pas de souci, on continue !'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    expect(find.text('4 bonnes réponses sur 5.'), findsOneWidget);
  });

  testWidgets('la vraie lettre est dessinée hors écran pour noter le tracé', (tester) async {
    final font = FontLoader('Lexend')..addFont(rootBundle.load('assets/fonts/Lexend_500Medium.ttf'));
    await tester.runAsync(() async {
      await font.load();
      final o = await rasterizeGlyph('o');
      final l = await rasterizeGlyph('l');
      expect(o.at(24, 26), isFalse, reason: 'le centre du « o » est vide');
      expect(o.cells.where((c) => c).length, inInclusiveRange(150, 700));
      // Un trait vertical au milieu suit le « l » ; il ne suit pas le « o ».
      final down = [for (var i = 0; i <= 20; i++) (0.5, 0.1 + 0.8 * i / 20)];
      expect(scoreTrace(l, [down]).passed, isTrue);
      expect(scoreTrace(o, [down]).passed, isFalse);
    });
  });

  testWidgets('profil puis lecture : choix enregistrés, mot touché lu à voix haute, succès', (tester) async {
    await phone(tester);
    final (app, tts, prefs) = await testApp();
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();

    await tapSem(tester, 'Léo (8 ans), modifier le profil');
    expect(find.text('Mon Univers de Lecture'), findsOneWidget);
    expect(tester.getSemantics(sem('Lumi')), isSemantics(isChecked: true));
    await tapSem(tester, 'Noa');
    await tapSem(tester, 'Famille');
    expect(find.text('4 sélectionnés'), findsOneWidget);
    await tapSem(tester, 'Valider et Commencer');

    expect(find.text('Nino et la forêt dorée · Niv. 2'), findsOneWidget);
    expect(find.text('lu · ci · ole'), findsOneWidget); // mot mis en avant, comme la maquette
    await tapSem(tester, 'renard');
    expect(tts.spoken.last, 'renard');
    expect(find.text('re · nard'), findsOneWidget);
    await tapSem(tester, "J'ai fini !");
    await tester.pump(const Duration(seconds: 3));
    expect(find.text('Bravo champion !'), findsOneWidget);

    final saved = ProgressState.parse(prefs.getString(progressStorageKey));
    expect(saved.profile!.avatar, 'noa');
    expect(saved.profile!.themes.map((t) => t.name), ['animaux', 'science', 'aventure', 'famille']);
    expect((saved.readings, saved.stars), (1, 2)); // 1 mot touché sur 21 → ≥ 80 % → 2 étoiles
    expect(saved.outbox.map((e) => e.type), ['profile_saved', 'reading_completed']);
  });

  test('le thème clair applique la couleur de fond crème et la police embarquée', () {
    final theme = natangaLightTheme();
    expect(theme.scaffoldBackgroundColor, NatangaColors.background);
    expect(theme.textTheme.bodyMedium?.fontFamily, 'Lexend');
  });
}

const feedbackDurationForTests = Duration(milliseconds: 1250);
