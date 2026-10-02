# 26 — Sprint NEXUS « Startup MVP Build » : journal des phases et des gates

> **Date** : 02/10/2026 · **Mode** : NEXUS-Sprint · **Objectif** : de l'existant à un produit
> utilisable par de vraies familles, vite, sans sauter la QA.
> Règle appliquée : **aucune phase n'avance sans preuve** (commande exécutée + résultat).

## Équipe mobilisée

| Rôle | Apport dans ce sprint |
|---|---|
| Agents Orchestrator / Senior PM | Phasage, gates, arbitrages de périmètre |
| Sprint Prioritizer | Périmètre « bêta fermée » (§2) |
| UX Architect / Frontend Developer | Client web parent + atelier de lecture enfant (`apps/web`) |
| Backend Architect | Bloquants de lancement API (`apps/api-laravel`) |
| DevOps Automator / Infrastructure Maintainer | CI, Dockerfiles, `docker-compose.prod.yml`, Caddy |
| Evidence Collector | E2E Playwright desktop + mobile, axe, captures |
| Reality Checker | Revue indépendante (agent séparé) → verdict initial **NEEDS WORK** (§4) |
| Analytics Reporter | `docs/sql/kpi-beta.sql` (validé sur PostgreSQL) |
| Growth Hacker / Content Creator / Social Media Strategist / Brand Guardian | `docs/27-kit-lancement-beta.md` |
| Performance Benchmarker | First Load JS ≤ 111 kB par page (build Next) |

## 1. Phase 0 — Découverte (état réel mesuré)

| Élément | Constat | Preuve |
|---|---|---|
| API Laravel | 136 tests Pest verts | `vendor/bin/pest` |
| `packages/core` · `packages/ui` | 34 + 8 tests verts | `pnpm -r test` |
| Email de vérification | token stocké, **jamais envoyé** → aucun parent activable | `AuthService::register` |
| Client utilisable | `apps/web` = page statique ; Flutter non buildable ici ; RN sans auth | lecture du code |
| CI | rouge (typecheck NestJS, `test` sans fichiers), pas de job Laravel | exécution locale |
| Lint a11y (US-32) | n'a jamais tourné : ESLint sans parseur TypeScript | `pnpm lint` |

## 2. Phase 1 — Périmètre du sprint (bêta fermée)

**Dans** : bloquants backend · client web parent + enfant · CI + déploiement · QA de bout en bout ·
kit de lancement. **Hors** : Flutter/RN, diagnostic A→E, arbre de compétences UI, ASR, M3.

## 3. Phases 2–3 — Construction et défauts trouvés par la preuve

Chaque défaut ci-dessous passait **tous les tests existants**. Ils ont été trouvés en exécutant le
produit réel (HTTP, navigateur, PostgreSQL) :

| # | Défaut | Impact en production | Correctif | Preuve |
|---|---|---|---|---|
| 1 | Email de vérification jamais envoyé | aucun compte activable | `VerifyEmailMail` + `/auth/resend-verification` | `LaunchReadinessTest` |
| 2 | Sessions : contrat camelCase documenté, snake_case exigé | 422 pour tout client conforme | normalisation (les deux acceptés) | idem |
| 3 | Route inconnue → stacktrace complète | fuite d'informations | rendu RFC 7807 404/405 | idem |
| 4 | Throttle 10/min par IP derrière le proxy web | **10 connexions/min pour tout le site** | `TRUSTED_PROXIES` + IP issue de Caddy | E2E + test Pest |
| 5 | Ids de contenu (`n-letters-a`) et de consentement (`{childId}:{uuid}`) en colonnes `uuid` | **seed en échec au 1er déploiement ; accord parental impossible** sur PostgreSQL | migration `2026_10_02_000001` | Pest + E2E sur PostgreSQL |
| 6 | Store de cache par défaut `database` sans table `cache` | **inscription/connexion en 500** | migration `2026_10_02_000002` | test rouge sans / vert avec |
| 7 | Compte `demo@natanga.app` / `demo1234` seedé partout, id régénéré à chaque seed | compte public en prod, enfants orphelins | seed limité à local/testing, `insertOrIgnore` | `LaunchReadinessTest` |
| 8 | Thèmes des 90 textes attribués par rotation | « Espace » montre un mouton | **non corrigé** — tâche dédiée (R1) | capture E2E |

Client web livré : inscription → email → connexion → enfant → accord parental → bibliothèque
(niveau, thèmes) → lecteur (OpenDyslexic/Lexend, coloration syllabique, mot touché = lu à voix
haute et noté) → étoiles → tableau de bord parent → export JSON → effacement. Proxy `/api`
same-origin à `API_URL` lu à l'exécution.

## 4. Phase 4 — QA : Evidence Collector puis Reality Checker

**Revue indépendante (verdict initial NEEDS WORK)** — traitement :

