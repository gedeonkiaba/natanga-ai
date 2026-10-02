# Chantier Phase 1 — Cœur pédagogique jouable (MVP enfant)

> Spécification détaillée du chantier **P1** (`docs/22-phases-developpement.md`).
> Objectif unique : **un enfant de 6–12 ans diagnostique puis joue une leçon de bout en bout
> sans aide d'un adulte.**
>
> Statut du socle : P0 quasi terminé (machine à états consentement Laravel, arbre + leçon
> niveau 1 TS, TTS, design system). Ce document décrit **l'à-faire** pour verrouiller P1.

---

## 1. Périmètre

| # | Fonctionnalité | Réf. plan | État actuel |
|---|---|---|---|
| A | Diagnostic adaptatif complet (A→E) | F1.1/1.2/1.3 | 🟡 placement TS v0 |
| B | Arbre 5 niveaux + déblocage | F3.1 | 🟡 3 nœuds TS |
| C | Contenu 90 textes (bibliothèque contrôlée) | F3.6 | 🔴 7 graphèmes/2 leçons |
| D | Gamification complète (badges/étoiles/avatar/seuils) | F4.1/4.2/4.3 | 🟡 gemmes seules |
| E | Polices + réglages accessibilité | F2.1 | 🟡 tokens, polices non embarquées |
| F | TTS mot/syllabe | F2.2 | 🟡 TTS générique |

**Hors P1** (reporté P2+ ) : 8 axes C1→C8, adaptation phonologique, SRS branché, ASR,
dashboard parent, analytics, espace ortho.

---

## 2. Décision d'architecture P1

**La source de vérité de la pédagogie bascule de `@natanga/core` (TS) vers Laravel.**
Conformément à l'ADR 18 (`docs/18`), toute nouvelle logique métier est écrite **en PHP**,
pas en TypeScript. Le client Flutter devient le **client mobile de référence** pour P1 ;
`apps/mobile` (RN) est maintenu mais ne reçoit pas de nouvelle fonctionnalité.

| Élément | Choix |
|---|---|
| Logique métier | `apps/api-laravel/app/Domain/Pedagogy/*` (PHP, testé Pest) |
| Persistance | migration Laravel (extension des tables `docs/17`) |
| Vocabulaire produit | levels = `Découverte` / `Progression` / `Fluide` |
| Client de référence | Flutter (`apps/mobile-flutter`) |
| Contenu | seeders Laravel + tables `items`/`lessons`/`exercises` |

---

## 3. Modèle de données (extensions P1)

### 3.1 Table `diagnostics` (nouvelle)

```sql
CREATE TABLE diagnostics (
  id                uuid PRIMARY KEY,
  child_id          uuid NOT NULL,
  level_result      varchar NOT NULL,   -- decouverte | progression | fluide
  score             float NOT NULL,     -- score global 0..1
  speed_wpm         float NULL,         -- vitesse (mots/min)
  error_count       int NOT NULL DEFAULT 0,
  hesitation_count  int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE
);
CREATE INDEX idx_diagnostics_child ON diagnostics(child_id);
```

### 3.2 Colonnes ajoutées au contenu (pour les 90 textes)

