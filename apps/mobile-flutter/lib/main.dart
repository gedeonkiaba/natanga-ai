import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'theme/natanga_theme.dart';
import 'router.dart';

/// Point d'entrée de l'application Flutter Natanga.
void main() {
  runApp(const ProviderScope(child: NatangaApp()));
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
