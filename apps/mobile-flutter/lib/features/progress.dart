/// Progression de l'enfant, conservée sur l'appareil (fonctionne hors connexion).
///
/// Même modèle et mêmes règles que l'app Expo (`apps/mobile/src/features/progress.ts`)
/// et que l'API. Chaque changement ajoute un événement à la file `outbox`, à envoyer
/// au serveur quand l'app sera reliée à l'API.
library;

import 'dart:convert';

import '../domain/pedagogy.dart';
import 'profile.dart';

/// Règle de l'API (AttemptService) : ≥ 3 réponses et ≥ 70 % de réussite.
const masteryThreshold = 0.7;
const masteryMinAnswers = 3;
const outboxLimit = 500;
const schemaVersion = 1;

bool isMastered(int correct, int total) => total >= masteryMinAnswers && correct / total >= masteryThreshold;

/// Étoiles d'une lecture : 1, +1 si ≥ 80 % de mots lus seul (règle de l'API).
int readingStars(int wordsRead, int correctWords) => 1 + (wordsRead > 0 && correctWords / wordsRead >= 0.8 ? 1 : 0);

class PendingEvent {
  const PendingEvent({required this.id, required this.type, required this.at, required this.payload});
  final String id;
  final String type; // profile_saved | lesson_completed | reading_completed
  final String at;
  final Map<String, Object?> payload;

  Map<String, Object?> toJson() => {'id': id, 'type': type, 'at': at, 'payload': payload};
  static PendingEvent fromJson(Map<String, Object?> j) => PendingEvent(
    id: j['id'] as String,
    type: j['type'] as String,
    at: j['at'] as String,
    payload: Map<String, Object?>.from(j['payload'] as Map),
  );
}

class NodeProgress {
  const NodeProgress(this.mastered, this.bestScore);
  final bool mastered;
  final double bestScore;
}

class SavedProfile {
  const SavedProfile(this.avatar, this.themes);
  final String avatar;
  final List<ThemeKey> themes;
}

class ProgressState {
  const ProgressState({this.profile, this.nodes = const {}, this.gems = 0, this.stars = 0, this.readings = 0, this.outbox = const []});

  final SavedProfile? profile;
  final Map<String, NodeProgress> nodes;
  final int gems;
  final int stars;
  final int readings;
  final List<PendingEvent> outbox;

  static const initial = ProgressState();

  ProgressState copyWith({
    SavedProfile? profile,
    Map<String, NodeProgress>? nodes,
    int? gems,
    int? stars,
    int? readings,
    List<PendingEvent>? outbox,
  }) => ProgressState(
    profile: profile ?? this.profile,
    nodes: nodes ?? this.nodes,
    gems: gems ?? this.gems,
    stars: stars ?? this.stars,
    readings: readings ?? this.readings,
    outbox: outbox ?? this.outbox,
  );

  /// Progression au format de l'arbre de compétences.
  Map<String, (NodeStatus, double)> get treeProgress => {
    for (final e in nodes.entries) e.key: (e.value.mastered ? NodeStatus.mastered : NodeStatus.inProgress, e.value.bestScore),
  };

  String toJsonString() => jsonEncode({
    'version': schemaVersion,
    'profile': profile == null ? null : {'avatar': profile!.avatar, 'themes': profile!.themes.map((t) => t.name).toList()},
    'nodes': {
      for (final e in nodes.entries) e.key: {'status': e.value.mastered ? 'mastered' : 'in_progress', 'bestScore': e.value.bestScore},
    },
    'gems': gems,
    'stars': stars,
    'readings': readings,
    'outbox': outbox.map((e) => e.toJson()).toList(),
  });

  /// Relit une sauvegarde ; absente, corrompue ou d'un autre schéma → état neuf.
  static ProgressState parse(String? raw) {
    if (raw == null || raw.isEmpty) return initial;
    try {
      final j = jsonDecode(raw) as Map<String, Object?>;
      if (j['version'] != schemaVersion) return initial;
      final p = j['profile'] as Map<String, Object?>?;
      return ProgressState(
        profile:
            p == null
                ? null
                : SavedProfile(p['avatar'] as String, [for (final t in p['themes'] as List) ThemeKey.values.byName(t as String)]),
        nodes: {
          for (final e in (j['nodes'] as Map<String, Object?>? ?? {}).entries)
            e.key: NodeProgress((e.value as Map)['status'] == 'mastered', ((e.value as Map)['bestScore'] as num).toDouble()),
        },
        gems: (j['gems'] as num?)?.toInt() ?? 0,
        stars: (j['stars'] as num?)?.toInt() ?? 0,
        readings: (j['readings'] as num?)?.toInt() ?? 0,
        outbox: [for (final e in j['outbox'] as List? ?? []) PendingEvent.fromJson(Map<String, Object?>.from(e as Map))],
      );
    } catch (_) {
      return initial;
    }
  }
}

int _seq = 0;

List<PendingEvent> _enqueue(List<PendingEvent> outbox, String type, Map<String, Object?> payload, DateTime now) {
  _seq++;
  final next = [
    ...outbox,
    PendingEvent(
      id: '${now.millisecondsSinceEpoch.toRadixString(36)}-$_seq',
      type: type,
      at: now.toUtc().toIso8601String(),
      payload: payload,
    ),
  ];
  return next.length > outboxLimit ? next.sublist(next.length - outboxLimit) : next;
}

ProgressState saveProfile(ProgressState s, String avatar, List<ThemeKey> themes, {DateTime? now}) => s.copyWith(
  profile: SavedProfile(avatar, List.unmodifiable(themes)),
  outbox: _enqueue(s.outbox, 'profile_saved', {'avatar': avatar, 'themes': themes.map((t) => t.name).toList()}, now ?? DateTime.now()),
);

/// Fin de leçon : gemmes, nœud « en cours » ou « maîtrisé » (jamais rétrogradé).
ProgressState recordLesson(
  ProgressState s, {
  required String nodeId,
  required String lessonId,
  required int correct,
  required int total,
  required int gems,
  DateTime? now,
}) {
  final score = total > 0 ? correct / total : 0.0;
  final prev = s.nodes[nodeId];
  final mastered = (prev?.mastered ?? false) || isMastered(correct, total);
  final best = prev == null || score > prev.bestScore ? score : prev.bestScore;
  return s.copyWith(
    gems: s.gems + (gems < 0 ? 0 : gems),
    nodes: {...s.nodes, nodeId: NodeProgress(mastered, best)},
    outbox: _enqueue(s.outbox, 'lesson_completed', {
      'nodeId': nodeId,
      'lessonId': lessonId,
      'correct': correct,
      'total': total,
      'gems': gems,
      'score': score,
    }, now ?? DateTime.now()),
  );
}

/// Lecture terminée ; la charge utile correspond au corps de POST /children/{id}/sessions.
ProgressState recordReading(
  ProgressState s, {
  required String lessonId,
  required int durationSec,
  required int wordsRead,
  required int correctWords,
  DateTime? now,
}) {
  final stars = readingStars(wordsRead, correctWords);
  return s.copyWith(
    stars: s.stars + stars,
    readings: s.readings + 1,
    outbox: _enqueue(s.outbox, 'reading_completed', {
      'lessonId': lessonId,
      'durationSec': durationSec,
      'wordsRead': wordsRead,
      'correctWords': correctWords,
      'completed': true,
      'stars': stars,
    }, now ?? DateTime.now()),
  );
}
