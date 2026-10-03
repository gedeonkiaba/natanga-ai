/// Choix du profil enfant (avatar + thèmes). Logique pure et testée.
library;

enum ThemeKey { animaux, science, aventure, fantaisie, sports, famille }

List<ThemeKey> toggleTheme(List<ThemeKey> selected, ThemeKey key) =>
    selected.contains(key) ? selected.where((k) => k != key).toList() : [...selected, key];

String selectionLabel(int count) => switch (count) {
  0 => 'Aucun thème',
  1 => '1 sélectionné',
  _ => '$count sélectionnés',
};

bool canSubmitProfile(String? avatar, List<ThemeKey> themes) => avatar != null && themes.isNotEmpty;
