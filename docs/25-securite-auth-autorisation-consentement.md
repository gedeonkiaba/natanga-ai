# 25 — Sécurité API : authentification, autorisation parent→enfant, garde de consentement

> **Date** : 25/09/2026 · **Périmètre** : `apps/api-laravel` · **Statut** : livré, 136 tests Pest verts (588 assertions)
> Clôt le point « Endpoint login / auth protégée » du doc 24 §7 et supprime l'en-tête `x-user-id`.

## 1. Problèmes corrigés

| # | Avant | Risque | Après |
|---|---|---|---|
| 1 | Identité = en-tête `x-user-id` (falsifiable) | Usurpation de n'importe quel parent | Jeton Bearer opaque, haché, expirable |
| 2 | Aucune vérification de propriété sur `dashboard`, `sessions`, `settings`, `texts`, `children/{id}`, `consents`… | Lecture/modification des données de **n'importe quel enfant** (IDOR) | Policy `ChildPolicy::manage` + middleware `child.owner` sur toutes les routes enfant |
| 3 | Consentement jamais vérifié | Collecte de données d'un mineur sans consentement (RGPD art. 8 / COPPA) | Middleware `child.consent` : 403 `ERR_CONSENT_REQUIRED` tant que le consentement n'est pas GRANTED |
| 4 | N'importe qui pouvait `grant`/`revoke` le consentement de n'importe quel enfant | Falsification du registre de consentement | Consentement réservé au parent titulaire |

## 2. Authentification (guard `api`)

- **Choix** : guard natif Laravel `Auth::viaRequest('api-token', TokenGuard)` — pas de dépendance.
  Sanctum n'a pas pu être installé depuis l'environnement de dev (registre Packagist bloqué) ;
  le modèle (`api_tokens`, jeton haché, `currentToken`) est volontairement proche de Sanctum pour
  une migration ultérieure si souhaité.
- **Jeton** : 64 caractères aléatoires, renvoyé **une seule fois** au login ; seul le **SHA-256** est
  stocké (`api_tokens.token_hash`). TTL **30 jours**. `last_used_at` rafraîchi au plus 1×/min.
- **Refus** (401 `ERR_UNAUTHENTICATED`, RFC 7807) : jeton absent / inconnu / expiré, ou compte parent non `ACTIVE`.
- **Anti-énumération** : email inconnu et mauvais mot de passe → même réponse `401 ERR_LOGIN`
  (hash factice pour égaliser le temps). `403 ERR_NOT_VERIFIED` n'est révélé qu'après un mot de passe correct.
- **Anti-bruteforce** : `throttle:10,1` sur `register`, `verify-email`, `login`.

| Méthode | Route | Auth | Réponse |
|---|---|---|---|
| POST | `/auth/login` | — | `200 {token, tokenType:"Bearer", expiresInDays:30, userId}` · `401 ERR_LOGIN` · `403 ERR_NOT_VERIFIED` |
| POST | `/auth/logout` | Bearer | `204` — révoque **le jeton courant** uniquement (autres appareils conservés) |
| GET | `/auth/me` | Bearer | `200 {userId, email, status}` |

## 3. Autorisation parent → enfant (`child.owner`)

- `App\Policies\ChildPolicy::manage(User, Child)` : `child.user_id === user.id`.
- `App\Http\Middleware\EnsureChildOwnership` lit l'id dans : paramètre `childId` → paramètre `id` → champ `childId` du corps (`POST /diagnostics`, `POST /attempts`).
- Enfant inexistant **et** enfant d'un autre parent → **même** `404 CHILD_NOT_FOUND` (réponses identiques, testé).
- L'enfant résolu est disponible dans les contrôleurs via `$request->attributes->get('child')`.
- `DELETE /children/{childId}` reste **idempotent** : enfant inexistant ou d'autrui → `200 {erased:true}` **sans effet**.

## 4. Garde de consentement (`child.consent`)

S'appuie sur l'invariant C2 existant (`children.status = ACTIVE ⇔ dernier consentement GRANTED`).

| Nécessite consentement GRANTED (sinon `403 ERR_CONSENT_REQUIRED`) | Accessible au parent sans consentement |
|---|---|
| `PATCH /children/{id}` (onboarding), `POST /children/{id}/level` | `GET /children`, `GET /children/{id}` |
| `POST /diagnostics`, `POST /attempts` | `GET/POST /children/{id}/consents` |
| `GET /children/{id}/skill-tree`, `GET /children/{id}/texts` | `GET /children/{id}/export`, `DELETE /children/{id}` |
| `POST /children/{id}/sessions` | `GET /parent/dashboard/{id}` |
| `PATCH /children/{id}/settings`, `POST /children/{id}/events` | `GET …/sessions`, `…/settings`, `…/rewards`, `…/diagnostics` |

