# Client Flutter — socle fonctionnel (navigation + API + TTS)

> Suivi d'implémentation du client mobile Flutter (`apps/mobile-flutter`).
> Rappel : client **pur** consommant l'API NestJS (aucune logique métier réécrite).

## État des 3 briques fondatrices

| Brique | Fichiers | État |
|---|---|---|
| **Navigation** | `router.dart`, `screens/*` (home, skill_tree, lesson, consent) | ✅ |
| **Connexion API** | `api_client.dart`, `api_exception.dart`, `auth_service.dart`, `consent_service.dart`, `state/auth_controller.dart` | ✅ |
| **TTS (accessibilité)** | `services/tts_service.dart`, `state/tts_provider.dart`, `widgets/speak_button.dart` | ✅ |

## Points d'accessibilité (US-13)

- **`SpeakButton`** : `Semantics(label:, button: true)`, cible tactile ≥ 48px, lit toute
  consigne à voix haute.
- **`TtsService`** : abstraction testable (mock) ; implémentation `flutter_tts` configurée
  en français (`fr-FR`) à **débit ralenti (0.45)** — adapté aux lecteurs DYS.
- Consigne de leçon affichée **et** audible (double canal texte/audio).

## Validation (exécutée en session)

| Vérification | Résultat |
|---|---|
| `flutter analyze` | ✅ 0 issue |
| `flutter test` | ✅ 14/14 |

## Architecture propre

- **Injection Riverpod** : `ttsServiceProvider`, `apiClientProvider`, `authControllerProvider`.
- **Abstraction TTS** : `TtsService` (interface) → `FlutterTtsService` (impl), testable sans
  moteur natif via `mocktail`.
- **Erreurs typées** : `ApiException` (RFC 7807) alignée sur le `DomainExceptionFilter` NestJS.

## Suite possible

- Écrans **exercices** (son ⇄ graphème, QCM mots) en Flutter, consommant l'API pédagogique.
- **go_router** approfondi (passage de paramètres typés, return value).
- **Persistance locale** (hors-ligne) — Phase 2.
