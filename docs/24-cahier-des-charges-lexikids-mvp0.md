# 24 — Implémentation backend du cahier des charges LexiKids (MVP0)

> **Date** : 22/09/2026
> **Périmètre** : backend uniquement (`apps/api-laravel`, source de vérité PHP — ADR 18).
> **Source** : `cahier-des-charges-general-lexikids.docx` (LexiKids AI / ReaderIA v1.0), modules M1, M2, M4, M5. **M3 (écriture/OCR) reporté, hors MVP0.**

---

## 1. Contexte et objectif

Le cahier des charges LexiKids v1.0 décrit 5 modules. Le backend Laravel existant (Natanga) a été étendu pour couvrir les modules requis en MVP0, sans jamais logique métier hors PHP. Le travail a été réparti entre un orchestrateur (fichiers partagés) et **4 sous-agents** (fichiers strictement disjoints, contrats imposés à l'avance).

| Module | Intitulé | Statut |
|---|---|---|
| M1 | Onboarding (intérêts, niveau, avatar) | ✅ livré |
| M2 | Atelier de lecture assistée (bibliothèque, sessions, accessibilité, événements) | ✅ livré |
| M3 | Écriture / OCR | ⏸ reporté (hors MVP0) |
| M4 | Gamification minimale (étoiles + déblocages) | ✅ livré (dans M2) |
| M5 | Espace parent minimal (dashboard) | ✅ livré |

---

## 2. Organisation du travail (répartition)

### 2.1 Orchestrateur (fichiers partagés — interdits aux sous-agents)

- `routes/api.php` — 27 routes pré-câblées avant livraison des agents (contrats fixes).
- `bootstrap/app.php`, `tests/Pest.php` — configuration et helpers.
- Modèles (`Child`, `ReadingSession`, `ChildEvent`, enrichissement de `Child`).
- **4 migrations** (`2024_02_01_00000{1..4}`) : colonnes onboarding de `children` (`interests` json, `placement_level`, `accessibility` json), table `reading_sessions`, table `child_events`, colonnes `interest`/`reading_level` sur `lessons`.
- Intégration finale `DiagnosticController → OnboardingService::applyDiagnosticLevel`.

### 2.2 Sous-agents (fichiers disjoints)

| Agent | Module | Fichiers livrés |
|---|---|---|
| A | M1 Onboarding | `OnboardingService`, `OnboardingController`, `OnboardingProfileTest` |
| B | M2 + M4 Lecture | `TextLibraryService`, `ReadingSessionService`, `TextLibraryController`, `ReadingSessionController`, `ReadingWorkshopTest` |
| C | Contenu | `TreeSeeder` (7 nœuds / 5 niveaux), `ReadingTextSeeder` (90 textes), édition `DatabaseSeeder`, `ContentSeedTest` |
| D | M5 + accessibilité + événements | `ParentDashboardService`, `AccessibilityService`, `EventService`, `ParentDashboardController`, `AccessibilityController`, `EventController`, `ParentDashboardTest`, `AccessibilitySettingsTest` |

---

## 3. Endpoints livrés (27 routes, tous testés)

Base : `/api`. Erreurs en **RFC 7807** (`application/problem+json`, `type/title/status/code`).

### Auth & enfants (existant, complété)

| Méthode | Route | Rôle |
|---|---|---|
| POST | `/auth/register` | Inscription parent (201, PENDING_VERIFICATION) |
| POST | `/auth/verify-email` | Token mono-usage → parent ACTIVE |
| POST | `/children` | Créer un profil enfant (header `x-user-id`, parent vérifié sinon 422 `ERR_PARENT`) |
| GET | `/children` | Lister les enfants du parent |
| GET | `/children/{id}` | Détail enfant (404 `CHILD_NOT_FOUND` — **corrigé en RFC 7807 pendant le smoke test**) |

### M1 — Onboarding

| Méthode | Route | Contrat |
|---|---|---|
| PATCH | `/children/{id}` | `{avatar?, interests?}` — whitelist d'intérêts (`animaux`, `espace`, `contes`, `dinosaures`, `nature`, `musique`), 422 `ONBOARDING_INVALID_INTEREST` |
| POST | `/children/{id}/level` | `{level: "1"\|"2"\|"3"}` — ajustement parent, 422 `ONBOARDING_INVALID_LEVEL` |

**Attribution automatique** : `POST /diagnostics` applique désormais `OnboardingService::applyDiagnosticLevel` → `decouverte→1`, `progression→2`, `fluide→3`. La réponse inclut `placementLevel`. *Règle : le diagnostic ré-attribue à chaque exécution ; l'ajustement parent vient ensuite.*

### M2 — Atelier de lecture

| Méthode | Route | Contrat |
|---|---|---|
| GET | `/children/{childId}/texts` | Bibliothèque pré-écrite `kind=lecture` filtrée par `reading_level` (défaut : niveau de l'enfant) + `?interest=`, `?level=1..3`. 422 `TEXT_LIBRARY_INVALID_LEVEL` |
| GET | `/lessons/{id}` | Détail d'un texte |
| POST | `/children/{childId}/sessions` | `{lessonId?, durationSec, wordsRead, correctWords, completed}` → 201 `{session, reward, unlocked}` |
| GET | `/children/{childId}/sessions` | Historique des sessions |
| GET | `/children/{childId}/settings` | Réglages accessibilité (défauts : `voiceSpeed 1.0`, `syllableColoring true`, `fontFamily system`, `fontScale 1.0`) |
| PATCH | `/children/{childId}/settings` | Validation stricte (plages 0.5–1.5 / bool / `system|dyslexic|lexend` / 0.8–2.0), 422 `ACCESSIBILITY_INVALID_SETTING` |
| POST | `/children/{childId}/events` | Événements produit whitelistés (`help_requested`, `word_blocked`, `session_interrupted`, `text_opened`, `onboarding_started`, `onboarding_completed`, `diagnostic_started`, `diagnostic_completed`), 422 `EVENT_INVALID_NAME`, sans PII |

### M4 — Récompenses (dans les sessions)

- Session `completed` → **1 étoile**, +1 si précision `correctWords/wordsRead ≥ 0.8` (sinon 0).
- Étoiles > 0 → `Reward{kind: star, reason: "session terminée"}`.
- Déblocages via `GamificationEngine::unlocksFor` sur le **comptage de sessions completed** (seuils 3/5/10/20), `Unlock` unique par enfant, nouveaux déblocages renvoyés dans `unlocked`.

### M5 — Espace parent

| Méthode | Route | Contrat |
|---|---|---|
| GET | `/parent/dashboard/{childId}` | `{child, today, totals, progression, confusions (top 3 `errorKind`), recentSessions (5), diagnostic, recommendations}` — vocabulaire parent-friendly FR < 120 car. |

### Existant connecté au parcours

`POST /attempts` (récompense effort : erreur = 5 gemmes), `GET /children/{childId}/skill-tree`, `GET|POST /children/{childId}/consents` (grant/deny/revoke append-only), `GET /children/{childId}/export`, `DELETE /children/{childId}` (effacement cascade idempotent), `GET /children/{childId}/diagnostics`, `GET /children/{childId}/rewards`, `GET /health`.

---

## 4. Contenu pré-écrit (seeders)

- `TreeSeeder` : arbre **5 niveaux** idempotent (`updateOrInsert`), ids niveau 1 réutilisés de `PedagogySeeder` (aucune régression `SkillTreeTest`).
- `ReadingTextSeeder` : **90 textes** `kind=lecture` — 30 par `reading_level` (1/2/3), textes FR originaux age-appropriate (6–12 ans), intérêts tournants équilibrés (15 par intérêt), phonèmes, `ageMin`/`durationMin` croissants.
- `DatabaseSeeder` : `PedagogySeeder → TreeSeeder → ReadingTextSeeder`.

---

## 5. Tests et vérification

### 5.1 Suite Pest (automatisée)

- **81 tests / 403 assertions — verts** (`vendor\bin\pest`, SQLite `:memory:`).
- Nouveaux : `OnboardingProfileTest` (7), `ReadingWorkshopTest` (12), `ContentSeedTest` (4), `ParentDashboardTest` (7), `AccessibilitySettingsTest` (5).
- `vendor\bin\pint --dirty` : style conforme.

### 5.2 Smoke test HTTP réel (script `smoke-test.ps1`, `php artisan serve`)

Flux complet sur sqlite fichier (`.env` créé, `APP_KEY` générée, `migrate --seed`) — **26 appels, tous conformes** :

```
health 200 → register 201 → verify-email 201 → child 201 →
onboarding PATCH 200 → level 200 → texts 200 (niveau 2 + ?level=1) →
session 201 (stars=2, reward star) → sessions 200 →
settings GET/PATCH 200 + PATCH invalide 422 RFC 7807 →
event 201 + event invalide 422 RFC 7807 →
diagnostic 201 (level=decouverte → placementLevel=1) + liste 200 →
skill-tree 200 → lesson 200 → dashboard 200 → rewards 200 →
attempt 201 (reward effort +5) → consent GRANTED 201 + historique 200 →
export 200 → children 200 →
404 CHILD_NOT_FOUND RFC 7807 → 422 TEXT_LIBRARY_INVALID_LEVEL RFC 7807 →
DELETE 200 {erased:true} → children []
```

### 5.3 Corrections apportées pendant la vérification

1. **`public/index.php` manquant** → créé (le serveur artisan refusait de démarrer, `cwd public` inexistant).
2. **`GET /children/{id}` renvoyait `{"message":"not found"}`** (non RFC 7807) → corrigé en `DomainException('CHILD_NOT_FOUND')`.
3. `.env` + `database/database.sqlite` + `APP_KEY` créés localement pour le smoke test (P0 : étaient absents).

---

## 6. Écarts cahier des charges vs implementation existante (à documenter côté produit)

| Sujet | Cahier LexiKids | Implémentation |
|---|---|---|
| Niveaux de lecture | **3 niveaux** (`reading_level` 1/2/3) | Arbre pédagogique Natanga à **5 niveaux** conservé (skills) ; les 2 modèles coexistent (`placement_level` = 1/2/3, `skill_nodes.level` = 1..5) |
| STT / TTS | Au cœur de l'atelier (lecture à voix haute) | **Non implémenté backend** (côté client) ; réglages `voiceSpeed`/`syllableColoring` exposés et persistés |
| Bibliothèque | Textes **pré-écrits** en MVP0 (pas de génération IA) | 90 textes seedés, aucune génération |
| Consentement voix | Consentement **distinct** pour l'enregistrement vocal | Consentement unique `grant/deny/revoke` pour l'instant — **à scinder (voix séparée) en post-MVP0** |
| M3 (écriture/OCR) | Mentionné | **Reporté hors MVP0** |
| `lesson_id` sur session | — | Référence souple **sans FK** (survit à la purge de contenu) ; `child_id` FK cascade (RGPD) |

---

## 7. Reste à faire (hors périmètre de ce lot)

- **Endpoint login / auth protégée** (P0 restant — les routes ne portent pas encore de middleware d'authentification ; `x-user-id` en header).
- Scinder le consentement **voix** du consentement général.
- Brancher STT/TTS côté client sur les réglages exposés.
- M3 (écriture/OCR) — spec à rédiger.
- Journal d'audit des accès parentaux (cf. doc 03).
