import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'package:natanga_mobile/auth/token_storage.dart';
import 'package:natanga_mobile/main.dart';
import 'package:natanga_mobile/theme/natanga_theme.dart';

/// Application sans stockage plateforme ni réseau (aucun jeton stocké).
Widget testApp() => ProviderScope(
      overrides: [tokenStorageProvider.overrideWithValue(InMemoryTokenStorage())],
      child: const NatangaApp(),
    );

void main() {
  testWidgets('l’accueil affiche le titre et navigue vers l’arbre', (WidgetTester tester) async {
    await tester.pumpWidget(testApp());

    expect(find.text('Natanga'), findsOneWidget);
    expect(find.text('C’est parti !'), findsOneWidget);
    expect(find.textContaining('ne remplace pas un orthophoniste'), findsOneWidget);

    // Taper le CTA → navigation vers l'arbre de compétences.
    await tester.tap(find.text('C’est parti !'));
    await tester.pumpAndSettle();

    expect(find.text('Mon parcours'), findsOneWidget);
    expect(find.text('Les voyelles'), findsOneWidget);
  });

  testWidgets('l’espace parent sans session redirige vers la connexion', (WidgetTester tester) async {
    await tester.pumpWidget(testApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('Espace parent'));
    await tester.pumpAndSettle();

    expect(find.text('Se connecter'), findsWidgets); // titre + bouton
    expect(find.text('Pas encore de compte ? Créer un compte'), findsOneWidget);
  });

  test('le thème clair applique la couleur de fond crème', () {
    final theme = natangaLightTheme();
    expect(theme.scaffoldBackgroundColor, NatangaColors.background);
  });
}
