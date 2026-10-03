/// Avatars des personnages (ourson, hibou, souris, robot) et confettis doux.
library;

import 'dart:math' as math;

import 'package:flutter/material.dart';

import 'tokens.dart';
import 'widgets.dart';

class _Look {
  const _Look(this.outer, this.inner, this.body, this.detail);
  final Color outer, inner, body, detail;
}

const _looks = {
  'lumi': _Look(Color(0xFFFEF3C7), Color(0xFFFDE68A), Color(0xFFF59E0B), Color(0xFF7C2D12)),
  'noa': _Look(Color(0xFFE0E7FF), Color(0xFFC7D2FE), Color(0xFF818CF8), Color(0xFF1E1B4B)),
  'malo': _Look(Color(0xFFDCFCE7), Color(0xFFBBF7D0), Color(0xFF86EFAC), Color(0xFF14532D)),
  'tobi': _Look(Color(0xFFFCE7F3), Color(0xFFFBCFE8), Color(0xFFEC4899), Color(0xFF831843)),
};

/// Dessin vectoriel du personnage (repère 48 × 48, identique à l'app Expo).
class _CharacterPainter extends CustomPainter {
  _CharacterPainter(this.kind);
  final String kind;

  @override
  void paint(Canvas canvas, Size size) {
    final c = _looks[kind]!;
    canvas.scale(size.width / 48);
    Paint p(Color col) => Paint()..color = col;
    void circle(double x, double y, double r, Color col) => canvas.drawCircle(Offset(x, y), r, p(col));
    circle(24, 24, 24, c.outer);
    circle(24, 24, 16, c.inner);
    switch (kind) {
      case 'lumi': // ourson souriant
        circle(17, 17, 4.5, c.body);
        circle(31, 17, 4.5, c.body);
        circle(24, 26, 10.5, c.body);
        circle(20.2, 24, 1.4, c.detail);
        circle(27.8, 24, 1.4, c.detail);
        canvas.drawOval(Rect.fromCenter(center: const Offset(24, 28.4), width: 4, height: 2.8), p(c.detail));
        canvas.drawPath(
          Path()
            ..moveTo(20.5, 30.5)
            ..quadraticBezierTo(24, 34, 27.5, 30.5),
          Paint()
            ..color = c.detail
            ..style = PaintingStyle.stroke
            ..strokeWidth = 1.5
            ..strokeCap = StrokeCap.round,
        );
      case 'noa': // hibou aux grands yeux
        canvas.drawPath(
          Path()
            ..moveTo(15, 18)
            ..lineTo(18, 13)
            ..lineTo(21, 17)
            ..close()
            ..moveTo(33, 18)
            ..lineTo(30, 13)
            ..lineTo(27, 17)
            ..close(),
          p(c.body),
        );
        canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(14, 15, 20, 20), const Radius.circular(10)), p(c.body));
        circle(20, 24, 4.2, Palette.white);
        circle(28, 24, 4.2, Palette.white);
        circle(20, 24, 2, c.detail);
        circle(28, 24, 2, c.detail);
        canvas.drawPath(
          Path()
            ..moveTo(22.5, 28.5)
            ..lineTo(24, 31)
            ..lineTo(25.5, 28.5)
            ..close(),
          p(Palette.amber500),
        );
      case 'malo': // souris aux oreilles rondes
        circle(16.5, 17.5, 5, const Color(0xFF34D399));
        circle(31.5, 17.5, 5, const Color(0xFF34D399));
        circle(24, 26, 10, c.body);
        circle(20.5, 24.5, 1.5, c.detail);
        circle(27.5, 24.5, 1.5, c.detail);
        canvas.drawOval(Rect.fromCenter(center: const Offset(24, 28.6), width: 3.6, height: 2.6), p(c.detail));
      default: // tobi, petit robot
        canvas.drawLine(
          const Offset(24, 12),
          const Offset(24, 17),
          Paint()
            ..color = c.body
            ..strokeWidth = 2
            ..strokeCap = StrokeCap.round,
        );
        circle(24, 11.5, 2, c.body);
        canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(15.5, 17, 17, 15), const Radius.circular(4.5)), p(c.body));
        circle(20.5, 23.5, 2, Palette.white);
        circle(27.5, 23.5, 2, Palette.white);
        canvas.drawRRect(RRect.fromRectAndRadius(const Rect.fromLTWH(20, 27.5, 8, 1.8), const Radius.circular(0.9)), p(c.detail));
    }
  }

  @override
  bool shouldRepaint(_CharacterPainter old) => old.kind != kind;
}