Principe : **aucune collecte ni usage par l'enfant** sans consentement ; le parent garde toujours
ses droits de consultation, d'export et d'effacement (y compris après `revoke`/`deny`).

## 5. Nouveaux codes d'erreur (RFC 7807)

| Code | HTTP | Cas |
|---|---|---|
| `ERR_UNAUTHENTICATED` | 401 | Jeton absent/invalide/expiré |
| `ERR_LOGIN` | 401 | Identifiants invalides |
| `ERR_NOT_VERIFIED` | 403 | Email non vérifié (après mot de passe correct) |
| `ERR_CONSENT_REQUIRED` | 403 | Activité enfant sans consentement actif |

## 6. Tests ajoutés

- `AuthTokenTest` (11) : login, hash non réversible, anti-énumération, 401 (sans jeton / inconnu / Basic / ancien `x-user-id`), expiration, compte suspendu, logout ciblé, throttle 429.
- `OwnershipTest` (22) : 18 routes × accès croisé → 404, réponse identique à « inexistant », aucune donnée d'autrui altérée, DELETE sans effet, liste filtrée.
- `ConsentGateTest` (21) : 9 activités → 403, aucune donnée collectée, 8 accès parent autorisés, cycle grant → revoke, deny, effacement sans consentement.
- Tests existants : authentifiés via `makeVerifiedChild()` (connecte le parent, consentement GRANTED par défaut) ; `ConsentFlowTest` passe désormais par le vrai `login` + Bearer.

## 7. Impacts clients

| Client | État |
|---|---|
| Flutter (`apps/mobile-flutter`) | ✅ **Adapté** — voir §7.1 |
| `scripts/e2e-acceptance.mjs` | ⚠️ À adapter : remplacer `x-user-id` par login + Bearer |
| Swagger | Schéma `bearerAuth` déclaré |

### 7.1 Client Flutter

- **Jeton** : `lib/auth/token_storage.dart` — `flutter_secure_storage` (Keychain / Keystore) + cache mémoire ; `InMemoryTokenStorage` pour les tests.
- **Intercepteur** : `lib/api/auth_interceptor.dart` — ajoute `Authorization: Bearer` (sauf routes publiques : `auth: false`) ; un 401 sur requête authentifiée ferme la session locale.
- **Session** : `lib/state/session_controller.dart` — `login` / `logout` / `expire`, restauration au démarrage via `GET /auth/me` (jeton expiré → effacé).
- **Routage** : `routerProvider` (go_router + `refreshListenable`) ; `/parent` protégé → `/login`. Règle pure `authRedirect` testée.
- **Écrans** : `LoginScreen` (`/login`), `ParentScreen` (`/parent` : enfants, ajout, donner/retirer l'accord parental), inscription déplacée sur `/register` (`Routes.consent` conservé en alias).
- **Erreurs** : `lib/ui/api_error_message.dart` — messages parent pour `ERR_LOGIN`, `ERR_NOT_VERIFIED`, `ERR_UNAUTHENTICATED`, `ERR_CONSENT_REQUIRED`, 429, hors ligne.
- **Correctif** : `Child.fromJson` accepte le snake_case renvoyé par `GET /children` (la liste plantait auparavant).
- **URL par défaut** : `http://localhost:8000` (Laravel). Émulateur Android : `--dart-define=API_BASE_URL=http://10.0.2.2:8000`.
- **Reste à faire** : `/tree` et `/lesson` affichent des données statiques ; dès qu'ils appelleront l'API, les ajouter à `_protectedPrefixes` et gérer `ERR_CONSENT_REQUIRED` (renvoi vers l'espace parent).

## 8. Suites recommandées

1. Envoi réel de l'email de vérification (aujourd'hui token en base uniquement).
2. Purge planifiée des jetons expirés (`api_tokens where expires_at < now()`).
3. Consentement **voix** distinct (doc 24 §6) → 2ᵉ garde `child.consent:voice`.
4. Journal d'audit des accès parent (doc 03).
5. Rôles orthophoniste/enseignant : étendre `ChildPolicy` via une table de partage consentie.
