# Runbook — Tests e2e de bout en bout (Flutter ↔ NestJS)

> Procédure de lancement de l'environnement d'intégration, pour valider le contrat
> API consommé par le client Flutter (`apps/mobile-flutter`) et le web (`apps/web`).

## Prérequis

- **Docker** + `docker compose` (v2)
- **Node.js ≥ 20** (pour le script d'acceptance)
- Facultatif : **Flutter** (pour lancer le client mobile réel)

## 1. Démarrer la stack (Postgres + API)

```bash
docker compose up -d --build
```

Cela :
1. Démarre **PostgreSQL 16** (healthcheck `pg_isready`).
2. Build l'**API NestJS** (Dockerfile multi-stage, `DB_PROVIDER=prisma`).
3. Expose l'API sur **http://localhost:3000**.

Vérifier l'état :

```bash
docker compose ps
curl http://localhost:3000/api/health
```

## 2. Appliquer la migration Prisma (une fois)

Le client Prisma est déjà compilé dans l'image, mais la table doit être créée :

```bash
docker compose exec api npx prisma migrate deploy
```

## 3. Lancer le script d'acceptance (contrat API)

```bash
node scripts/e2e-acceptance.mjs
```

Ce script (sans dépendance Flutter) reproduit le **parcours exact** que le client
Flutter exécute, et vérifie :

- `register` → 201
- `verify-email` token invalide → 401 `ERR_TOKEN` (RFC 7807)
- `create child` âge hors périmètre → 422 `ERR_AGE`
- `create child` parent non vérifié → 422 `ERR_PARENT`
- `health` → 200

## 4. (Optionnel) Lancer le client Flutter réel

```bash
cd apps/mobile-flutter
flutter run --dart-define=API_BASE_URL=http://localhost:3000
```

Le champ `API_BASE_URL` est lu comme `String.fromEnvironment` dans `ApiClient`.

## 5. Arrêter / nettoyer

```bash
docker compose down          # arrête (conserve les volumes)
docker compose down -v       # arrête ET supprime les données Postgres
```

## Notes de conformité

- Le script d'acceptance ne teste **pas** le token d'email réel (il est **interne**,
  non exposé par l'API, par anti-énumération) — c'est le comportement attendu.
- En production, le token est envoyé par email (SMTP/transactionnel) ; en e2e, on
  valide le **contrat** (statuts + corps RFC 7807), pas l'envoi d'email.
