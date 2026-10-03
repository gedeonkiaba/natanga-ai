# Intégration UI du parcours — écrans jouables (Sprint 1)

> Suivi d'implémentation. Relie le moteur pédagogique (`@natanga/core`), le design
> system accessible (`@natanga/ui`) et l'app mobile (Expo) en un parcours jouable.

## Écrans et composants livrés (`apps/mobile/src/`)

| Fichier | Rôle |
|---|---|
| `App.tsx` | Racine + navigation simple `home → tree → lesson` + injection TTS |
| `screens/SkillTreeScreen.tsx` | Arbre de compétences (nœuds + statut de déblocage) |
| `screens/LessonScreen.tsx` | Leçon jouable (progrès, récompenses, fin) |
| `components/SoundGrapheme.tsx` | Exercice association son ⇄ graphème (TTS + boutons) |
| `components/WordRecognition.tsx` | Exercice reconnaissance de mots (QCM) |
| `components/shared.tsx` | Type `AnswerFeedback` partagé |
| `hooks/useLessonSession.ts` | Hook d'état de session (moteur + gamification) |

## Flux fonctionnel (bout en bout)

1. **Accueil** → badges (streak/gemmes/badges) + CTA « C'est parti ! ».
2. **Arbre** → liste des 4 nœuds (voyelles, b/d, p/q, mots simples) avec statuts locked/available/mastered.
3. **Leçon** → séquence d'exercices ordonnée, TTS de consigne, réponses → feedback bienveillant,
   gemmes accumulées (effort + réussite), barre de progression.
4. **Fin** → récapitulatif + « Continuer » retour arbre.

## Accessibilité appliquée

- Tous les boutons/touches passent par `@natanga/ui` (cibles ≥ 44px, `accessibilityRole`).
- Consignes lues via `TTSButton` (expo-speech injecté dans `App.tsx`).
- Feedback d'erreur en `warning` (orange doux), jamais de rouge.
- Progression annoncée aux lecteurs d'écran (`ProgressBar`).

## Gamification branchée

`useLessonSession` appelle `rewardForAnswer` de `@natanga/core` : gemmes pour **l'effort**
(même en cas d'erreur) + réussite — conforme à US-09/US-10.

## Validation

| Vérification | Résultat |
|---|---|
| `@natanga/mobile` typecheck | ✅ |
| `turbo run typecheck` (5 packages) | ✅ 5/5 |

## Limites & suite

- **Navigation** : bascule d'état simple (pas encore react-navigation) — à adopter pour la
  vraie navigation multi-écrans.
- **Progression simulée** dans `SkillTreeScreen` (hardcodée) → relier au profil enquêteur
  Persistance (Lot d'intégration).
- **Tests de rendu UI** : à faire en CI Linux (`@testing-library/react-native`), le sandbox
  bloquant le spawn de workers.
