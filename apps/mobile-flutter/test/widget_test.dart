import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:natanga_mobile/auth/token_storage.dart';
import 'package:natanga_mobile/features/progress.dart';
import 'package:natanga_mobile/main.dart';
import 'package:natanga_mobile/services/tts_service.dart';
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

Finder sem(String label) => find.bySemanticsLabel(label);

Future<void> tapSem(WidgetTester tester, String label) async {
  await tester.ensureVisible(sem(label).first);
  await tester.tap(sem(label).first);
  await tester.pumpAndSettle();
}

List<String> nodeLabels(WidgetTester tester) => [
  for (final n in ['Les voyelles', 'Les sons b / d', 'Les sons p / q']) tester.getSemantics(find.bySemanticsLabel(RegExp('^$n — '))).label,
];

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
    expect(nodeLabels(tester), ['Les voyelles — Disponible', 'Les sons b / d — Verrouillé', 'Les sons p / q — Verrouillé']);
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

    expect(find.text('Écouter les voyelles'), findsOneWidget);
    await tapSem(tester, 'Écouter le son a');
    expect(tts.spoken, ['a']);

    // Mauvaise réponse : le retour s'affiche sur l'exercice en cours ; une 2ᵉ touche est ignorée.
    await tester.tap(sem('Choisir la lettre o'));
    await tester.pump();
    await tester.tap(sem('Choisir la lettre i'));
    await tester.pump();
    expect(find.text('Presque ! C’est « a ». On réessaie.'), findsOneWidget);
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();
    expect(find.text('Presque ! C’est « a ». On réessaie.'), findsNothing);

    for (final l in ['i', 'o']) {
      await tester.tap(sem('Choisir la lettre $l'));
      await tester.pump(feedbackDurationForTests);
      await tester.pumpAndSettle();
    }
    expect(find.text('Touche le bon mot :'), findsOneWidget);
    await tester.tap(sem('Choisir le mot papa'));
    await tester.pump(feedbackDurationForTests);
    await tester.pumpAndSettle();

    expect(find.text('Leçon terminée !'), findsOneWidget);
    expect(find.text('3 bonnes réponses sur 4.'), findsOneWidget);
    await tapSem(tester, 'Continuer');
    expect(nodeLabels(tester), ['Les voyelles — Terminé', 'Les sons b / d — Disponible', 'Les sons p / q — Verrouillé']);

    final saved = ProgressState.parse(prefs.getString(progressStorageKey));
    expect(saved.gems, 35);
    expect(saved.outbox.map((e) => e.type), ['lesson_completed']);

    // « Redémarrage » : nouvelle app, même stockage → le parcours est intact.
    final (app2, _, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(const SizedBox());
    await tester.pumpWidget(app2);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    expect(nodeLabels(tester).first, 'Les voyelles — Terminé');
  });

  testWidgets('la leçon « b ou d ? » sans exercice n’est jamais une impasse', (tester) async {
    await phone(tester);
    SharedPreferences.setMockInitialValues({
      progressStorageKey:
          recordLesson(ProgressState.initial, nodeId: 'n-letters-a', lessonId: 'l-vowels-1', correct: 4, total: 4, gems: 40).toJsonString(),
    });
    final prefs = await SharedPreferences.getInstance();
    final (app, _, _) = await testApp(prefs: prefs);
    await tester.pumpWidget(app);
    await tester.pumpAndSettle();
    await tapSem(tester, 'Bibliothèque');
    await tapSem(tester, 'Commencer'); // seul nœud « Disponible » : b / d

    expect(find.text('Cette leçon arrive bientôt. Reviens vite !'), findsOneWidget);
    await tapSem(tester, 'Retour au parcours');
    expect(find.text('Mon parcours'), findsOneWidget);
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
