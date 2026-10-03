import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';
import 'package:natanga_mobile/features/profile.dart';
import 'package:natanga_mobile/features/progress.dart';
import 'package:natanga_mobile/features/reading.dart';

final now = DateTime.utc(2026, 10, 2, 10);

void main() {
  group('lecture', () {
    test('découpe le contenu syllabé', () {
      final p = parseSyllabified('Sou-dain, u-ne lu-ci-ole bril-la au‑des-sus des fou-gè-res.');
      expect(p[0], const Word(['Sou', 'dain'], trailing: ','));
      expect(p[2], const Word(['lu', 'ci', 'ole']));
      expect(p[4], const Word(['au-des', 'sus']));
      expect(p[6], const Word(['fou', 'gè', 'res'], trailing: '.'));
    });

    test('teintes, infobulle, texte complet, progression', () {
      expect([0, 1, 2, 3].map(syllableTone), [SyllableTone.a, SyllableTone.b, SyllableTone.a, SyllableTone.b]);
      expect(const Word(['lu', 'ci', 'ole']).syllableLabel, 'lu · ci · ole');
      expect(passageText([parseSyllabified('Ni-no le pe-tit re-nard.')]), 'Nino le petit renard.');
      expect(progressRatio(6, 10), 0.6);
      expect(progressRatio(12, 10), 1);
      expect(progressRatio(3, 0), 0);
    });
  });

  group('profil', () {
    test('sélection des thèmes', () {
      expect(toggleTheme([ThemeKey.animaux], ThemeKey.science), [ThemeKey.animaux, ThemeKey.science]);
      expect(toggleTheme([ThemeKey.animaux, ThemeKey.science], ThemeKey.animaux), [ThemeKey.science]);
      expect([3, 1, 0].map(selectionLabel), ['3 sélectionnés', '1 sélectionné', 'Aucun thème']);
      expect(canSubmitProfile('lumi', [ThemeKey.animaux]), isTrue);
      expect(canSubmitProfile('lumi', []), isFalse);
      expect(canSubmitProfile(null, [ThemeKey.animaux]), isFalse);
    });
  });

  group('progression hors connexion (mêmes règles que l’API)', () {
    test('maîtrise : ≥ 3 réponses et ≥ 70 %', () {
      expect(isMastered(3, 4), isTrue);
      expect(isMastered(2, 4), isFalse);
      expect(isMastered(2, 2), isFalse);
    });

    test('leçon : gemmes, nœud maîtrisé, événement en file, jamais rétrogradé', () {
      var s = recordLesson(ProgressState.initial, nodeId: 'n-letters-a', lessonId: 'l-vowels-1', correct: 3, total: 4, gems: 35, now: now);
      expect(s.gems, 35);
      expect(s.nodes['n-letters-a']!.mastered, isTrue);
      expect(s.outbox.single.type, 'lesson_completed');
      expect(s.outbox.single.payload['score'], 0.75);
      s = recordLesson(s, nodeId: 'n-letters-a', lessonId: 'l-vowels-1', correct: 0, total: 4, gems: 20, now: now);
      expect(s.nodes['n-letters-a']!.mastered, isTrue);
      expect(s.nodes['n-letters-a']!.bestScore, 0.75);
      expect(computeTreeState(level1Nodes, s.treeProgress)[1].status, NodeStatus.available);
    });

    test('lecture et profil', () {
      expect(readingStars(20, 17), 2);
      expect(readingStars(20, 10), 1);
      var s = recordReading(ProgressState.initial, lessonId: 't', durationSec: 60, wordsRead: 20, correctWords: 18, now: now);
      expect((s.stars, s.readings), (2, 1));
      expect(s.outbox.single.payload, {
        'lessonId': 't',
        'durationSec': 60,
        'wordsRead': 20,
        'correctWords': 18,
        'completed': true,
        'stars': 2,
      });
      s = saveProfile(s, 'noa', [ThemeKey.famille], now: now);
      expect(s.profile!.avatar, 'noa');
      expect(s.outbox.last.type, 'profile_saved');
    });

    test('file d’envoi bornée', () {
      var s = ProgressState.initial;
      for (var i = 0; i < outboxLimit + 5; i++) {
        s = recordReading(s, lessonId: 't$i', durationSec: 1, wordsRead: 1, correctWords: 1, now: now);
      }
      expect(s.outbox.length, outboxLimit);
      expect(s.outbox.first.payload['lessonId'], 't5');
    });

    test('sauvegarde relue à l’identique ; corrompue ou autre schéma → état neuf', () {
      var s = recordLesson(ProgressState.initial, nodeId: 'n-letters-a', lessonId: 'l', correct: 4, total: 4, gems: 40, now: now);
      s = saveProfile(s, 'lumi', [ThemeKey.animaux, ThemeKey.sports], now: now);
      final back = ProgressState.parse(s.toJsonString());
      expect(back.toJsonString(), s.toJsonString());
      expect(ProgressState.parse(null).gems, 0);
      expect(ProgressState.parse('{pas du json').nodes, isEmpty);
      expect(ProgressState.parse('{"version":99,"gems":5}').gems, 0);
    });
  });
}
