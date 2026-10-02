import 'package:flutter/material.dart';
import '../theme/natanga_theme.dart';
import '../widgets/speak_button.dart';

/// Écran de leçon — consigne lisible et audible (TTS), conformément à US-13.
/// Les exercices (son ⇄ graphème, QCM mots) seront câblés ici ensuite.
class LessonScreen extends StatelessWidget {
  final String nodeId;
  const LessonScreen({super.key, required this.nodeId});

  String get _consigne => 'Écoute, puis touche la bonne réponse.';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Leçon')),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.school, size: 48, color: NatangaColors.secondary),
              const SizedBox(height: 16),
              Text(
                'Leçon — nœud « $nodeId »',
                style: Theme.of(context).textTheme.titleLarge,
              ),
              const SizedBox(height: 8),

              // Consigne textuelle + bouton TTS (accessibilité).
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Flexible(
                    child: Text(
                      _consigne,
                      textAlign: TextAlign.center,
                      style: const TextStyle(fontSize: 16),
                    ),
                  ),
                  const SizedBox(width: 8),
                  SpeakButton(text: _consigne),
                ],
              ),

              const SizedBox(height: 16),
              const Text(
                'Les exercices seront câblés ici (son ⇄ graphème, QCM mots).',
                textAlign: TextAlign.center,
                style: TextStyle(color: NatangaColors.textMuted),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
