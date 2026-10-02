# Plan de développement par module — Natanga

> Plan **fonctionnalité par fonctionnalité** de chaque module du cahier des charges
> (`docs/01` + document v0.1 collé). Chaque fonctionnalité est annotée de son **état
> d'implémentation** dans le monorepo, de son **rôle métier**, de sa **stack**, de sa
> **dépendance** et de ses **critères d'acceptation**.
>
> Légende d'état :
> - 🟢 **FAIT** — implémenté et testé dans le monorepo actuel.
> - 🟡 **PARTIEL** — socle posé, reste à compléter/brancher.
> - 🔴 **À FAIRE** — non implémenté (à planifier).
> - ⚪ **HORS MVP** — reporté (Phase 2+ / Could / Won't).

## Cartographie des modules

Le cahier des charges v0.1 définit **7 modules** ; le monorepo les porte à travers le
backlog (`docs/03`, US-01→US-32) et les lots livrés (`docs/09`→`docs/19`). Table de
correspondance :

| Module (cahier des charges) | User stories (backlog) | État global |
|---|---|---|
| M1 — Diagnostic adaptatif | US-04 (placement), US-05 (arbre) | 🟡 PARTIEL |
| M2 — Lecture assistée IA | US-13 (TTS/police), US-24 (ASR) | 🟡 PARTIEL (TTS oui, ASR hors MVP) |
| M3 — Moteur de compétences | US-07, US-08, US-20 (adaptation), US-12 (SRS) | 🟡 PARTIEL |
| M4 — Gamification | US-09, US-10, US-11, US-23 | 🟡 PARTIEL |
| M5 — Espace Parent | US-01, US-14, US-15, US-19 | 🟡 PARTIEL |
| M6 — Analytics | US-30 | 🔴 À FAIRE |
| M7 — Administration | US-17, US-18, US-27 (pro) | ⚪ HORS MVP (Phase 2) |

---

## Module 1 — Diagnostic adaptatif

**Objectif produit :** déterminer automatiquement le niveau de lecture (Découverte /
Progression / Fluide) en ≤ 5 minutes, sans surcharge cognitive.

### F1.1 — Test de positionnement (épreuves A→E)
| Élément | Détail |
|---|---|
| **Rôle métier** | Suite d'épreuves : A (reconnaissance lettres) → B (syllabique) → C (mots fréquents) → D (pseudo-mots) → E (phrase simple). Détermine le niveau de départ. |
| **État** | 🟡 PARTIEL — `packages/core/src/pedagogy/placement.ts` (seuil de maîtrise 0.7, `explanation` explicable) + tests `placement.test.ts` |
| **Manque** | Épreuves D/E (pseudo-mots, phrase) non modélisées ; le placement ne couvre que les voyelles/b-d/p-q de niveau 1. |
| **Stack** | Laravel (PHP) pour l'API `/placement` ; `@natanga/core` (TS) transposé en `app/Domain/Pedagogy/`. |
| **Dépendance** | F1.1 dépend de M3 (moteur de compétences pour scorer). |
| **Acceptation** | Score + vitesse + erreurs + hésitations stockées ; résultat Découverte/Progression/Fluide ; rejouable ; explicable au parent. |

### F1.2 — Stockage et trace du diagnostic
- **Rôle :** persister `score`, `vitesse`, `erreurs`, `hésitations` par enfant, horodatés.
- **État :** 🔴 À FAIRE — pas de table `diagnostic` (équivalent `placement_runs`).
- **Stack :** migration Laravel (table `diagnostics` : `child_id`, `level_result`, `score`, `speed_wpm`, `error_count`, `hesitation_count`, `created_at`) + FK cascade `Child`.
- **Acceptation :** rejouabilité du diagnostic ; historique consultable par le parent (M5).

### F1.3 — Niveaux dérivés (Découverte / Progression / Fluide)
- **Rôle :** mapper le score → 3 niveaux, et piloter le point d'entrée dans l'arbre (M3).
- **État :** 🟡 PARTIEL — `placement.ts` dérive un placement, mais le vocabulaire « Découverte/Progression/Fluide » n'est pas branché aux nœuds.
- **Acceptation :** chaque niveau ouvre une portion distincte de l'arbre de compétences.

---

## Module 2 — Lecture assistée IA

**Objectif produit :** faire lire l'enfant avec une assistance adaptative (police, TTS, aide anti-blocage), sans le laisser seul face au texte.

### F2.1 — Affichage du texte adapté (police, taille, espacement, contraste)
| Élément | Détail |
|---|---|
| **Rôle** | Polices OpenDyslexic / Lexend / standard ; taille, espacement, contraste réglables. |
| **État** | 🟡 PARTIEL — tokens + `fontFamilies` dans `packages/ui` et `apps/mobile-flutter/lib/theme/natanga_theme.dart` ; police dyslexie LS **posée** mais fichiers de polices réels **non embarqués** (`docs/11`, `docs/15`). |
| **Manque** | `expo-font` / `next/font` + fichiers `.ttf` OpenDyslexic/Lexend ; réglages utilisateur persistants (taille/espacement/contraste). |
| **Stack** | RN (`expo-font`) + Flutter (`pubspec` fonts) + web (`next/font`) ; tokens partagés. |
| **Acceptation** | WCAG 2.1 AA ; réglages persistants ; pile à fallback OpenDyslexic → Lexend → système. |

### F2.2 — Lecture audio (totale / mot / syllabe)
- **Rôle :** écoute complète, écoute d'un mot, écoute d'une syllabe — double canal texte/audio.
- **État :** 🟢 FAIT (TTS générique) — `TtsService`/`SpeakButton` (Flutter, `flush_tts` fr-FR débit 0.45) + `TTSButton`/`speech.ts` (RN, `expo-speech`) + web (`speechSynthesis`). Voir `docs/15`.
- **Manque :** granularité **mot / syllabe** (le lien mot→audio segmenté) non câblée ; `audio_url` existe dans `items` mais pas généré.
- **Acceptation :** chaque mot et chaque syllabe déclenchable individuellement ; débit adapté DYS.

### F2.3 — Assistance anti-blocage (si blocage > 3 s)
- **Rôle :** si l'enfant bloque > 3 s → proposer première syllabe, lecture du mot, encouragement vocal.
- **État :** 🔴 À FAIRE — aucun timer de blocage ni déclenchement d'aide.
- **Stack :** logique côté client (timer de 3 s) + `TtsService` pour l'encouragement ; événement `help_requested` (M6).
- **Acceptation :** seuil 3 s configurable ; aide non punitive ; tracé `help_requested`.

### F2.4 — Moteur IA d'analyse (omission / substitution / inversion / hésitation / répétition)
- **Rôle :** comparer texte attendu ↔ audio enfant, classer les erreurs (ex. `maison`→`mason` = substitution phonétique).
- **État :** ⚪ HORS MVP — ASR repoussé en Phase 2 (`docs/04`, US-24). Équivaut à la **Phase 0 (spike STT)** de la roadmap.
- **Stack :** Azure Speech / Whisper (français, hébergement UE) ; WER < 20 %, latence < 1,5 s.
- **Acceptation (Phase 2) :** classification fiable des 5 types d'erreurs ; mise à jour du moteur de compétences (M3) ; aucune donnée de santé collectée.

---

## Module 3 — Moteur de compétences

**Objectif produit :** suivre 8 axes de compétence (C1→C8) sur 0–100, mis à jour après chaque session, et adapter le parcours.

### F3.1 — Arbre de compétences (5 niveaux, déblocage séquentiel)
| Élément | Détail |
|---|---|
| **Rôle** | Arbre lettres → syllabes → mots → phrases → textes ; statuts `locked`/`available`/`mastered`. |
| **État** | 🟡 PARTIEL — `packages/core/src/pedagogy/tree.ts` + `content.ts` (7 graphèmes, 5 mots, 3 nœuds, 2 leçons, 4 exercices) ; écran `SkillTreeScreen` (Flutter ; version RN retirée le 02/10/2026). Schéma `skill_nodes`/`progress` en Laravel. |
| **Manque** | Contenu niveau 1 étendu (30 textes × 3 niveaux du cahier des charges = 90 textes) ; 5 niveaux réels (seulement 3 nœuds posés). |
| **Acceptation** | 5 niveaux visibles ; déblocage séquentiel (`unlockedWhen`) ; progression persistée par enfant. |

### F3.2 — Moteur de leçon (session 5–10 min)
- **Rôle :** séquence ordonnée d'exercices, soumission, score 0..1.
- **État :** 🟢 FAIT — `lesson.ts` + tests ; `LessonScreen` (Flutter ; version RN retirée le 02/10/2026).
- **Acceptation :** durée bornée ; sauvegarde d'état en sortie ; feedback bienveillant.

### F3.3 — 8 compétences C1→C8 (score 0–100)
- **Rôle :** C1 reconnaissance lettres, C2 décodage syllabique, C3 conscience phonologique, C4 mots fréquents, C5 pseudo-mots, C6 fluidité, C7 précision, C8 compréhension.
- **État :** 🔴 À FAIRE — le modèle suit des **nœuds**, pas encore les **8 axes** avec score 0–100. `Attempt.errorKind` est une métrique, pas un score par axe.
- **Stack :** table `skill_scores` (ou colonnes dérivées) + service Laravel `SkillProfile`. Inspiré des axes de compétence multi-dimensionnels (cf. cahier des charges, §10).
- **Acceptation :** 8 axes persistés, mis à jour **après chaque session** ; agrégation explicable.

### F3.4 — Adaptation automatique (ciblage des sons faibles)
- **Rôle :** si difficulté sur `an/en/on` → davantage de ces sons dans les lectures suivantes + exercices ciblés.
- **État :** 🟡 PARTIEL — `srs.ts` (SM-2 simplifié) et `adaptation/age-band.ts` posés ; pas de ciblage phonologique.
- **Stack :** règles déterministes d'abord (bandit/IRT ensuite, `docs/04`).
- **Acceptation :** le parcours se réajuste selon `errorKind` récurrents ; jamais d'échec bloquant.

### F3.5 — Révision espacée (SRS)
- **Rôle :** rappels programmés, échéances adaptées aux erreurs (US-12).
- **État :** 🟡 PARTIEL — `srs.ts` prêt, non branché au moteur de leçon.
- **Acceptation :** échéances calculées à chaque erreur/réussite ; consolidation durable.

### F3.6 — Contenu pédagogique (bibliothèque contrôlée, 90 textes)
- **Rôle :** 30 textes × 3 niveaux, chacun avec thème/âge/niveau/phonèmes/durée. **Pas de génération IA libre.**
- **État :** 🔴 À FAIRE — `content.ts` a 7 graphèmes/5 mots/2 leçons ; les 90 textes ne sont pas produits.
- **Stack :** seeder Laravel (`PedagogySeeder`) + table `items`/`lessons` + colonnes `theme`, `age_min`, `phonemes`, `duration_min`.
- **Acceptation :** bibliothèque validée par un orthophoniste ; aucun texte généré par LLM en MVP.

---

## Module 4 — Gamification

**Objectif produit :** récompenser l'effort (pas seulement la réussite), sans mécanique punitive.

### F4.1 — Récompenses (étoiles, badges, accessoires avatar)
| Élément | Détail |
|---|---|
| **Rôle** | Étoiles, badges, accessoires avatar débloqués à 3/5/10/20 lectures. |
| **État** | 🟡 PARTIEL — `rewards.ts` (gemmes/effort + réussite) + table `rewards` (Laravel, `kind` gems/badge/effort) . |
| **Manque** | Étoiles & badges & accessoires avatar (seules les gemmes sont modélisées) ; seuils 3/5/10/20 non implémentés. |
| **Acceptation** | Déblocage par seuils de lectures ; récompense **d'effort** même en cas d'erreur ; trace (`reward_unlocked`). |

### F4.2 — Streak & vies adoucis
- **Rôle :** streak qui ne se perd jamais brutalement ; aucune pénalité bloquante (US-09).
- **État :** 🟡 PARTIEL — `rewards.ts` inclut un streak adouci, mais pas de vies.
- **Acceptation :** encouragement systématique ; aucune mécanique punitive.

### F4.3 — Personnage compagnon personnalisable
- **Rôle :** avatar modifiable, réactions positives, univers lié à l'âge (US-11).
- **État :** 🟡 PARTIEL — `children.avatar` + `universe` (tranche 6–8/9–12) existent côté données (`docs/08`) ; UI de personnalisation non livrée.
- **Acceptation :** choix d'avatar (ex. renard/tortue/hibou) ; liens émotionnels positifs.

### F4.4 — Feedback positif immédiat (animations courtes, sons doux)
- **Rôle :** animations < 500 ms, sons désactivables, jamais de rouge agressif (US-23).
- **État :** 🟢 FAIT — feedback `warning` (orange doux) dans le design system (`docs/11`).
- **Acceptation :** sons désactivables ; conformité WCAG AA.

---

## Module 5 — Espace Parent

**Objectif produit :** suivre la progression sans jargon, gérer les données (RGPD/COPPA).

### F5.1 — Compte parent + consentement parental (RGPD/COPPA)
| Élément | Détail |
|---|---|
| **Rôle** | Création compte parent, consentement explicite révocable/versionné, anti-énumération. |
| **État** | 🟢 FAIT — machine à états `ConsentStateMachine` (TS → Laravel `app/Domain/Consent/`), services Auth/Children/Consent/Gdpr, routes `/api/*`, tests Pest + e2e. Voir `docs/08`, `docs/10`, `docs/18/19`. |
| **Acceptation** | Consentement non pré-coché ; révocation ≤ 2 actions ; audit append-only ; garde-fou âge 6–12. |

### F5.2 — Dashboard parent (temps, sessions, progression, compétences, difficultés)
- **Rôle :** temps de lecture, sessions réalisées, progression, compétences, difficultés détectées (b/d, p/q, syllabes) + recommandations.
- **État :** 🔴 À FAIRE — `apps/web` Next.js a seulement l'accueil/layout ; aucun dashboard de métriques.
- **Stack :** Next.js (`apps/web`) consommant une API Laravel `/parent/dashboard/{childId}` (agrégation `progress` + `attempts` + `rewards`).
- **Acceptation :** indicateurs clairs, vocabulaire non technique, actualisation quotidienne ; **60 % des parents consultent** (KPI).

### F5.3 — Export & suppression des données (droits RGPD)
- **Rôle :** export JSON/PDF, suppression cascade idempotente, délai < 30 jours (US-15, US-19).
- **État :** 🟢 FAIT — `GdprController` (`export`/`erase`) + cascades `ON DELETE CASCADE`. Export **JSON** ; **PDF** non encore produit.
- **Manque :** rendu PDF du rapport ; export CSV/PDF pour partage ortho (US-19).
- **Acceptation :** effacement idempotent ; confirmation < 30 jours ; export tracé en audit.

### F5.4 — Recommandations parent (lecture quotidienne, exercices ciblés)
- **Rôle :** recommandations actionnables et non techniques.
- **État :** 🔴 À FAIRE — dépend de F3.4 (adaptation) pour cibler les exercices.
- **Acceptation :** recommandations dérivées des `errorKind` récurrents, formulées simplement.

### F5.5 — Espace orthophoniste (V1) : export PDF + rapport mensuel
- **Rôle :** consultation historique, erreurs récurrentes, progression, export PDF, rapport mensuel.
- **État :** ⚪ PARTIEL → HORS MVP — le cahier des charges le place en « Espace orthophoniste (V1) » ; le backlog le reporte en US-17/18/19 (P1) et `docs/03` Phase 3.
- **Acceptation :** rapport mensuel partageable ; données agrégées, jamais de diagnostic.

---

## Module 6 — Analytics produit

**Objectif produit :** suivre l'usage sans tracking publicitaire (privacy-first).

### F6.1 — Événements d'onboarding & diagnostic
- **Rôle :** `onboarding_started`, `onboarding_completed`, `diagnostic_started`, `diagnostic_completed`.
- **État :** 🔴 À FAIRE — aucun SDK analytics branché.
- **Stack :** Plausible / PostHog self-hosted, hébergement UE, sans pub (`docs/04`, US-30).
- **Acceptation :** aucun cookie publicitaire ; anonymisation/agrégation ; transparence.

### F6.2 — Événements de session & engagement
- **Rôle :** `session_started`, `session_completed`, `help_requested`, `word_error_detected`, `reward_unlocked`.
- **État :** 🔴 À FAIRE.
- **Acceptation :** les 10 événements du cahier des charges émis et tracés ; alimentent les KPI (activation, engagement, rétention).

### F6.3 — Événement tableau de bord parent
- **Rôle :** `parent_dashboard_opened` → KPI « 60 % consultent le tableau de bord ».
- **État :** 🔴 À FAIRE — dépend de F5.2.
- **Acceptation :** taux de consultation mesurable.

### F6.4 — Suivi des KPI produit
- **Rôle :** activation 80 % onboarding / 70 % diagnostic ; rétention D7 > 40 % / D14 > 25 % ; WER < 20 % ; coût IA < 2 USD/enfant/mois.
- **État :** 🔴 À FAIRE — aucun tableau de bord KPI.
- **Acceptation :** dashboards produits branchés sur les événements ; les critères « définition du succès MVP » sont mesurables.

---

## Module 7 — Administration

**Objectif produit :** piloter l'accompagnement (enseignant/orthophoniste) et le contenu.

### F7.1 — Gestion de contenu pédagogique (bibliothèque contrôlée)
- **Rôle :** CRUD des textes/exercices validés (thème, âge, niveau, phonèmes, durée) — admin/interne.
- **État :** 🟡 PARTIEL — seeder `PedagogySeeder` ; aucun back-office CRUD.
- **Stack :** admin Laravel (Filament ou Nova) + les tables `items`/`lessons`/`exercises`.
- **Acceptation :** publication de contenu validé ; jamais de génération IA libre.

### F7.2 — Espace enseignant/orthophoniste (assignation, suivi de groupe)
- **Rôle :** assigner des leçons, suivi de groupe, identification des élèves en difficulté (US-17, US-18, US-27).
- **État :** ⚪ HORS MVP — Phase 3 de la roadmap (`docs/03`), US-17/18/27.
- **Acceptation (Phase 3) :** assignation individuelle/collective ; vues de groupe ; alertes douces.

### F7.3 — Gestion des comptes & conformité
- **Rôle :** supervision des consentements, purges RGPD, jobs de nettoyage (invariant C1 : pas d'enfant orphelin).
- **État :** 🟡 PARTIEL — cascades `ON DELETE CASCADE` posées ; job de purge nocturne **non** implémenté.
- **Acceptation :** purge vérifiée quotidiennement ; audit de conformité.

---

## Séquençage recommandé (par dépendances)

```
Sprint 1 (socle, FAIT)      M5.1 (consentement) · M3.1/3.2 (arbre+leçon) · M2.2 (TTS) · M4.4 (feedback)
Sprint 2                     M1.1/1.2/1.3 (diagnostic) · M3.6 (contenu 90 textes) · M4.1/4.2/4.3 (gamification)
Sprint 3                     M3.3/3.4/3.5 (axes 0-100 + adaptation + SRS) · M5.2/5.3/5.4 (dashboard+export+reco)
Sprint 4                     M6.1/6.2/6.3 (analytics) · M2.1/2.3 (polices + anti-blocage) · M5.5 (ortho export)
Phase 2 / Phase 3            M2.4 (ASR) · M7.1/7.2/7.3 (admin + pro)
```

**Contrainte transverse :** chaque module est livré côté **Laravel** (source de vérité métier),
consommé par les clients **Flutter / React Native / Next.js** sans dupliquer la logique.
