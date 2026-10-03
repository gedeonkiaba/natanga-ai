/// Design system Natanga (Flutter) — mêmes valeurs que l'app Expo
/// (`apps/mobile/src/design/tokens.ts`), relevées au pixel sur la maquette approuvée.
library;

import 'package:flutter/material.dart';

class Palette {
  static const cream = Color(0xFFF9F6EF);
  static const surface = Color(0xFFFFFFFF);
  static const surfaceMuted = Color(0xFFF8FAFC);
  static const footnote = Color(0xFFFCFBF8);
  static const ink = Color(0xFF1A1A2E);
  static const inkDeep = Color(0xFF1E1B4B);
  static const inkBody = Color(0xFF5A5A74);
  static const inkSoft = Color(0xFF757794);
  static const inkLabel = Color(0xFF73738C);
  static const inkMeta = Color(0xFF4B5563);
  static const inkFaint = Color(0xFF9CA3AF);
  static const slate700 = Color(0xFF334155);
  static const slate500 = Color(0xFF64748B);
  static const border = Color(0xFFEEEAE2);
  static const borderSlate = Color(0xFFE2E8F0);
  static const borderSoft = Color(0xFFF1F5F9);
  static const indigo50 = Color(0xFFEEF2FF);
  static const indigo100 = Color(0xFFE0E7FF);
  static const indigo300 = Color(0xFFA5B4FC);
  static const indigo500 = Color(0xFF6366F1);
  static const indigo600 = Color(0xFF4F46E5);
  static const violet500 = Color(0xFF8B5CF6);
  static const violet900 = Color(0xFF4C1D95);
  static const purple50 = Color(0xFFFAF5FF);
  static const purple100 = Color(0xFFF3E8FF);
  static const purple200 = Color(0xFFE9D5FF);
  static const teal50 = Color(0xFFF0FDFA);
  static const teal100 = Color(0xFFCCFBF1);
  static const teal300 = Color(0xFF99D2CC);
  static const teal600 = Color(0xFF0D9488);
  static const teal700 = Color(0xFF0F766E);
  static const emerald50 = Color(0xFFECFDF5);
  static const green50 = Color(0xFFF0FDF4);
  static const green800 = Color(0xFF166534);
  static const amber100 = Color(0xFFFEF3C7);
  static const amber500 = Color(0xFFF59E0B);
  static const amber600 = Color(0xFFD97706);
  static const yellow200 = Color(0xFFFEF08A);
  static const yellow800 = Color(0xFF854D0E);
  static const sky100 = Color(0xFFE0F2FE);
  static const sky600 = Color(0xFF0284C7);
  static const fuchsia50 = Color(0xFFFDF4FF);
  static const fuchsia100 = Color(0xFFFAE8FF);
  static const fuchsia200 = Color(0xFFF5D0FE);
  static const fuchsia600 = Color(0xFFC026D3);
  static const track = Color(0xFFE5E0D5);
  static const navIdle = Color(0xFF9EA5B0);
  static const white = Color(0xFFFFFFFF);

  /// Syllabes bicolores : 1ʳᵉ syllabe de chaque mot en teal, puis ardoise.
  static const syllableA = teal700;
  static const syllableB = slate700;
}

/// Couples fond / encre (pastilles, tuiles d'icône, badges).
class Tone {
  const Tone(this.bg, this.fg);
  final Color bg;
  final Color fg;

  static const indigo = Tone(Palette.indigo50, Palette.indigo500);
  static const violet = Tone(Palette.purple100, Palette.violet500);
  static const amber = Tone(Palette.amber100, Palette.amber600);
  static const teal = Tone(Palette.teal100, Palette.teal700);
  static const green = Tone(Palette.green50, Palette.green800);
  static const emerald = Tone(Palette.emerald50, Palette.teal600);
  static const sky = Tone(Palette.sky100, Palette.sky600);
  static const fuchsia = Tone(Palette.fuchsia100, Palette.fuchsia600);
  static const slate = Tone(Color(0xFFF1F3F9), Color(0xFF5A637D));
  static const purple = Tone(Palette.purple50, Palette.violet500);

  static Tone named(String name) => switch (name) {
    'indigo' => indigo,
    'violet' => violet,
    'amber' => amber,
    'teal' => teal,
    'green' => green,
    'emerald' => emerald,
    'sky' => sky,
    'fuchsia' => fuchsia,
    'purple' => purple,
    _ => slate,
  };
}

/// Échelle typographique (Lexend embarquée).
class TypeScale {
  static const _f = 'Lexend';
  static TextStyle _t(double size, double line, FontWeight w) =>
      TextStyle(fontFamily: _f, fontSize: size, height: line / size, fontWeight: w, color: Palette.ink);

  static final brand = _t(24, 30, FontWeight.w800);
  static final hero = _t(24, 30, FontWeight.w700);
  static final title = _t(22, 28, FontWeight.w700);
  static final celebration = _t(23, 30, FontWeight.w700);
  static final reading = _t(22, 46, FontWeight.w600);
  static final stat = _t(17, 22, FontWeight.w700);
  static final cardTitle = _t(15, 19, FontWeight.w600);
  static final button = _t(16, 20, FontWeight.w700);
  static final body = _t(14, 21, FontWeight.w400);
  static final bodySmall = _t(13, 18, FontWeight.w400);
  static final caption = _t(12, 16, FontWeight.w500);
  static final label = _t(12.5, 16, FontWeight.w700).copyWith(letterSpacing: 0.6);
  static final micro = _t(10.5, 13, FontWeight.w600);
  static final nav = _t(11, 14, FontWeight.w500);
}

class Space {
  static const xxs = 4.0, xs = 6.0, sm = 8.0, md = 12.0, lg = 16.0, xl = 20.0, xxl = 24.0, xxxl = 32.0;
}

class Radii {
  static const sm = 8.0, md = 12.0, lg = 16.0, xl = 20.0, pill = 999.0;
}

const gutter = 20.0;

/// Cible tactile minimale.
const touch = 48.0;

class Shadows {
  static const card = [BoxShadow(color: Color(0x0D1E1B4B), blurRadius: 12, offset: Offset(0, 4))];
  static const primary = [BoxShadow(color: Color(0x4D6366F1), blurRadius: 14, offset: Offset(0, 6))];
  static const teal = [BoxShadow(color: Color(0x1F0D9488), blurRadius: 8, offset: Offset(0, 2))];
}
