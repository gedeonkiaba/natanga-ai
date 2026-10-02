# Lot E/F implémenté — Parcours pédagogique & exercices niveau 1

> Suivi d'implémentation Sprint 1. Références : US-04 (placement), US-05 (arbre),
> US-06 (leçon), US-07 (son⇄graphème), US-08 (QCM mots), US-12 (SRS, fondations).

## Modules livrés dans `packages/core/src/pedagogy/`

| Module | Fichier | Rôle |
|---|---|---|
| Modèle de données | `model.ts` | `SkillNode`, `Lesson`, `Exercise`, `PedagogyItem`, `SkillProgress` |
| Moteur de leçon | `lesson.ts` | Session, séquence ordonnée, soumission, résultat (score 0..1) |
| Exercices | `exercises.ts` | Correction son⇄graphème + reconnaissance de mots (feedback bienveillant) |
| Placement v0 | `placement.ts` | Détermine le niveau de départ (seuil de maîtrise 0.7) |
| Arbre de compétences | `tree.ts` | Déblocage séquentiel (`unlockedWhen`), statuts locked/available/mastered |
| Contenu niveau 1 | `content.ts` | 7 graphèmes (dont b/d/p/q), 5 mots, 3 nœuds, 2 leçons, 4 exercices |

## Points pédagogiques clés

- **Confusions ciblées dès le départ** : le contenu inclut `b/d` et `p/q` (exigence produit
  sur la détection des confusions), avec distracteurs `b/d` volontairement confondus.
- **Feedback bienveillant** : jamais de « erreur » ni de rouge ; les messages reformulent
  (« Presque ! C'est … On réessaie »).
- **Placement explicable** : le niveau de départ est dérivé d'un seuil de maîtrise simple,
  avec une `explanation` lisible pour le parent (sans jargon).

## Alignement SRS & gamification (déjà posés)

- `srs.ts` (SM-2 simplifié) et `rewards.ts` (gemmes/effort, streak adouci) sont prêts dans
  `@natanga/core` ; ils se connecteront au moteur de leçon lors de l'intégration UI.

## Validation

| Vérification | Résultat |
|---|---|
| `@natanga/core` typecheck | ✅ |
| `@natanga/core` tests (34) | ✅ 34/34 |
| `@natanga/api` typecheck (consomme core) | ✅ |

## À venir (intégration UI)

- **Écrans** : arbre de compétences, leçon (consigne TTS + gros boutons), exercices jouables.
- **Persistance de la progression** (relier `SkillProgress` au schéma Prisma — extension).
- **Branchement SRS** aux révisions espacées (US-12, Sprint 2).
- **Contenu étendu** (syllabes, phrases) — phase 2.
