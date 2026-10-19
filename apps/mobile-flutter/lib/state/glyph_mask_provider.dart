import 'dart:ui' as ui;

import 'package:flutter/painting.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../design/tokens.dart';
import '../domain/tracing.dart';

/// Résolution de la grille de notation du tracé.
const glyphMaskSize = 48;

/// Met en page la lettre modèle, centrée dans un carré de côté [box] : même calcul pour
/// l'affichage et pour la grille de notation, qui se superposent exactement.
(TextPainter, Offset) layoutGlyph(String label, double box, {Color color = Palette.indigo100}) {
  TextPainter paint(double fontSize) => TextPainter(
    text: TextSpan(text: label, style: TextStyle(fontFamily: 'Lexend', fontWeight: FontWeight.w500, fontSize: fontSize, height: 1, color: color)),
    textDirection: TextDirection.ltr,
  )..layout();
  var painter = paint(box * 0.78);
  if (painter.width > box * 0.86) painter = paint(box * 0.78 * box * 0.86 / painter.width);
  return (painter, Offset((box - painter.width) / 2, (box - painter.height) / 2));
}

/// Grille de la lettre, obtenue en dessinant la lettre hors écran (alpha > ½ = dans la lettre).
Future<GlyphMask> rasterizeGlyph(String label) async {
  const scale = 4;
  const px = glyphMaskSize * scale;
  final recorder = ui.PictureRecorder();
  final (painter, offset) = layoutGlyph(label, px.toDouble(), color: const Color(0xFF000000));
  painter.paint(Canvas(recorder), offset);
  final image = await recorder.endRecording().toImage(px, px);
  final bytes = (await image.toByteData(format: ui.ImageByteFormat.rawRgba))!;
  image.dispose();
  final cells = List<bool>.filled(glyphMaskSize * glyphMaskSize, false);
  for (var cy = 0; cy < glyphMaskSize; cy++) {
    for (var cx = 0; cx < glyphMaskSize; cx++) {
      var alpha = 0;
      for (var y = 0; y < scale; y++) {
        for (var x = 0; x < scale; x++) {
          alpha += bytes.getUint8(((cy * scale + y) * px + cx * scale + x) * 4 + 3);
        }
      }
      cells[cy * glyphMaskSize + cx] = alpha / (scale * scale) > 127;
    }
  }
  return GlyphMask(glyphMaskSize, cells);
}

final _cache = <String, Future<GlyphMask>>{};

/// Fournit la grille d'une lettre (mise en cache). Remplaçable en test.
final glyphMaskProvider = Provider<Future<GlyphMask> Function(String label)>(
  (ref) => (label) => _cache.putIfAbsent(label, () => rasterizeGlyph(label)),
);
