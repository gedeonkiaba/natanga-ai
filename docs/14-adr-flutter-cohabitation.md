# ADR — Cohabitation Flutter (mobile) + API NestJS existante

> Décision d'architecture enregistrée. Date : voir git. Statut : **Acceptée** (sous réserve).

## Contexte

- Le monorepo `natanga` a livré un MVP React Native (Expo) + Next.js + NestJS,
  avec une logique métier TypeScript partagée (`@natanga/core`).
- Une demande de **second client mobile en Flutter** a été émise, avec préférence
  initiale pour Supabase comme backend.

## Décision

1. **Introduire Flutter comme client mobile** dans `apps/mobile-flutter/`, **en parallèle**
   du React Native existant (`apps/mobile`), sans le supprimer (transition progressive).
2. **Conserver l'API NestJS comme source de vérité métier** — le client Flutter est un
   **consommateur HTTP pur** des endpoints existants.
3. **Ne pas adopter Supabase** comme substitut du backend : la logique métier critique
   (machine à états de consentement RGPD/COPPA, anti-énumération, audit append-only,
   droits export/suppression) reste dans NestJS, où elle est testée.

## Raisons

- **Conformité RGPD/COPPA** : les règles de consentement révocable/versionné et de
  minimisation vivent dans des services NestJS testés ; les réimplémenter en Dart ou en
  Edge Functions introduirait un risque de conformité pour un produit mineurs.
- **Pas de duplication de logique pédagogique** : SRS, placement, gamification restent
  côté serveur/front TypeScript ; Flutter ne les re-code pas.
- **Cohérences** : une seule source de vérité métier, quels que soient les clients.

## Conséquences

- Le design system Flutter (`lib/theme/`) est un **miroir** des tokens `@natanga/ui`
  (couleurs, polices dyslexie), pas une logique dupliquée.
- Le `pubspec.lock` de l'app Flutter est ignoré par git (politique app).
- La navigation Flutter (go_router) sera câblée aux écrans du parcours.

## Réévaluation

- La bascule complète (suppression de `apps/mobile` RN) sera décidée **après** un spike de
  mesure du tracé manuscrit (Phase 2) comparant `react-native-skia` vs Flutter.
- La question Supabase reste ouverte **uniquement** si les besoins de temps réel/données
  dépassent NestJS + Postgres — sans remettre en cause la logique métier NestJS.

## État actuel (validé en session)

- `flutter create` ✅ · `flutter pub get` ✅ · `flutter analyze` ✅ (0 issue)
- `flutter test` ✅ (4/4)
