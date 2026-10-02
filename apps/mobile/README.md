# Natanga — application mobile (Expo)

React Native + Expo (SDK 52) + TypeScript. Reproduction des 4 écrans de la maquette
approuvée (Sleek) : **Accueil**, **Profil enfant**, **Lecture**, **Succès**.

```bash
pnpm --filter @natanga/mobile start        # Expo Go / simulateurs
pnpm --filter @natanga/mobile export:web   # vérifie que l'app se bundle (utilisé en CI)
```

Aperçu web d'un écran précis : `#home`, `#profile`, `#reading`, `#achievement` dans l'URL.

## Design system (`src/design`)

| Élément | Rôle |
|---|---|
| `tokens.ts` | Couleurs relevées au pixel sur la maquette, échelle typographique Lexend, espacements, rayons, ombres |
| `components/` | `AppText`, `Card`, `Pill`, `IconTile`, `Button`, `BrandMark`, `BottomNav`, `ProgressBar`, `Avatar`, `Checkbox`, `Confetti`, `Screen` |
| `icons.generated.ts` | SVG Lucide + Fluent Emoji Flat embarqués (`pnpm --filter @natanga/mobile icons`) — rendu identique iOS / Android, aucun appel réseau |

Les écrans (`src/screens`) n'utilisent que ces composants et les rôles de `colors`.

## Contenu et logique

- `src/content/demo.ts` : textes de la maquette, mot pour mot — point unique à brancher sur l'API.
- `src/features/reading.ts` : syllabes écrites à la main (« lu·ci·ole »), coloration bicolore
  (1ʳᵉ syllabe de chaque mot en teal, puis ardoise), texte lu à voix haute. Testé (`pnpm test`).
- Synthèse vocale : `expo-speech`, débit « Vitesse douce » (0,85).

## Écarts assumés avec la maquette

- La ligne « Léo (8 ans) » de l'accueil est affichée en entier (la maquette la coupe) ; sa
  pastille « 🔥 5 jours » reprend la série de l'écran Succès.
- Les barres d'onglets diffèrent d'un écran à l'autre dans la maquette : reproduites telles
  quelles ; les onglets sans écran (Bibliothèque, Réglages, Parents…) sont annoncés
  « Bientôt disponible » aux lecteurs d'écran.
