import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'router.dart';
import 'state/progress_controller.dart';
import 'theme/natanga_theme.dart';

/// Point d'entrée : charge la progression sauvegardée sur l'appareil (hors connexion)
/// avant d'afficher l'app.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  runApp(ProviderScope(overrides: [sharedPreferencesProvider.overrideWithValue(prefs)], child: const NatangaApp()));
}

class NatangaApp extends ConsumerWidget {
  const NatangaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'Natanga',
      debugShowCheckedModeBanner: false,
      theme: natangaLightTheme(),
      routerConfig: ref.watch(routerProvider),
    );
  }
}
