import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/tts_service.dart';

/// Provider du service TTS (injectable, remplaçable en test).
final ttsServiceProvider = Provider<TtsService>((ref) => FlutterTtsService());
