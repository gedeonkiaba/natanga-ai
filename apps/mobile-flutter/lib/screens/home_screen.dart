import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../router.dart';
import '../theme/natanga_theme.dart';

/// Écran d'accueil — reprend la maquette texte (docs/05) : compagnon, badges,
/// CTA unique, disclaimer orthophoniste.
class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.auto_stories, size: 64, color: NatangaColors.secondary),
              const SizedBox(height: 16),
              Text(
                'Natanga',
                textAlign: TextAlign.center,
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),
              const Text(
                'Apprendre à lire et à écrire, à son rythme.',
                textAlign: TextAlign.center,
                style: TextStyle(color: NatangaColors.textMuted, fontSize: 16),
              ),
              const SizedBox(height: 32),
              FilledButton(
                onPressed: () => context.go(Routes.tree),
                child: const Text('C’est parti !'),
              ),
              const SizedBox(height: 12),
              TextButton(
                onPressed: () => context.go(Routes.parent),
                child: const Text('Espace parent'),
              ),
              const SizedBox(height: 32),
              const Text(
                'Cette application entraîne et soutient ; elle ne remplace pas '
                'un orthophoniste.',
                textAlign: TextAlign.center,
                style: TextStyle(color: NatangaColors.textMuted, fontSize: 12),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
