# Plan de sprint 1 — Natanga (2 semaines)

> Socle technique du monorepo + parcours jouable de bout en bout.
> Cadrage validé : français uniquement (MVP) · cible prioritaire 6–12 ans ·
> stack React Native (Expo) + Next.js + NestJS + PostgreSQL/Redis (monorepo Turborepo).

## 1. Objectif du sprint
Poser le **socle technique** du monorepo et livrer un **bout de parcours jouable de bout en
bout** : un enfant crée son profil (consenti par un parent), passe un test de positionnement
simplifié, et fait une **leçon niveau 1** (son→graphème + reconnaissance de mots) avec
gamification de base, le tout accessible et conforme RGPD/COPPA.

**Definition of Done (DoD) :** fonctionnalité codée + testée (unitaires, intégration) +
documentée + conforme a11y/RGPD + fusionnée en PR reviewée.

## 2. Périmètre (US couvertes)

| US | Libellé court | Statut Sprint 1 |
|---|---|---|
| US-31 | Design system (tokens, composants) | Plein |
| US-01 | Compte parent + consentement RGPD/COPPA | Plein |
| US-02 | Profil enfant (avatar, âge) | Plein |
| US-03 | Onboarding ≤ 3 écrans | Plein |
| US-04 | Test de positionnement (v0 simplifiée) | Plein (v0) |
| US-05 | Arbre de compétences niveau 1 | Partiel (3 premiers nœuds) |
| US-06 | Leçons 5–10 min | Plein |
| US-07 | Association son ⇄ graphème | Plein |
| US-08 | Reconnaissance de mots (QCM) | Plein (QCM uniquement) |
| US-09 | Vies/streak adoucis | Plein |
| US-10 | Gemmes/badges d'effort | Plein (base) |
| US-13 | Police dyslexie + TTS consignes | Plein |
| US-32 | CI/CD + tests | Plein |
| US-14 | Tableau de bord parent | Partiel (lecture seule, sans jargon) |
| US-11 | Personnage compagnon | Partiel (base avatar) |
| US-23 | Feedback positif immédiat | Partiel (feedback d'erreur non agressif) |
| US-12 | SRS révision espacée | **Reporté Sprint 2** |
| US-16 | Dictée progressive | **Reporté Sprint 2** |

**Sortie de sprint démontrable :** parcours complet
*onboarding → placement → leçon → récompense → lecture de la progression*,
sur mobile (émulateur) et web.

## 3. Decoupage en lots (epics) et taches

> Points = complexité relative. Capacité indicative Sprint 1 : ~18 pts/lot ≈ 34 pts.

### Lot A — Socle monorepo & CI (5 pts)
- **A1.** Initialiser monorepo Turborepo + pnpm + workspaces (`apps/mobile`, `apps/web`, `apps/api`, `packages/core`).
- **A2.** Configurer tsconfig de base, ESLint + Prettier, hooks partagés.
- **A3.** Mettre en place CI GitHub Actions : lint + types + tests + **lint a11y bloquant** (US-32).
- **A4.** Initialiser NestJS avec module de config + healthcheck, Postgres (docker-compose local) + migrations (Prisma).

### Lot B — Design system & accessibilité (6 pts)
- **B1.** Définir les tokens design (couleurs non saturées, typo, espacements, rayons) — `packages/ui`.
- **B2.** Composants de base accessibles : `Button`, `Card`, `Progress`, `Badge`, `Text` — variantes AA.
- **B3.** Intégrer **OpenDyslexic + Lexend** (chargement local, fallback système) + réglage taille/contraste.
- **B4.** Composant **`TTSButton`/`SpeakText`** (expo-speech côté mobile / Web Speech API côté web).
- **B5.** Thème **clair/sombre** + tokens — axe vérifiant les contrastes AA.

### Lot C — Auth & consentement RGPD (6 pts)
- **C1.** API : entités `User` (parent), `Child`, `ConsentRecord` + endpoint consentement (US-01).
- **C2.** Flux de **consentement parental explicite** (case + vérification) côté web/mobile.
- **C3.** Journal d'audit consentement (création, révocation, horodatage).
- **C4.** Endpoint **export + suppression** des données (US-15, anticipée pour être RGPD-ready).
- **C5.** Politique de confidentialité adaptée aux enfants + notice accessible (lien off, texte simple).

### Lot D — Profil & onboarding (4 pts)
- **D1.** Création profil enfant (prénom, âge → univers graphique) (US-02).
- **D2.** Onboarding ≤ 3 écrans, narration vocale, aucun texte long (US-03).
- **D3.** Sélection/édition d'avatar (personnage compagnon base) (US-11 partiel).

### Lot E — Parcours & contenu pédagogique (7 pts)
- **E1.** Modèle de données pédagogique : `SkillNode`, `Lesson`, `Exercise`, `Item` (phonème/graphème/mot).
- **E2.** **Contenu niveau 1** initial : lettres/sons (a, i, o, b, d, p, q…) + mots simples, audio embarqué.
- **E3.** Arbre de compétences v0 (3 premiers nœuds déblocables) (US-05 partiel).
- **E4.** Moteur de leçon : séquence d'exercices, sauvegarde d'état, durée bornée 5–10 min (US-06).

### Lot F — Exercices niveau 1 (7 pts)
- **F1.** Exercice **association son ⇄ graphème** (audio + visuel, feedback immédiat) (US-07).
- **F2.** Exercice **reconnaissance de mots QCM** (distracteurs bienveillants, reformulation) (US-08).
- **F3.** **Feedback d'erreur non agressif** : orange/jaune + suggestion, jamais de rouge (US-23 partiel).
- **F4.** **Test de positionnement v0** (série courte d'exercices → placement dans l'arbre) (US-04).

### Lot G — Gamification bienveillante (4 pts)
- **G1.** Modèle `Progress`, `Streak`, `Gems`, `Badges` (effort ≠ réussite).
- **G2.** **Streak** doux (jamais de perte brutale) + **vies non bloquantes** (US-09).
- **G3.** Attribution de **gemmes/badges à l'effort** + écran récompenses (US-10).
- **G4.** Téléchargement hors-ligne d'une leçon (v0 : cache simple) — prépare US-21.

### Lot H — Tableau de bord parent v0 (3 pts)
- **H1.** Écran parent : temps passé, progression, points forts/faibles simplifiés, **sans jargon**.
- **H2.** Scénarios Gherkin pour US-14 partiel + tests d'intégration.

## 4. Plan jour par jour (10 jours ouvrés)

| Jour | Livrable |
|---|---|
| J1 | Lot A : monorepo + CI + API skeleton + DB (seed) |
| J2 | Lot B : design system + tokens + composants accessibles |
| J3 | Lot C : auth + consentement RGPD (entités, endpoints, audit) |
| J4 | Lot D : profil + onboarding ; Lot E1 : schéma pédagogique |
| J5 | Lot E : arbre + contenu niveau 1 + moteur de leçon |
| J6 | Lot F : exercices son⇄graphème + QCM mots |
| J7 | Lot F : feedback non agressif + test de positionnement v0 |
| J8 | Lot G : gamification (streak, gemmes, badges) |
| J9 | Lot H : tableau de bord parent v0 |
| J10 | Intégration, tests e2e du parcours complet, recette, démo |

## 5. Schéma de base de données prévisionnel (v0)

```
users            (id, email, role[parent|pro], consent_given, created_at)
children         (id, user_id FK, first_name, birth_year, avatar, universe, created_at)
consents         (id, child_id FK, version, status, granted_at, revoked_at, audit_json)
skill_nodes      (id, level, type, title, order, unlocked_rules)
lessons          (id, node_id FK, title, duration_min, order)
exercises        (id, lesson_id FK, type, params_json, order)
items            (id, type[grapheme|word|...], label, audio_url, metadata)
progress         (id, child_id FK, skill_node_id FK, status, mastered_score)
attempts         (id, child_id FK, exercise_id FK, item_id FK, result, error_kind, ts)
streaks          (id, child_id FK, current_count, last_active_at)
rewards          (id, child_id FK, kind[gems|badge|effort], amount, reason, ts)
settings         (id, child_id FK, font, font_size, contrast, dark_mode, tts_on)
```

## 6. Risques Sprint 1 & mitigations

| Risque | Mitigation |
|---|---|
| **Contenu pédagogique** insuffisant pour une leçon complète | Produire un premier jeu de ~20 items grapheme/mot en J5, extensible par seed. |
| **Audio français de qualité** absent | Embarcation de fichiers audio validés + TTS Azure en fallback ; exiger alt texte. |
| **Consentement COPPA/RGPD** mal compris par l'adulte | Copy simple + case explicite + journal d'audit testé (gros focus Lot C). |
| **Complexité React Native/Web partagée** | Logique dans `packages/core`, UI dans `packages/ui`, plateformes minces. |
| **Risque d'accessibilité oublié** | Lint a11y bloquant en CI dès J2, revue de contraste par test automatisé. |
| **Dérive de périmètre** | DoD strict, aucune US hors liste sans revue PO/PM. |

## 7. Livrables de fin de sprint
1. Monorepo fonctionnel (mobile + web + api) sur GitHub.
2. Parcours jouable de bout en bout (démo enregistrée).
3. Spécifications fonctionnelles des modules Lot C–H.
4. Tests unitaires + intégration (coverage cible ≥ 80 % sur `core` + `api`).
5. Documentation utilisateur (enfant, parent) et développeur (README, décisions ADR).
6. Rapport de conformité a11y (WCAG AA) et RGPD (checklist).