| Sévérité | Constat du Reality Checker | Statut | Preuve après correctif |
|---|---|---|---|
| HIGH | Throttle contournable par `X-Forwarded-For` falsifié (15 × 401, jamais 429) | ✅ corrigé : le web ignore l'XFF reçu, lit `CLIENT_IP_HEADER` (X-Real-IP écrasé par Caddy) ; limite **par email** en plus | même attaque rejouée : `401 ×10 puis 429` ; autre client non bloqué |
| HIGH | Parent non vérifié bloqué (lien expiré, autre appareil) | ✅ formulaire « Renvoyer le lien » sur `/verifier` et sur `ERR_NOT_VERIFIED` | E2E « lien invalide ou expiré » |
| HIGH | L'enfant atteint l'espace parent (retrait d'accord, suppression) en un geste | ✅ barrière parentale (multiplication 12–89 × 3–9), reverrouillée en lecture, déconnexion masquée côté enfant | E2E étape 10 |
| MEDIUM | Inscription révèle qu'un email existe (`ERR_REGISTER`) | ⏸ **décision produit** : contrat consommé par Flutter (doc 25) | — |
| MEDIUM | Temps de réponse du resend révèle un compte en attente | ✅ envoi différé après la réponse (`defer`) | tests email verts |
| MEDIUM | Jeton expiré en pleine lecture → l'enfant est renvoyé vers la connexion | ✅ événements en mode `silent` | revue de code |
| MEDIUM | Pas de CSP | ✅ CSP stricte (aucune origine tierce) ; `'unsafe-inline'` script requis par Next sans nonce (R3) | en-têtes `next.config.ts` |
| MEDIUM | SMTP manquant → 201 sans email | ✅ `MAIL_HOST` obligatoire dans compose | `docker compose config` échoue sans |
| MEDIUM | Étoiles « gratuites » (`correctWords` > `wordsRead`) | ✅ `lte:words_read` + bornes réalistes | test Pest 422 |
| MEDIUM | FrankenPHP non-root : `/data/caddy` non inscriptible | ✅ chown + **job CI de build et démarrage réel de l'image** | à constater au 1er run CI |
| LOW | Double envoi « J'ai fini » | ✅ garde `useRef` | — |
| LOW | Swagger publié via le web | ✅ bloqué par le proxy | E2E |
| LOW | Base SQLite de test dans l'historique git (a0fbd60) | ⏸ réécriture d'historique = décision du propriétaire | — |
| LOW | Migrations + seed à chaque démarrage | ⏸ OK en mono-instance ; `RUN_SEED=false` + job de release avant multi-réplicas | — |
| LOW | Syllabation : « Noël », « pays » non découpés | ⏸ heuristique documentée | — |

**Preuves finales (re-exécutées après correctifs)**

| Contrôle | Résultat |
|---|---|
| Pest — SQLite | **151 tests / 661 assertions** ✅ |
| Pest — **PostgreSQL 16** | **151 / 661** ✅ |
| Lint (jsx-a11y effectif) · typecheck | 4/4 workspaces ✅ |
| Tests unitaires JS | web 19 · core 34 · ui 8 ✅ |
| E2E Playwright (desktop + Pixel 7) — SQLite et PostgreSQL + cache `database` | **8/8** ✅ ×2 |
| axe WCAG 2.1 A/AA (9 écrans × 2 viewports) | 0 violation sérieuse/critique ✅ |
| Build Next | First Load JS ≤ 111 kB ✅ |
| Images Docker | ⚠️ **non construites ici** (pas de démon) → job CI `images` |

## 5. Risques ouverts

| # | Risque | Action | Responsable |
|---|---|---|---|
| R1 | Thèmes des textes faux (rotation) ; `ContentSeedTest` impose 15/thème | re-catégoriser les 90 textes avant d'inviter des familles | Content Creator |
| R2 | Police par défaut = `system` (API), pas OpenDyslexic | décider le défaut produit (impacte aussi Flutter) | PM |
| R3 | Jeton parent en localStorage 30 j (XSS ⇒ vol) | cookie httpOnly via le proxy + CSP à nonce avant bêta ouverte | Frontend |
| R4 | Énumération d'email à l'inscription (`ERR_REGISTER`) | 201 neutre + email « compte existant » ; adapter Flutter | Backend + PM |
| R5 | Effacement en cascade ⇒ KPI sous-estimés pour les enfants effacés | accepté (RGPD prime) | Analytics |
| R6 | `apps/mobile` sans aucun test ; `apps/api` (NestJS) encore présent | retirer NestJS (ADR 18) | Senior PM |

## 6. Phase 5 — Mise en production (à exécuter, non faite dans ce sprint)

1. Serveur UE + DNS → `PUBLIC_DOMAIN`. 2. `.env.prod` depuis `.env.prod.example`.
3. `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build`.
4. Vérifier : `https://$PUBLIC_DOMAIN/api/health`, parcours complet avec une vraie boîte email
   (Gmail + Outlook), en-têtes de sécurité. 5. Sauvegarde PostgreSQL quotidienne + test de restauration.
6. Lancer le kit `docs/27`.

**Verdict de gate** : prêt pour une **bêta fermée** (≤ 30 familles invitées) une fois R1 traité
et le job CI `images` vert. Pas prêt pour une ouverture publique (R3, R4).
