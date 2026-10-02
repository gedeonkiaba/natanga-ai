# Base de données réelle — schéma complet (auth + consentement + pédagogie)

> État de la couche de persistance PostgreSQL (Prisma). Version schéma : v2.

## Ce qui a été ajouté (passage de v1 → v2)

Le schéma couvre désormais **deux domaines** :

| Domaine | Modèles | État |
|---|---|---|
| **Auth & consentement** | `User`, `Child`, `Consent`, `EmailToken` | déjà présent (v1) |
| **Pédagogie** | `SkillNode`, `Lesson`, `Exercise`, `Item`, `Progress`, `Attempt`, `Reward` | **nouveau (v2)** |

## Modèles pédagogiques (alignés sur `@natanga/core/src/pedagogy`)

| Modèle | Rôle | Contraintes clés |
|---|---|---|
| `SkillNode` | Nœud de l'arbre (lettres→…→textes) | `level`, `unlockedWhen` |
| `Lesson` | Leçon 5–10 min | FK cascade sur `SkillNode` |
| `Exercise` | Exercice (son⇄graphème, QCM) | `params` JSONB |
| `Item` | Grapheme/phonème/mot | `type`, `phoneme`, `audioUrl` |
| `Progress` | Progression enfant→nœud | `@@unique([childId, nodeId])` |
| `Attempt` | Tentative de réponse | `errorKind` (métrique, pas diagnostic) |
| `Reward` | Gemme/badge/effort | gamification bienveillante |

## Livrables

| Fichier | Rôle |
|---|---|
| `apps/api/prisma/schema.prisma` | Schéma v2 (validé par `prisma validate`) |
| `apps/api/prisma/migrations/0001_init/migration.sql` | Migration SQL complète (12 tables + FK cascade) |
| `apps/api/prisma/seed.ts` | Seed idempotent (7 graphèmes, 5 mots, 3 nœuds, 4 exercices, compte démo) |
| `apps/api/src/consent/entities.ts` | Entités pédagogiques ajoutées |
| `apps/api/src/consent/repository.interface.ts` | Interface étendue (lecture + progression) |
| `apps/api/src/consent/memory.repository.ts` | Impl. mémoire étendue (dev/tests) |
| `apps/api/src/consent/prisma.repository.ts` | Impl. Postgres étendue (prod) |

## Validation (exécutée en session)

| Vérification | Résultat |
|---|---|
| `prisma validate` | ✅ schéma valide |
| `prisma generate` | ✅ client régénéré |
| `@natanga/api` typecheck | ✅ |
| `@natanga/api` tests unitaires | ✅ 15/15 |

## Conformité & minimisation (toujours respectées)

- Pas d'IP complète (préfixe tronqué dans l'audit JSON).
- Pas de date de naissance (année seule + tranche dérivée).
- `errorKind` documenté comme **métrique d'apprentissage**, jamais diagnostic médical.
- Effacement RGPD : cascades `ON DELETE CASCADE` sur toutes les FK liées à `Child`.
- Consentement **append-only versionné** (`@@unique([childId, version])`).

## Pour instancier la BDD réelle (hors sandbox)

```bash
docker compose up -d --build                        # postgres + api
docker compose exec api npx prisma migrate deploy    # crée les 12 tables
docker compose exec api npx prisma db seed           # contenu niveau 1
node scripts/e2e-acceptance.mjs                       # valide le contrat
```

(Voir `docs/16-runbook-e2e.md` pour la procédure complète.)
