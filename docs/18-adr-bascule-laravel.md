# ADR — Bascule backend NestJS → Laravel

> Décision d'architecture. Statut : **Acceptée** (décision produit/équipe).

## Contexte

- Un backend NestJS a été livré (auth, consentement RGPD/COPPA, pédagogie), testé (15 unitaires + 2 e2e).
- **Information déterminante (révélée en cours de route)** : l'équipe travaille déjà sur
  Laravel sur d'autres projets → la compétence d'équipe est en PHP/Laravel, pas NestJS.
- Un socle Flutter a aussi été ajouté (client pur, consommant l'API).

## Décision

1. **Remplacer NestJS par Laravel** (`apps/api-laravel/`), bascule complète.
2. **Migrer toute la logique métier en PHP/Laravel** (machine à états du consentement,
   pédagogie, SRS, gamification).
3. **Conserver les contrats API identiques** (routes, corps RFC 7807) pour ne pas impacter
   les clients (Flutter, Next.js, React Native).
4. **Transposer le schéma de données** (12 tables) en migrations Laravel (mêmes FK cascade).

## Raison principale

La **compétence d'équipe** (Laravel) l'emporte sur l'argument technique du partage de types
TypeScript. Le coût de maintenance d'une stack non maîtrisée par l'équipe est supérieur au
bénéfice du monolangage TS.

## Conséquences

- `@natanga/core` (TS) devient obsolète côté serveur ; il peut rester pour les fronts
  React Native/Next.js le temps de la transition.
- Le schéma PostgreSQL reste **identique** (même BDD, mêmes tables).
- Les tests de conformité RGPD sont **réimplémentés en Pest/PHPUnit** avec la même couverture.

## Équivalence des briques (traçabilité)

| Briques NestJS | Équivalent Laravel |
|---|---|
| `ConsentStateMachine` (core TS) | `app/Domain/Consent/ConsentStateMachine.php` |
| `DomainError` / `DomainAuthError` | `app/Domain/DomainException.php` |
| `DomainExceptionFilter` (RFC 7807) | `bootstrap/app.php` (`withExceptions` → renderer `DomainException`) |
| `AuthService` / `ChildrenService` / `ConsentService` / `GdprService` | `app/Services/*` |
| `schema.prisma` (12 tables) | `database/migrations/*` |
| `seed.ts` | `database/seeders/PedagogySeeder.php` |
| `*.spec.ts` / `*.e2e-spec.ts` | `tests/Unit/*` / `tests/Feature/*` |

## Risques & mitigations

| Risque | Mitigation |
|---|---|
| Perdre les invariants RGPD lors de la réécriture | Machine à états transposée fidèlement + tests Pest miroirs |
| Contrats API divergents | Mêmes routes, mêmes corps RFC 7807 ; script d'acceptance `e2e-acceptance.mjs` inchangé |
| Double maintenance transitoire | On retire NestJS **une fois** Laravel validé par le runbook |

## Réévaluation

- La bascule est suivie via le runbook (`docs/19-runbook-bascule-laravel.md`).
- Le critère de bascule = script d'acceptance vert + tests Pest verts + front Flutter branché.
