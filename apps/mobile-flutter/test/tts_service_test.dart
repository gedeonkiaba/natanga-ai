import 'package:flutter_test/flutter_test.dart';
import 'package:mocktail/mocktail.dart';
import 'package:flutter_tts/flutter_tts.dart';
import 'package:natanga_mobile/services/tts_service.dart';

/// Mock du moteur flutter_tts sous-jacent.
class MockFlutterTts extends Mock implements FlutterTts {}

void main() {
  late MockFlutterTts mockTts;
  late FlutterTtsService service;

  setUp(() {
    mockTts = MockFlutterTts();
    // Les méthodes de configuration retournent des Future<dynamic>.
    when(() => mockTts.setLanguage(any())).thenAnswer((_) async => 1);
    when(() => mockTts.setSpeechRate(any())).thenAnswer((_) async => 1);
    when(() => mockTts.setVolume(any())).thenAnswer((_) async => 1);
    when(() => mockTts.setPitch(any())).thenAnswer((_) async => 1);

    service = FlutterTtsService(tts: mockTts);
  });

  test('parle un texte en français', () async {
    when(() => mockTts.speak(any())).thenAnswer((_) async => 1);
    await service.speak('bonjour');
    verify(() => mockTts.speak('bonjour')).called(1);
  });

  test('arrête la lecture', () async {
    when(() => mockTts.stop()).thenAnswer((_) async => 1);
    await service.stop();
    verify(() => mockTts.stop()).called(1);
  });

  test('applique la langue française à la construction', () {
    verify(() => mockTts.setLanguage('fr-FR')).called(1);
    verify(() => mockTts.setSpeechRate(0.45)).called(1);
  });
}
