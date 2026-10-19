import 'dart:math' as math;

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../design/tokens.dart';
import '../../design/widgets.dart';
import '../../domain/pedagogy.dart';
import '../../domain/tracing.dart';
import '../../state/glyph_mask_provider.dart';

/// Tracé au doigt : l'enfant repasse sur la lettre grise, puis touche « J'ai fini ».
/// « Effacer » recommence ; « Passer » est toujours possible (motricité fine, lecteur d'écran).
class TracingExercise extends ConsumerStatefulWidget {
  const TracingExercise({super.key, required this.exercise, required this.feedback, required this.onSubmit});
  final Exercise exercise;
  final AnswerCheck? feedback;
  final void Function(AnswerCheck check) onSubmit;

  @override
  ConsumerState<TracingExercise> createState() => _TracingExerciseState();
}

class _TracingExerciseState extends ConsumerState<TracingExercise> {
  late final String _label = itemById(widget.exercise.correctItemId ?? '')?.label ?? '';

  /// Traits en coordonnées normalisées (0–1) dans la zone de tracé.
  final List<List<Offset>> _strokes = [];
  bool _checking = false;

  bool get _locked => widget.feedback != null || _checking;

  void _start(Offset local, double box) {
    if (_locked) return;
    setState(() => _strokes.add([_norm(local, box)]));
  }

  void _move(Offset local, double box) {
    if (_locked || _strokes.isEmpty) return;
    setState(() => _strokes.last.add(_norm(local, box)));
  }

  Offset _norm(Offset p, double box) => Offset((p.dx / box).clamp(0, 1), (p.dy / box).clamp(0, 1));

  Future<void> _done() async {
    if (_locked || _strokes.isEmpty) return;
    setState(() => _checking = true);
    final mask = await ref.read(glyphMaskProvider)(_label);
    final score = scoreTrace(mask, [
      for (final s in _strokes) [for (final p in s) (p.dx, p.dy)],
    ]);
    if (!mounted) return;
    setState(() => _checking = false);
    widget.onSubmit(checkTracing(widget.exercise, score));
  }

  void _skip() {
    if (_locked) return;
    widget.onSubmit(AnswerCheck(correct: false, feedback: 'Pas de souci, on continue !', correctId: widget.exercise.correctItemId));
  }

  @override
  Widget build(BuildContext context) {
    final fb = widget.feedback;
    final ink = switch (fb?.correct) {
      true => Palette.teal600,
      false => Palette.amber500,
      null => Palette.indigo500,
    };
    return LayoutBuilder(
      builder: (context, constraints) {
        final box = math.min(constraints.maxWidth, 300.0);
        return Column(
          children: [
            Semantics(
              label: 'Zone de tracé : repasse sur ${_label.length > 1 ? _label : 'la lettre $_label'} avec ton doigt',
              child: RawGestureDetector(
                key: const ValueKey('tracing-canvas'),
                // Le doigt dessine, il ne fait pas défiler la page.
                gestures: {
                  _EagerPanRecognizer: GestureRecognizerFactoryWithHandlers<_EagerPanRecognizer>(
                    _EagerPanRecognizer.new,
                    (r) => r
                      ..onStart = ((d) => _start(d.localPosition, box))
                      ..onUpdate = ((d) => _move(d.localPosition, box)),
                  ),
                },
                child: Container(
                  width: box,
                  height: box,
                  decoration: BoxDecoration(
                    color: Palette.surfaceMuted,
                    borderRadius: BorderRadius.circular(Radii.lg),
                    border: Border.all(color: Palette.borderSlate, width: 2),
                  ),
                  child: CustomPaint(painter: _TracePainter(_label, _strokes, ink)),
                ),
              ),
            ),
            const SizedBox(height: Space.lg),
            Row(
              children: [
                Expanded(
                  child: AppButton(
                    'Effacer',
                    variant: ButtonVariant.outline,
                    onPressed: _locked || _strokes.isEmpty ? null : () => setState(_strokes.clear),
                  ),
                ),
                const SizedBox(width: Space.md),
                Expanded(child: AppButton('J’ai fini', onPressed: _locked || _strokes.isEmpty ? null : _done)),
              ],
            ),
            const SizedBox(height: Space.sm),
            AppButton('Passer', variant: ButtonVariant.ghost, onPressed: _locked ? null : _skip),
          ],
        );
      },
    );
  }
}

/// Reconnaît le glissé dès le premier contact, avant le défilement de la page.
class _EagerPanRecognizer extends PanGestureRecognizer {
  @override
  void addAllowedPointer(PointerDownEvent event) {
    super.addAllowedPointer(event);
    resolve(GestureDisposition.accepted);
  }
}

class _TracePainter extends CustomPainter {
  _TracePainter(this.label, this.strokes, this.ink);
  final String label;
  final List<List<Offset>> strokes;
  final Color ink;

  @override
  void paint(Canvas canvas, Size size) {
    final (glyph, offset) = layoutGlyph(label, size.width, color: Palette.borderSlate);
    glyph.paint(canvas, offset);
    final pen = Paint()
      ..color = ink
      ..strokeWidth = size.width * 0.045
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round
      ..style = PaintingStyle.stroke;
    for (final s in strokes) {
      if (s.length == 1) {
        canvas.drawCircle(s.first.scale(size.width, size.height), pen.strokeWidth / 2, pen..style = PaintingStyle.fill);
        pen.style = PaintingStyle.stroke;
        continue;
      }
      final path = Path()..moveTo(s.first.dx * size.width, s.first.dy * size.height);
      for (final p in s.skip(1)) {
        path.lineTo(p.dx * size.width, p.dy * size.height);
      }
      canvas.drawPath(path, pen);
    }
  }

  // Les traits sont modifiés sur place : on redessine à chaque setState.
  @override
  bool shouldRepaint(_TracePainter old) => true;
}
