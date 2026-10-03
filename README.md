# Natanga

Application d'apprentissage de la **lecture et de l'écriture** en français pour les enfants
de **6–12 ans** en difficulté (dyslexie, dysorthographie, TDAH, retard de lecture).

> ⚠️ L'application **entraîne** et **soutient** ; elle **ne diagnostique pas** et
> **ne remplace pas** un orthophoniste ou un enseignant.

## Monorepo

| Package | Rôle | Stack |
|---|---|---|
| `apps/mobile` | App mobile Expo : maquette, parcours et leçons, hors connexion — voir son README | React Native (Expo SDK 57) |
| `apps/mobile-flutter` | App mobile Flutter : maquette, parcours et leçons, hors connexion, espace parent (API) — voir son README | Flutter |
| `apps/web` | **Client MVP** : vitrine, espace parent, atelier de lecture enfant | Next.js (App Router) |
| `apps/api` | Backend (transition vers `api-laravel`) | NestJS + PostgreSQL + Redis |
| `apps/api-laravel` | Backend cible (contrat API identique) | Laravel + PostgreSQL |
| `packages/core` | Logique métier partagée (types, algorithmes pédagogiques) | TypeScript |
| `packages/ui` | Design system accessible | React + tokens |

## Prérequis

- Node.js ≥ 20 (testé avec v24)
- pnpm ≥ 9 (testé avec 12.4.1)

## Démarrer

```bash
pnpm install          # installe toutes les dépendances du workspace
pnpm dev:api          # lance le backend
pnpm dev:web          # lance le web
pnpm dev:mobile       # lance l'app mobile (Expo)
```

> ⚠️ **Backend Laravel** (`apps/api-laravel`) : hors workspace pnpm (PHP/Composer). Lancement
> via `php artisan serve` — voir [`docs/19-runbook-bascule-laravel.md`](docs/19-runbook-bascule-laravel.md).
> Le backend cible est Laravel (contrat API identique à NestJS).

## Lancer le MVP web en local (API Laravel + web)

```bash
cd apps/api-laravel && composer install && cp .env.example .env   # puis DB_* (SQLite ou PostgreSQL)
php artisan key:generate && php artisan migrate --seed && php artisan serve   # :8000
pnpm --filter @natanga/web dev                                                 # :3000 (proxy /api → API_URL, défaut http://localhost:8000)
```

En local, `MAIL_MAILER=log` : le lien de vérification d'email est écrit dans
`apps/api-laravel/storage/logs/laravel.log`.

Tests de bout en bout (navigateur, desktop + mobile, contrôles d'accessibilité axe) :

```bash
pnpm --filter @natanga/web build && pnpm --filter @natanga/web test:e2e
# sur PostgreSQL : DB_CONNECTION=pgsql DB_HOST=… DB_DATABASE=… DB_USERNAME=… pnpm --filter @natanga/web test:e2e
```

Production : `docker-compose.prod.yml` + `.env.prod` (voir `.env.prod.example` et
[`docs/26-sprint-nexus-mvp.md`](docs/26-sprint-nexus-mvp.md)).

## Scripts racine

| Script | Description |
|---|---|
| `pnpm build` | Build tous les packages/apps (via Turbo) |
| `pnpm lint` | Lint (inclut les règles a11y) |
| `pnpm typecheck` | Vérification de types |
| `pnpm test` | Tests unitaires + intégration |
| `pnpm format` | Formatage Prettier |

## Documentation

Voir le dossier [`docs/`](docs/) : cahier des charges, arborescence, backlog, stack, plan de
sprint et spécifications fonctionnelles.

## Conformité

- **RGPD / COPPA** : consentement parental explicite, minimisation, hébergement UE.
- **Accessibilité** : WCAG 2.1 AA (police OpenDyslexic/Lexend, TTS, contrastes).

## Licence

Propriétaire — tous droits réservés (associataire éducatif / éditeur EdTech).
