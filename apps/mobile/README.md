# Natanga — application mobile (Expo)

React Native + Expo (SDK 52) + TypeScript. Reproduction des 4 écrans de la maquette
approuvée (Sleek) : **Accueil**, **Profil enfant**, **Lecture**, **Succès** — et le cœur
pédagogique : **Mon parcours** (arbre de compétences) et les **leçons d'exercices**
(son ⇄ lettre, reconnaissance de mots), moteur `@natanga/core`.

```bash
pnpm --filter @natanga/mobile start        # Expo Go / simulateurs
pnpm --filter @natanga/mobile export:web   # vérifie que l'app se bundle (utilisé en CI)
```

Aperçu web d'un écran précis : `#home`, `#profile`, `#reading`, `#achievement`, `#tree` dans l'URL.

## Parcours pédagogique

- **Mon parcours** s'ouvre depuis les onglets *Bibliothèque* (Accueil, Succès) et *Histoires* (Profil).
- Nœud → leçon (`LEVEL1_LESSONS`) → exercices → « Leçon terminée » → retour au parcours ;
  « Quitter » et le retour Android ramènent aussi au parcours.
- Après chaque réponse, le retour (« Bravo ! », « Presque ! C'est « a » ») reste 1,2 s sur
  l'exercice en cours ; les touches en trop sont ignorées (une réponse comptée).
- ⚠️ **Contenu manquant** : la leçon « b ou d ? » (nœud *Les sons b / d*) n'a encore aucun
  exercice dans `packages/core/src/pedagogy/content.ts`. L'app affiche « Cette leçon arrive
  bientôt » avec un bouton de retour ; les exercices sont à rédiger et valider par l'équipe
  pédagogique.

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
  quelles ; les onglets encore sans écran (Réglages, Parents…) sont annoncés
  « Bientôt disponible » aux lecteurs d'écran.
- Les écrans du parcours et des leçons gardent leur style d'origine (`@natanga/ui`), pas
  encore celui de la maquette.
