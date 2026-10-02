import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../state/tts_provider.dart';
import '../theme/natanga_theme.dart';

/// Bouton de synthèse vocale — lit un texte de consigne à voix haute.
/// Accessible : `Semantics(label:)`, cible tactile ≥ 44px.
class SpeakButton extends ConsumerWidget {
  final String text;
  final String? semanticLabel;
  final IconData icon;
  final VoidCallback? onSpoken;

  const SpeakButton({
    super.key,
    required this.text,
    this.semanticLabel,
    this.icon = Icons.volume_up,
    this.onSpoken,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tts = ref.read(ttsServiceProvider);
    final label = semanticLabel ?? 'Écouter la consigne';

    return Semantics(
      label: label,
      button: true,
      child: IconButton(
        iconSize: 32,
        icon: Icon(icon, color: NatangaColors.secondary),
        tooltip: label,
        onPressed: () async {
          await tts.speak(text);
          onSpoken?.call();
        },
        style: IconButton.styleFrom(
          minimumSize: const Size(48, 48),
          padding: const EdgeInsets.all(12),
        ),
      ),
    );
  }
}
