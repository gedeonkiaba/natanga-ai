/// Tracé au doigt : évaluation pure (sans Flutter), testable.
///
/// La lettre modèle est ramenée à une grille de `size × size` cases (`GlyphMask`).
/// Le tracé de l'enfant (points normalisés entre 0 et 1) est jugé sur deux critères :
/// - **couverture** : part de la lettre que le doigt a parcourue ;
/// - **précision** : part du tracé restée près de la lettre (pas de gribouillage).
/// Les seuils sont volontairement bienveillants : un enfant dyspraxique doit pouvoir réussir.
library;

import 'dart:math' as math;

import 'pedagogy.dart';

/// Couverture minimale de la lettre pour réussir.
const minCoverage = 0.5;

/// Précision minimale du tracé pour réussir.
const minPrecision = 0.6;

/// Tolérance autour du trait, en cases de la grille.
const traceTolerance = 3;

class GlyphMask {
  GlyphMask(this.size, this.cells) : assert(cells.length == size * size);
  final int size;

  /// `true` si la case appartient à la lettre, ligne par ligne.
  final List<bool> cells;

  bool at(int x, int y) => x >= 0 && y >= 0 && x < size && y < size && cells[y * size + x];
}

class TraceScore {
  const TraceScore(this.coverage, this.precision);
  final double coverage;
  final double precision;
  bool get passed => coverage >= minCoverage && precision >= minPrecision;
}

/// Note un tracé : [strokes] = traits successifs, points en coordonnées normalisées (0–1).
TraceScore scoreTrace(GlyphMask mask, List<List<(double, double)>> strokes, {int tolerance = traceTolerance}) {
  final n = mask.size;
  // Points du tracé échantillonnés tous les ½ case, traits interpolés.
  final samples = <(int, int)>[];
  for (final stroke in strokes) {
    for (var i = 0; i < stroke.length; i++) {
      final (x1, y1) = stroke[i];
      final (x0, y0) = i == 0 ? stroke[i] : stroke[i - 1];
      final steps = math.max(1, (math.max((x1 - x0).abs(), (y1 - y0).abs()) * n * 2).ceil());
      for (var s = i == 0 ? 0 : 1; s <= steps; s++) {
        final t = s / steps;
        samples.add((((x0 + (x1 - x0) * t) * n).floor().clamp(0, n - 1), ((y0 + (y1 - y0) * t) * n).floor().clamp(0, n - 1)));
      }
    }
  }
  if (samples.isEmpty) return const TraceScore(0, 0);

  // Zone parcourue par le doigt, élargie de la tolérance.
  final covered = List<bool>.filled(n * n, false);
  for (final (x, y) in samples) {
    for (var dy = -tolerance; dy <= tolerance; dy++) {
      for (var dx = -tolerance; dx <= tolerance; dx++) {
        final cx = x + dx, cy = y + dy;
        if (dx * dx + dy * dy <= tolerance * tolerance && cx >= 0 && cy >= 0 && cx < n && cy < n) covered[cy * n + cx] = true;
      }
    }
  }
  var inside = 0, reached = 0;
  for (var i = 0; i < n * n; i++) {
    if (mask.cells[i]) {
      inside++;
      if (covered[i]) reached++;
    }
  }

  bool nearGlyph(int x, int y) {
    for (var dy = -tolerance; dy <= tolerance; dy++) {
      for (var dx = -tolerance; dx <= tolerance; dx++) {
        if (dx * dx + dy * dy <= tolerance * tolerance && mask.at(x + dx, y + dy)) return true;
      }
    }
    return false;
  }

  final onGlyph = samples.where((p) => nearGlyph(p.$1, p.$2)).length;
  return TraceScore(inside == 0 ? 0 : reached / inside, onGlyph / samples.length);
}

/// Retour bienveillant pour un tracé.
AnswerCheck checkTracing(Exercise exercise, TraceScore score) => score.passed
    ? AnswerCheck(correct: true, feedback: 'Bravo, belle lettre !', correctId: exercise.correctItemId)
    : AnswerCheck(
        correct: false,
        feedback: score.coverage < minCoverage ? 'Bel effort ! Repasse sur toute la lettre grise.' : 'Bel effort ! Reste bien sur la lettre grise.',
        correctId: exercise.correctItemId,
      );
