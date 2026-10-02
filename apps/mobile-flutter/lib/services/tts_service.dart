import 'package:flutter_tts/flutter_tts.dart';

/// Abstraction de synthèse vocale (TTS).
///
/// Sépare le contrat de l'implémentation `flutter_tts` afin de permettre
/// le test unitaire sans moteur natif (mock).
abstract class TtsService {
  /// Lit un texte à voix haute (français par défaut).
  Future<void> speak(String text);

  /// Arrête la lecture courante.
  Future<void> stop();
}

/// Implémentation réelle via `flutter_tts` (iOS/Android).
class FlutterTtsService implements TtsService {
  final FlutterTts _tts;

  FlutterTtsService({FlutterTts? tts}) : _tts = tts ?? FlutterTts() {
    // Configuration : langue française, débit adapté aux enfants.
    _tts.setLanguage('fr-FR');
    _tts.setSpeechRate(0.45); // débit ralenti, plus lisible pour les DYS
    _tts.setVolume(1.0);
    _tts.setPitch(1.0);
  }

  @override
  Future<void> speak(String text) => _tts.speak(text);

  @override
  Future<void> stop() => _tts.stop();
}
