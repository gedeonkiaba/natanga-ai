# Runbook — Bascule backend Laravel

> Procédure pour installer, tester et valider le backend Laravel (`apps/api-laravel`),
> puis basculer depuis NestJS (`apps/api`).

## Prérequis

- **PHP ≥ 8.2** (testé avec 8.2.18)
- **Composer**
- **PostgreSQL 16** (ou SQLite en mémoire pour les tests)

## 1. Installer les dépendances

```bash
cd apps/api-laravel
composer install
cp .env.example .env
php artisan key:generate
```

## 2. Configurer la base (PostgreSQL)

`.env` → `DB_CONNECTION=pgsql` + identifiants `natanga/natanga` (mêmes que le schéma Prisma).

## 3. Créer les tables (migrations)

```bash
php artisan migrate          # crée les 12 tables
php artisan db:seed          # contenu niveau 1 + compte démo
```

## 4. Lancer l'API

```bash
php artisan serve --port=3000
```

Les routes sont identiques à NestJS (préfixe `/api`).

## 5. Valider le contrat (inchangé)

```bash
# Depuis la racine du monorepo
node scripts/e2e-acceptance.mjs
```

Ce script doit passer **à l'identique** : c'est le critère de non-régression des contrats.

## 6. Tests Pest

```bash
vendor/bin/pest          # tests unitaires (machine à états) + feature (parcours)
```

Les tests feature utilisent SQLite en mémoire (`phpunit.xml`).

## 7. Critère de bascule

Une fois :
- ✅ `e2e-acceptance.mjs` vert contre Laravel,
- ✅ tests Pest verts,
- ✅ client Flutter branché sur l'API Laravel (mêmes endpoints),

… on peut retirer `apps/api` (NestJS).

## Notes

- Le hash de mot de passe est **bcrypt** (via `Hash::make`) — équivalent d'Argon2 en
  production ; à renforcer si besoin (`bcrypt` vs `argon2id`).
- Le token d'email reste interne (anti-énumération) ; l'envoi email réel est hors périmètre.

---

## Swagger (documentation & test des API)

Le package `darkaonline/l5-swagger` (basé sur OpenAPI/Swagger-UI) est configuré.

```bash
php artisan l5-swagger:generate   # génère/rafraîchit la doc OpenAPI (api-docs.json)
```

Puis ouvrir dans le navigateur :

```
http://localhost:3000/api/documentation
```

L'UI Swagger permet de **tester** les endpoints directement (essayer `POST /api/auth/register`,
inspecter les corps RFC 7807, etc.).

### Contenu documenté

| Endpoint | Tag Swagger |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/verify-email` | `Auth` |
| `POST/GET /api/children` | `Children` |
| `POST/GET /api/children/{childId}/consents` | `Consent` |
| `GET /api/children/{childId}/export`, `DELETE /api/children/{childId}` | `GDPR` |

### Notes Swagger

- Les annotations OpenAPI utilisent les **attributs PHP 8** (`#[OA\Post(...)]`), pas les
  docblocks — plus lisibles et type-safe.
- Le fichier généré est `storage/api-docs/api-docs.json` (ignoré en git en prod).
- `L5_SWAGGER_CONST_HOST` contrôle l'hôte affiché (défaut `http://localhost:3000`).
