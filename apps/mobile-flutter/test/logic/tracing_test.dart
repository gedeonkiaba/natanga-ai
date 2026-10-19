import 'package:flutter_test/flutter_test.dart';
import 'package:natanga_mobile/domain/pedagogy.dart';
import 'package:natanga_mobile/domain/tracing.dart';

/// Lettre « l » simplifiée : une barre verticale au centre de la grille 48 × 48.
GlyphMask bar() => GlyphMask(48, [for (var y = 0; y < 48; y++) for (var x = 0; x < 48; x++) x >= 22 && x <= 25 && y >= 6 && y <= 42]);

List<(double, double)> line(double x0, double y0, double x1, double y1) => [
  for (var i = 0; i <= 20; i++) (x0 + (x1 - x0) * i / 20, y0 + (y1 - y0) * i / 20),
];

void main() {
  test('repasser sur la lettre réussit', () {
    final s = scoreTrace(bar(), [line(0.5, 0.13, 0.5, 0.88)]);
    expect(s.coverage, greaterThan(0.9));
    expect(s.precision, 1);
    expect(s.passed, isTrue);
  });

  test('un tracé un peu tremblé et à côté reste accepté (tolérance)', () {
    final wobbly = [for (var i = 0; i <= 30; i++) (0.5 + (i.isEven ? 0.04 : -0.04), 0.14 + 0.72 * i / 30)];
    expect(scoreTrace(bar(), [wobbly]).passed, isTrue);
  });

  test('gribouiller toute la zone échoue (précision)', () {
    final scribble = [for (var row = 0; row < 12; row++) ...line(0, row / 11, 1, row / 11)];
    final s = scoreTrace(bar(), [scribble]);
    expect(s.coverage, greaterThan(0.9));
    expect(s.precision, lessThan(minPrecision));
    expect(s.passed, isFalse);
  });

  test('un petit bout de trait échoue (couverture) ; aucun trait = 0', () {
    expect(scoreTrace(bar(), [line(0.5, 0.13, 0.5, 0.3)]).passed, isFalse);
    expect(scoreTrace(bar(), []).coverage, 0);
  });

  test('retour bienveillant selon ce qui manque', () {
    const ex = Exercise(id: 'x', lessonId: 'l', type: ExerciseType.tracing, order: 1, correctItemId: 'g-l');
    expect(checkTracing(ex, const TraceScore(1, 1)).feedback, 'Bravo, belle lettre !');
    expect(checkTracing(ex, const TraceScore(0.2, 1)).feedback, 'Bel effort ! Repasse sur toute la lettre grise.');
    expect(checkTracing(ex, const TraceScore(0.9, 0.3)).feedback, 'Bel effort ! Reste bien sur la lettre grise.');
  });
}