| Table | Colonne | Type | Rôle |
|---|---|---|---|
| `lessons` | `kind` | varchar | `reading` (texte) vs `exercise` (leçon d'exercices) |
| `lessons` | `phonemes` | json | phonèmes travaillés (`["an","en","on"]`) |
| `lessons` | `age_min` | smallint | tranche d'âge minimale |
| `lessons` | `text` | text | texte à lire (pour `kind = reading`) |
| `items` | `syllables` | json | découpage syllabique pour TTS mot/syllabe |

> Ces colonnes servent la **F2.2** (TTS mot/syllabe) et la **F3.4** du P2 (ciblage
> phonologique) ; elles sont posées dès P1 pour éviter une migration en P2.

---

## 4. Diagnostic adaptatif (A)

### 4.1 Épreuves A→E

| Épreuve | Contenu | Mesure | Réf. cahier des charges |
|---|---|---|---|
| **A** | Reconnaissance de lettres (7 graphèmes b/d/p/q inclus) | score | Niveau A |
| **B** | Lecture syllabique (ex. `ba`, `bo`, `di`) | score | Niveau B |
| **C** | Mots fréquents (`papa`, `maman`, `lapin`, `ballon`, `doigt`) | score | Niveau C |
| **D** | Pseudo-mots (`mifa`, `tobu`, `rali`, `poson`) | score + hésitations | Niveau D |
| **E** | Phrase simple (« Le lapin saute. ») | vitesse + erreurs | Niveau E |

### 4.2 Règle de dérivation du niveau (déterministe, explicable)

```
score_global = moyenne pondérée (A×1, B×1, C×1, D×1.5, E×1.5)
if score_global >= 0.8                 → « Fluide »
else if score_global >= 0.5            → « Progression »
else                                   → « Découverte »
```

> Le mapping « Découverte/Progression/Fluide » **remplace** le `startLevel` actuel de
> `placement.ts`, qui mappe sur des niveaux d'arbre. Les deux coexistent : le niveau **pilote**
> le point d'entrée dans l'arbre (B), le vocabulaire **sert au parent** (M5, P3).

### 4.3 Endpoints API

| Méthode | Chemin | Rôle |
|---|---|---|
| `POST` | `/api/diagnostics` | Enregistrer un diagnostic (reçoit scores par épreuve) |
| `GET`  | `/api/children/{childId}/diagnostics` | Historique des diagnostics (rejouable, visible parent) |

### 4.4 Service Laravel

`app/Domain/Pedagogy/DiagnosticEngine.php` : `computeLevel(probes): DiagnosticResult`.
Testé Pest : matrice de cas (score bas → Découverte, moyen → Progression, haut → Fluide),
pondération D/E, cas liste vide.

---

## 5. Arbre 5 niveaux (B)

### 5.1 Structure cible

```
letters → syllables → words → sentences → texts
   │           │           │          │           │
   1 nœud      1 nœud      1 nœud      1 nœud      1 nœud   (niveau 1)
```

- Déblocage séquentiel via `unlocked_when` (nombre de nœuds précédents maîtrisés).
- Chaque nœud = ≥ 1 leçon nivelée (Découverte / Progression / Fluide).
- Statuts : `locked` / `available` / `in_progress` / `mastered` (déjà modélisés).

### 5.2 Extension

Le `tree.ts`/`content.ts` TS actuels (3 nœuds `letters`) sont **remplacés** par un seeder
Laravel complet `TreeSeeder` qui génère les 5 nœuds. La progression reste dans `progress`
(`docs/17`).

---

## 6. Contenu 90 textes (C)

### 6.1 Structuration

| Niveau | # textes | Longueur cible | Phonèmes ciblés (exemples récurrents) |
|---|---|---|---|
| Découverte | 30 | 3–5 phrases courtes | voyelles simples + b/d/p/q |
| Progression | 30 | 5–8 phrases | digraphes `an/en/on`, `ou`, `oi` |
| Fluide | 30 | 8–12 phrases | graphies complexes, `in/ain`, `eu/œu` |

### 6.2 Métadonnées obligatoires par texte (cahier des charges)

`thème` · `âge` · `niveau` · `phonèmes travaillés` · `durée estimée`.

### 6.3 Règle stricte

**Aucune génération IA libre.** Chaque texte est **rédigé et validé** par un humain
(orthophoniste) avant intégration. Le seeder charge les 90 textes **idempotemment**.

### 6.4 Livrables

- `database/seeders/ReadingTextSeeder.php` (90 textes + exercices associés).
- Fichiers de données sources (JSON/CSV) sous `apps/api-laravel/database/content/` pour
  revue orthophoniste.

> **Capacité par sprint** : la rédaction/validation de 90 textes est le **plus long**
> chantier de P1. Découpage : livrer **Niveau Découverte (30) d'abord**, puis les 60 autres.

---

## 7. Gamification complète (D)

### 7.1 Modèle de récompenses (extension `rewards`)

`rewards.kind` étendu : `gems` | `badge` | `effort` | `star` | `avatar`.
Ajouter la table `unlocks` (déblocages) :

```sql
CREATE TABLE unlocks (
  id          uuid PRIMARY KEY,
  child_id    uuid NOT NULL,
  kind        varchar NOT NULL,   -- star | badge | avatar
  key         varchar NOT NULL,   -- ex. 'badge-3-lectures'
  unlocked_at timestamptz NOT NULL,
  FOREIGN KEY (child_id) REFERENCES children(id) ON DELETE CASCADE,
  UNIQUE (child_id, key)
);
```

### 7.2 Seuils de déblocage (cahier des charges)

| Seuil | Récompense |
|---|---|
| 3 lectures | étoile ☆ + badge « C'est parti ! » |
| 5 lectures | badge « Persévérant·e » |
| 10 lectures | accessoire avatar |
| 20 lectures | badge « Champion·ne » |

### 7.3 Règles bienveillantes (invariant)

- Récompense **d'effort** même en cas d'erreur (`GEMS_EFFORT` déjà présent).
- Aucune mécanique punitive ; le streak ne se perd jamais brutalement (`softenStreak`).
- Événement `reward_unlocked` émis (trace, alimente P4 analytics).

### 7.4 Service Laravel

`app/Domain/Gamification/GamificationEngine.php` : `rewardForAnswer()`, `checkUnlocks(readsDone)`,
`softenStreak()`. Transposé depuis `rewards.ts` puis **étendu** aux stars/badges/avatar/seuils.

---

## 8. Accessibilité & TTS (E, F)

### 8.1 Polices embarquées

- **Flutter** : ajouter `OpenDyslexic` + `Lexend` dans `pubspec.yaml` + `google_fonts`.
- **RN** : fichiers `.ttf` via `expo-font` + `app.json`.
- **Web** : `next/font`.
- Pile à fallback : `OpenDyslexic → Lexend → système` (déjà définie dans `theme`).

### 8.2 Réglages persistants

Réglages utilisateur : `font_size`, `line_spacing`, `contrast`, `theme` (clair/sombre).
Stockage local (SharedPreferences / AsyncStorage) — **pas** en base (préférence, pas donnée
d'apprentissage).

### 8.3 TTS mot/syllabe

- Le `SpeakButton` actuel lit une phrase entière. **Ajouter** `SpeakItem` (mot) et
  `SpeakSyllable` (syllabe) qui exploitent `items.syllables` (JSON) pour découper.
- Configuration fr-FR débit ralenti 0.45 (déjà en place).
- Événement `help_requested` déclenché quand l'enfant utilise l'aide TTS (trace P4).

---

## 9. Critères d'acceptation (gate de sortie P1)

| # | Critère | Mesure |
|---|---|---|
| G1 | Un enfant réalise une **leçon complète sans aide d'un adulte** | test utilisateur réel |
| G2 | Le **diagnostic ≤ 5 min**, rejouable, explicable au parent | chrono + écran parent |
| G3 | **90 textes** en base, chacun avec les 5 métadonnées | requête seed |
| G4 | **3 niveaux** (Découverte/Progression/Fluide) pilotent l'entrée dans l'arbre | test |
| G5 | **4 seuils** de gamification (3/5/10/20) déclenchés et tracés | test |
| G6 | **100 % des écrans** de la boucle enfant WCAG 2.1 AA | audit axe/contraste |
| G7 | Polices OpenDyslexic/Lexend **embarquées** et TTS **mot/syllabe** fonctionnels | test manuel |

---

## 10. Plan de tests

| Niveau | Cible | Outil |
|---|---|---|
| Unitaire | `DiagnosticEngine`, `GamificationEngine` (transposés), seuils de déblocage | Pest |
| Unitaire | dérivation Découverte/Progression/Fluide (matrice) | Pest |
| Intégration | endpoints `/api/diagnostics`, seeders (90 textes idempotents) | Pest Feature |
| e2e | parcours diagnostic → leçon → récompense | `e2e-acceptance.mjs` étendu |
| Accessibilité | contraste/taille police/TTS | audit manuel + axe (P4) |

---

## 11. Découpage en tâches (ordre de réalisation)

| # | Tâche | Dépend de | Livrable | Statut |
|---|---|---|---|---|
| T1 | Migration `diagnostics` + colonnes contenu + `unlocks` | — | migrations PHP | ✅ |
| T2 | `DiagnosticEngine` (épreuves A→E, dérivation 3 niveaux) + tests Pest | T1 | service + tests | ✅ |
| T3 | `GamificationEngine` (stars/badges/avatar/seuils) + tests Pest | T1 | service + tests | ✅ |
| T4 | Endpoints pédagogiques : `/api/diagnostics` (POST + historique), `/api/children/{id}/skill-tree`, `/api/lessons/{id}`, `/api/attempts`, `/api/children/{id}/rewards` | T2, T3 | routes + 4 contrôleurs + Feature tests | ✅ |
| T5 | Seeder contenu **Découverte (30 textes)** | T1 | `ReadingTextSeeder` | 🔴 |
| T6 | Seeder contenu **Progression + Fluide (60 textes)** | T5 | seeder complet | 🔴 |
| T7 | `TreeSeeder` (5 nœuds + leçons nivelées) | T5 | seeder arbre | 🔴 |
| T8 | Écrans Flutter : diagnostic jouable | T4 | `diagnostic_screen.dart` + widgets | 🔴 (débloqué) |
| T9 | Écrans Flutter : lecture de texte + TTS mot/syllabe | T6, T7 | `reading_screen.dart` + `SpeakItem`/`SpeakSyllable` | 🔴 |
| T10 | Écrans Flutter : récompenses/seuils | T3 | gamification UI | 🔴 (débloqué) |
| T11 | Polices embarquées (Flutter/RN/web) + réglages persistants | — | fonts + prefs | 🔴 |
| T12 | Extension `e2e-acceptance.mjs` (parcours P1) | T4, T8 | script e2e | 🔴 (débloqué) |

**Chemin critique :** T1 → T2/T3 → T4 → T8 → T12, avec T5/T6 alimentant T9.

---

## 12. Risques & mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Rédaction/validation des 90 textes déborde | retarde T6/T9 | livrer Découverte (30) d'abord ; externaliser la rédaction à un ortho |
| Bascule de logique TS→Laravel incohérente | duplication métier | gel de `@natanga/core` pédagogie ; test miroir Pest |
| TTS syllabique dépend du découpage | F2.2 partielle | `items.syllables` fourni dans le seeder ; fallback lecture mot entier |
| Polices dyslexie absentes des builds | G7 échoue | vérifier `pubspec.yaml`/`app.json` dès T11, pas à la fin |