/// Avatar rond ; anneau teal + coche quand il est choisi.
class Avatar extends StatelessWidget {
  const Avatar(this.kind, {super.key, this.size = 58, this.selected = false});
  final String kind;
  final double size;
  final bool selected;

  @override
  Widget build(BuildContext context) => SizedBox(
    width: size + 8,
    height: size + 8,
    child: Stack(
      alignment: Alignment.center,
      children: [
        Container(
          width: size + 8,
          height: size + 8,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: selected ? Palette.teal50 : Colors.transparent,
            border: selected ? Border.all(color: Palette.teal600, width: 3) : null,
          ),
        ),
        CustomPaint(size: Size.square(size), painter: _CharacterPainter(kind)),
        if (selected)
          Positioned(
            right: 0,
            bottom: 2,
            child: Container(
              width: 20,
              height: 20,
              alignment: Alignment.center,
              decoration: BoxDecoration(color: Palette.teal600, shape: BoxShape.circle, border: Border.all(color: Palette.white, width: 2)),
              child: const AppIcon('check', size: 11, color: Palette.white, strokeWidth: 3.2),
            ),
          ),
      ],
    ),
  );
}

/// Confettis doux : une chute lente à l'arrivée, puis quelques points restent posés.
/// Désactivés si l'appareil demande de réduire les animations.
class Confetti extends StatefulWidget {
  const Confetti({super.key, this.height = 300});
  final double height;

  @override
  State<Confetti> createState() => _ConfettiState();
}

class _ConfettiState extends State<Confetti> with SingleTickerProviderStateMixin {
  late final AnimationController _c = AnimationController(vsync: this, duration: const Duration(milliseconds: 2400));

  static const _pieces = [
    (0.08, Palette.amber500, 7.0),
    (0.22, Palette.teal600, 6.0),
    (0.38, Palette.violet500, 5.0),
    (0.55, Palette.indigo300, 7.0),
    (0.70, Palette.amber500, 5.0),
    (0.84, Palette.violet500, 7.0),
    (0.94, Palette.teal600, 5.0),
  ];

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.of(context).disableAnimations) {
      _c.value = 1;
    } else if (!_c.isAnimating && _c.value == 0) {
      _c.forward();
    }
  }

  @override
  void dispose() {
    _c.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => IgnorePointer(
    child: ExcludeSemantics(
      child: SizedBox(
        height: widget.height,
        child: LayoutBuilder(
          builder:
              (context, box) => AnimatedBuilder(
                animation: _c,
                builder: (context, _) {
                  final t = Curves.easeOutCubic.transform(_c.value);
                  return Stack(
                    children: [
                      for (var i = 0; i < _pieces.length; i++)
                        Positioned(
                          left: _pieces[i].$1 * box.maxWidth,
                          top: -40 + (30 + (i * 47) % (widget.height - 60) + 40) * t,
                          child: Opacity(
                            opacity: t < 0.15 ? t / 0.15 * 0.9 : 0.9 - 0.2 * t,
                            child: Transform.rotate(
                              angle: (i.isOdd ? 200 : -160) * t * math.pi / 180,
                              child: Container(
                                width: _pieces[i].$3,
                                height: _pieces[i].$3,
                                decoration: BoxDecoration(
                                  color: _pieces[i].$2,
                                  borderRadius: BorderRadius.circular(i % 3 == 0 ? 1.5 : _pieces[i].$3 / 2),
                                ),
                              ),
                            ),
                          ),
                        ),
                    ],
                  );
                },
              ),
        ),
      ),
    ),
  );
}
