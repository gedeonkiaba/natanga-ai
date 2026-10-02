# Changelog & réconciliation — Cahier des charges

> Document de traçabilité décisionnelle. Réconcilie le cahier des charges **v0.1** (document
> collé initialement : Flutter + Supabase, Whisper/LLM au cœur, 6–9 ans, lecture seule) avec
> l'**état réel** du monorepo `project-natanga` au fil des ADR et docs de suivi.
> La vérité de référence est le **code + les documents d'architecture** ; le v0.1 est un
> vestige, jamais rétro-appliqué.

## Synthèse des écarts v0.1 → état courant

| # | Axe | v0.1 (collé) | État courant (fait foi) | Référence |
|---|---|---|---|---|
| 1 | **Stack mobile** | Flutter + Supabase | React Native/Expo (`apps/mobile`) **et** Flutter (`apps/mobile-flutter`) en cohabitation | `README.md`, `docs/14`, `docs/15` |
| 2 | **Backend** | Supabase (PostgreSQL) | NestJS livré puis **bascule vers Laravel** (`apps/api-laravel`), contrat API inchangé | `docs/18`, `docs/19` |
| 3 | **Base** | PostgreSQL via Supabase | PostgreSQL 16 (Postgres natif, 12 tables), Prisma → migrations Laravel | `docs/17`, `docker-compose.yml` |
| 4 | **Cible d'âge** | 6–9 ans | **6–12 ans** (tranches 6–8 / 9–12) | `docs/01`, `docs/08`, README |
| 5 | **Périmètre** | Lecture seule | Lecture **et écriture** (dictée P1, écriture manuscrite P2) | README, `docs/01`, `docs/03` |
| 6 | **IA / STT** | Cœur du produit (Whisper/LLM/TTS) | ASR & recommandations IA = **Phase 2 / Could** ; IA adaptative = règles d'abord | `docs/01`, `docs/04`, `docs/03` (US-24) |
| 7 | **Conformité** | RGPD seul | **RGPD + COPPA**, consentement révocable/versionné (machine à états) | `docs/08`, `docs/10` |

## Affirmations abandonnées (et pourquoi)

| Affirmation v0.1 | Décision / raison | ADR |
|---|---|---|
| **Supabase comme backend** | La logique métier critique (consentement, anti-énumération, export/suppression RGPD, SRS) reste côté serveur, testée ; Supabase (Edge Functions) la fragiliserait pour un produit mineurs. | `docs/14` |
| **Backend NestJS** | Compétence d'équipe réelle en **PHP/Laravel** ; le coût de maintenance d'une stack non maîtrisée dépasse le bénéfice du monolangage TS. Bascule complète, contrat API préservé. | `docs/18` |
| **Whisper / LLM / Google STT au cœur** | ASR d'évaluation repoussée en **Phase 2** ; l'approche retenue est **règles déterministes → modèle léger (bandit/IRT) → ML avancé**, explicable et RGPD-friendly. | `docs/04` |
| **Cible 6–9 ans** | Élargie à **6–12 ans** (lecture *et* écriture). | `docs/01`, README |

## Décisions d'architecture clés (traçabilité)

- **Cohabitation Flutter + RN** : Flutter = second client **pur** (pas de réimplémentation
  métier), transition progressive ; suppression de RN décidée après spike tracé manuscrit.
  → [`docs/14-adr-flutter-cohabitation.md`](./14-adr-flutter-cohabitation.md)
- **Bascule NestJS → Laravel** : machine à états consentement, SRS, gamification transposées
  en PHP ; schéma PostgreSQL et contrats API identiques ; critère de bascule = `e2e-acceptance.mjs`
  vert + tests Pest verts + Flutter branché.
  → [`docs/18-adr-bascule-laravel.md`](./18-adr-bascule-laravel.md), [`docs/19-runbook-bascule-laravel.md`](./19-runbook-bascule-laravel.md)
- **Base 12 tables** (auth + consentement + pédagogie), FK `ON DELETE CASCADE` pour
  l'effacement RGPD. → [`docs/17-base-de-donnees-complete.md`](./17-base-de-donnees-complete.md)

## Principes de réconciliation appliqués

1. Le **code + docs** priment sur le document collé en cas de conflit.
2. Chaque décision remplacée est **explicitement marquée**, jamais effacée silencieusement
   (traçabilité d'audit).
3. La réconciliation est **documentaire uniquement** : aucun fichier de code, de migration,
   ni de `docker-compose` n'est modifié.
4. Les docs de référence fonctionnelle (`docs/03-backlog`, `docs/08-spec-lot-c`, lots
   d'implémentation) restent **inchangées** et continuent de faire foi.

## Fichiers concernés par cette mise à jour

| Fichier | Action |
|---|---|
| `docs/01-cahier-des-charges-mvp.md` | Ajout « Historique de version » + §5 architecture (Laravel, Flutter cohabitation, abandon Supabase) + §6 conformité COPPA |
| `docs/20-changelog-cahier-des-charges.md` | Création (ce document) |
| `README.md` | Alignement stack (Laravel) + mention cohabitation Flutter |
