import 'package:flutter/material.dart';

/// Thème accessible Natanga — miroir Flutter des tokens `@natanga/ui`.
///
/// Principes (spec UX) :
/// - Palette colorée mais non saturée, jamais de rouge agressif (orange pour l'erreur).
/// - Police adaptée dyslexie (OpenDyslexic / Lexend, fallback système).
/// - Contrastes WCAG 2.1 AA.

/// Couleurs claires (fond crème / bleu ciel doux).
class NatangaColors {
  static const Color background = Color(0xFFFAF6EF);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color primary = Color(0xFF2E7D32);
  static const Color primaryContrast = Color(0xFFFFFFFF);
  static const Color secondary = Color(0xFF1E5AA8);
  static const Color secondaryContrast = Color(0xFFFFFFFF);
  static const Color warning = Color(0xFFC77700); // orange doux (jamais rouge)
  static const Color warningContrast = Color(0xFF1F1A10);
  static const Color text = Color(0xFF1F1A10);
  static const Color textMuted = Color(0xFF5A5348);
  static const Color border = Color(0xFFD8D0C2);
}

/// Pile de polices adaptées dyslexie (fallback système).
class NatangaFonts {
  static const String body = 'OpenDyslexic';
  static const String display = 'Lexend';
}

/// Construit le `ThemeData` clair accessible.
ThemeData natangaLightTheme() {
  return ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: NatangaColors.primary,
      surface: NatangaColors.surface,
    ),
    scaffoldBackgroundColor: NatangaColors.background,
    textTheme: const TextTheme(
      bodyMedium: TextStyle(
        fontFamily: NatangaFonts.body,
        color: NatangaColors.text,
        fontSize: 16,
        height: 1.5,
      ),
      titleLarge: TextStyle(
        fontFamily: NatangaFonts.display,
        color: NatangaColors.text,
        fontSize: 24,
        fontWeight: FontWeight.w700,
      ),
    ),
    // Cibles tactiles généreuses (≥ 44px) pour l'accessibilité.
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size(88, 44),
        backgroundColor: NatangaColors.primary,
        foregroundColor: NatangaColors.primaryContrast,
      ),
    ),
  );
}
