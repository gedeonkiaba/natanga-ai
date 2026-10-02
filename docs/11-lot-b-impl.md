# Lot B implémenté — Design system & accessibilité

> Suivi d'implémentation Sprint 1. Exigences : US-13 (police dyslexie + TTS), US-31
> (design system), US-32 (lint a11y bloquant), US-23 (feedback non agressif).

## Composants livrés (`packages/ui/src/components/`)

| Composant | Fichier | Points a11y |
|---|---|---|
| `Button` | `Button.tsx` | `accessibilityRole="button"`, `accessibilityState`, cible ≥ 44px, variante `warning` = orange doux |
| `Text` | `Text.tsx` | Variantes body/title/caption, `muted` (contraste AA, pas un gris illisible) |
| `ProgressBar` | `ProgressBar.tsx` | `accessibilityRole="progressbar"` + `accessibilityValue` (annonce le %) |
| `Badge` | `Badge.tsx` | Icône + libellé fusionnés dans un `accessibilityLabel` |
| `TTSButton` | `TTSButton.tsx` | Bouton de synthèse vocale (lit les consignes) |

## Synthèse vocale (US-13)

- **`speech.ts`** : abstraction `speak()` / `setSpeakFunction()` — pure, sans dépendance RN.
- L'app hôte injecte l'implémentation :
  - **Mobile** : `expo-speech` (`Speech.speak`)
  - **Web** : `window.speechSynthesis` (Web Speech API)
- Démonstration dans `apps/mobile/App.tsx`.

## Thème clair/sombre (US-22)

- `theme.ts` : `lightTheme` / `darkTheme` / `getTheme(mode)` / `select(token, mode)`.
- Tokens déjà présents : `colors`, `darkColors`, `fontSizes`, `fontFamilies`, `spacing`, `radii`.

## Polices dyslexie (US-13)

- `fontFamilies.body` / `.display` : `OpenDyslexic` → `Lexend` → système (pile à fallback).
- Les polices réelles (fichiers) seront embarquées via `expo-font` et `next/font` lors de
  l'intégration UI finale (Lot d'intégration).

## Lint a11y (US-32)

- `eslint.config.mjs` (racine) : `eslint-plugin-jsx-a11y` avec règles bloquantes
  (`alt-text`, `aria-props`, `aria-role`, `no-autofocus`).
- Le CI (`ci.yml`) exécute `pnpm lint` ; le lint a11y devient bloquant.

## Validation

| Vérification | Résultat |
|---|---|
| `@natanga/ui` typecheck | ✅ |
| `@natanga/ui` tests (8) | ✅ 8/8 |
| `@natanga/web` `next build` | ✅ |
| `@natanga/mobile` typecheck | ✅ |

## Corrections annexes apportées

- **Suppression de `apps/mobile/app.config.ts`** (JSON brut invalide, redondant avec
  `app.json`) — bug préexistant corrigé au passage.
- **`speech.ts` séparé de `TTSButton.tsx`** — la logique TTS est testable sans moteur RN
  (évite l'échec du transform vitest sur le JSX React Native).

## À venir

- Embarquer les **fichiers de polices** OpenDyslexic/Lexend (expo-font / next/font).
- **Tests de rendu** des composants via `@testing-library/react-native` (le sandbox bloque
  le spawn des workers ; à faire en CI Linux).
- **Tests e2e accessibilité** (axe-core / Playwright) sur l'écran d'accueil.
