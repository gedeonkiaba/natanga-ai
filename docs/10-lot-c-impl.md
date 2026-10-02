# Lot C implémenté — Auth & consentement RGPD/COPPA

> Suivi d'implémentation Sprint 1. Référence spec : `docs/08-spec-lot-c-consentement-rgpd.md`.

## Ce qui a été livré (API NestJS)

| Élément | Fichier | Rôle |
|---|---|---|
| Machine à états (domaine) | `packages/core/src/consent/index.ts` | Transitions PENDING→GRANTED/DENIED, GRANTED→REVOKED/EXPIRED, etc. |
| Repository en mémoire | `apps/api/src/consent/memory.repository.ts` | Persistance injectable (remplaçable par Prisma A.4), append-only |
| Service consent | `apps/api/src/consent/consent.service.ts` | Ordonnance la machine à états + dérive le statut enfant |
| Auth service | `apps/api/src/auth/auth.service.ts` | register + verify-email + anti-énumération + hachage |
| Children service | `apps/api/src/children/children.service.ts` | Profil enfant, garde-fou âge COPPA (6-12), tranche dérivée |
| Gdpr service | `apps/api/src/gdpr/gdpr.service.ts` | Export (accès/portabilité) + suppression idempotente |
| Contrôleurs | `auth/children/consent/gdpr/*.controller.ts` | Endpoints REST |
| Filtre d'exception | `apps/api/src/common/domain-exception.filter.ts` | RFC 7807, sans fuite interne |
| Module global | `apps/api/src/common/shared.module.ts` | Instance unique de `MemoryRepository` partagée |

## Endpoints (préfixe `/api`)

| Méthode | Chemin | Rôle |
|---|---|---|
| POST | `/auth/register` | Créer compte parent |
| POST | `/auth/verify-email` | Vérifier email (token mono-usage) |
| POST | `/children` | Créer profil enfant |
| GET | `/children` · `/children/:id` | Lister / lire |
| POST | `/children/:childId/consents` | grant / deny / revoke |
| GET | `/children/:childId/consents` | Historique append-only |
| GET | `/children/:childId/export` | Export RGPD |
| DELETE | `/children/:childId` | Suppression (cascade, idempotente) |

## Validation effectuée

| Vérification | Résultat |
|---|---|
| `@natanga/api` typecheck | ✅ |
| `@natanga/api` `nest build` | ✅ |
| `@natanga/api` tests unitaires (jest) | ✅ 15/15 |
| `@natanga/api` tests e2e (parcours complet) | ✅ 2/2 |
| `@natanga/core` tests (machine à états incluse) | ✅ 19/19 |

## Décisions techniques

1. **Persistance en mémoire** (repository injectable) — permet de tester la logique sans BDD ;
   l'interfaçage Prisma/Postgres (tâche A.4) ne touchera pas les services.
2. **Machine à états dans `@natanga/core`** — logique pure partagée et testée, réutilisée
   par l'API pour rester fidèle à la spec §3.
3. **Anti-énumération** — statut HTTP unique (401) pour `ERR_REGISTER`/`ERR_TOKEN` ;
   messages ne révèlent pas l'existence d'un compte.
4. **Audit append-only** — chaque transition crée un enregistrement versionné ;
   `ipPrefix` tronqué (jamais d'IP complète), source + horodatage.
5. **Garde-fou COPPA** — âge < 6 ou > 12 refusé (`ERR_AGE`, 422).

## Limites connues (à traiter ultérieurement)

- **Hachage SHA-256** en démo → remplacer par **Argon2id** en production (spec §8).
- **Auth par en-tête `x-user-id`** → remplacer par **JWT/RBAC** complet.
- **Token d'email non exposé** (interne) → brancher un envoi d'email réel (SMTP/transactionnel).

---

## Persistance : abstraction Repository + Prisma/Postgres (tâche A.4)

Le `MemoryRepository` a été **généralisé derrière une interface `Repository`** (asynchrone),
avec deux implémentations interchangeables pilotées par `DB_PROVIDER` :

| Implémentation | Fichier | Usage |
|---|---|---|
| `MemoryRepository` | `apps/api/src/consent/memory.repository.ts` | dev/tests (défaut) |
| `PrismaRepository` | `apps/api/src/consent/prisma.repository.ts` | Postgres (prod) |

- **Injection par token** `REPOSITORY` (Symbole) — les services ne connaissent pas
  l'implémentation concrète.
- **`SharedModule`** global choisit l'implémentation via `useFactory` (ConfigService).
- **`PrismaService`** ne se connecte que si `DB_PROVIDER=prisma` (évite toute exigence de
  BDD pendant les tests du socle).
- **Schéma Prisma** (`apps/api/prisma/schema.prisma`) : `User`, `Child`, `Consent`
  (append-only, `@@unique([childId, version])`), `EmailToken`.
- **Migration SQL initiale** fournie (`prisma/migrations/0001_init/migration.sql`) pour la
  traçabilité (le `migrate diff` étant bloqué par le sandbox en session).
- **docker-compose** PostgreSQL + API fourni à la **racine** (`docker-compose.yml`),
  orchestrant le stack e2e complet.

### Validation de la tâche A.4

| Vérification | Résultat |
|---|---|
| `@natanga/api` typecheck | ✅ |
| `@natanga/api` `nest build` | ✅ |
| `@natanga/api` tests unitaires | ✅ 15/15 |
| `@natanga/api` tests e2e | ✅ 2/2 |
| `prisma generate` | ✅ (client généré) |

### Pour basculer en Postgres

1. `docker compose up -d --build` (postgres + api, voir `docs/16-runbook-e2e.md`)
2. `.env` → `DB_PROVIDER=prisma` + `DATABASE_URL=postgresql://natanga:natanga@localhost:5432/natanga`
3. `pnpm --filter @natanga/api prisma:deploy` (applique la migration)
4. `pnpm --filter @natanga/api dev`
