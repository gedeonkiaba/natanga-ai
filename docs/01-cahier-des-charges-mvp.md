# Cahier des charges MVP — Natanga

> Application d'apprentissage de la lecture et de l'écriture pour enfants de 6–12 ans
> en difficulté (dyslexie, dysorthographie, TDAH, retard de lecture).
> Cadrage : **français uniquement (MVP)** · **cible prioritaire 6–12 ans**.

## Historique de version

| Version | Date | Contenu | Statut |
|---|---|---|---|
| **v0.1** | — | Cahier initial : Flutter + Supabase, Whisper/LLM au cœur, cible **6–9 ans**, **lecture seule**. | **Remplacé** |
| **v1.0** | — | Réalignement : monorepo TypeScript (RN/Expo + Next.js + NestJS), lecture **et écriture**, **6–12 ans**, RGPD **+ COPPA**. | Remplacé (backend) |
| **Courant** | voir git | Backend basculé **NestJS → Laravel** (contrat API préservé) ; client **Flutter** en cohabitation avec React Native ; abandon de **Supabase** ; ASR/IA adaptative repoussées en **Phase 2**. | **Fait foi** |

> Le détail des changements et de leurs raisons est tracé dans
> [`docs/20-changelog-cahier-des-charges.md`](./20-changelog-cahier-des-charges.md).

## 1. Vision (1 phrase)
Une application d'apprentissage de la **lecture et l'écriture** en **français**, pour les
enfants de **6–12 ans** en difficulté, qui combine un **parcours adaptatif** façon
Duolingo et une **gamification bienveillante**, avec un **suivi pour les adultes** — le
tout accessible, conforme RGPD/COPPA, et sans jamais se substituer à un orthophoniste.

## 2. Périmètre MVP (3 mois) — MoSCoW
| Priorité | Contenu |
|---|---|
| **Must** | Arbre de compétences niveau 1 (lettres → syllabes → mots simples), 4 types d'exercices, test de positionnement, streak/vies adoucis, compte enfant + compte adulte, accessibilité de base (police dyslexie, TTS), RGPD/consentement parental |
| **Should** | Dictée progressive, badges/gemmes avancés, adaptation dynamique fine, exports PDF/CSV simples |
| **Could** | Reconnaissance vocale, écriture manuscrite, recommandations IA |
| **Won't (MVP)** | Multijoueur, contenu 13–16 ans, multilingue, détection fine des troubles |

## 3. Objectifs produit
1. Améliorer la fluence de lecture (décodage, vitesse, compréhension).
2. Améliorer l'orthographe et la production écrite.
3. Maintenir l'engagement par une gamification bienveillante (pas de compétition anxiogène).
4. Fournir un tableau de bord parents / orthophonistes / enseignants.
5. S'adapter au niveau réel de l'enfant (IA adaptative progressive).

## 4. Critères de succès mesurables
- Un enfant réalise une leçon de 5–10 min **sans aide d'un adulte**.
- Taux d'erreur des confusions b/d réduit de **≥ 20 %** sur 4 semaines (mesure interne).
- **100 %** des écrans conformes WCAG 2.1 AA (couleur, contraste, audio).
- Temps de chargement d'une leçon **< 3 s** en ligne ; leçon téléchargeable hors-ligne.

## 5. Architecture technique (état courant)

La stack **fait foi** ; elle prime sur les versions antérieures du cahier des charges.
Détail et raisons : ADR [`docs/14`](./14-adr-flutter-cohabitation.md),
[`docs/18`](./18-adr-bascule-laravel.md), stack [`docs/04`](./04-stack-technique.md).

| Couche | Choix retenu | Note |
|---|---|---|
| **Mobile** | React Native (Expo, `apps/mobile`) **+ Flutter** (`apps/mobile-flutter`) en cohabitation | Flutter = client pur, transition progressive (ADR 14) |
| **Web** | Next.js App Router (`apps/web`) | Vitrine + espace parent |
| **Backend** | **Laravel** (`apps/api-laravel`) — bascule depuis NestJS (`apps/api`) | Contrat API **inchangé** (mêmes routes, RFC 7807) |
| **BDD** | PostgreSQL 16 (12 tables) | Prisma (NestJS) → migrations Laravel (ADR 18) |
| **Cache/Queue** | Redis (prévu) | sessions, rate-limit |
| **TTS** | `expo-speech` (RN) / `flutter_tts` (Flutter) | français, débit ralenti (DYS) |
| **ASR / IA adaptative** | **Phase 2** | règles déterministes d'abord, pas de LLM/Whisper au cœur |

> **Abandon de Supabase** : la logique métier critique (consentement révocable versionné,
> anti-énumération, export/suppression RGPD, SRS) reste côté serveur (Laravel), pas en
> Edge Functions — voir ADR [`docs/14`](./14-adr-flutter-cohabitation.md).

## 6. Conformité & limites éthiques

- **RGPD** (UE) **+ COPPA** (États-Unis) : consentement parental explicite, révocable et
  versionné ; minimisation ; hébergement UE. Spécification : [`docs/08`](./08-spec-lot-c-consentement-rgpd.md).
- L'app **entraîne** et **soutient** ; elle **ne diagnostique pas** et **ne remplace pas** un
  orthophoniste ou un enseignant. Aucune promesse de rééducation ou de « guérison ».
- Les confusions (ex. b/d) sont des **métriques d'apprentissage**, jamais un diagnostic
  médical ; aucun traitement de données de santé (art. 9 RGPD).
