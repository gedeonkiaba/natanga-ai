# Phases de développement — Natanga

> Découpage décisionnel **par phases** du développement, fondé sur l'état réel du monorepo,
> les modules du cahier des charges (`docs/21`) et la roadmap produit (`docs/01`).
> Chaque phase a un **objectif unique**, des **livrables**, et un **critère de sortie (gate)**
> : on ne passe à la phase suivante que si le gate est franchi.
>
> Principe directeur : **livrer la valeur enfant d'abord**, puis la valeur adulte, puis la
> mesure — sans jamais casser la conformité RGPD/COPPA déjà en place.

## Vue d'ensemble

| Phase | Nom | Objectif unique | Modules | Statut |
|---|---|---|---|---|
| **P0** | Socle & bascule backend | Une seule source de vérité métier | Transverse | 🟢 quasi fait |
| **P1** | Cœur pédagogique jouable | L'enfant joue une leçon de bout en bout seul | M1 · M3 (arbre/contenu) · M4 · M2.1/2.2 | 🟡 en cours |
| **P2** | Adaptation intelligente | Le parcours s'adapte aux difficultés | M3.3/3.4/3.5 | 🔴 |
| **P3** | Boucle adulte | Le parent/ortho voit et agit | M5.2/5.3/5.4/5.5 | 🔴 |
| **P4** | Mesure & polish | Tous les KPI sont mesurables | M6 · M2.3 · M2.1 réglages | 🔴 |
| **P5 (post-MVP)** | ASR & espace pro | Lecture à voix haute + administration | M2.4 · M7 | ⚪ |

---

## Phase 0 — Socle & bascule backend (finaliser)

**Objectif :** avoir **une seule** source de vérité métier (Laravel) consommée par les 3
clients (Flutter / React Native / Next.js) sans duplication.

**Livrables**
- Bascule NestJS → Laravel **validée** : `e2e-acceptance.mjs` vert, tests Pest verts,
  Flutter branché sur l'API Laravel (`docs/18`, `docs/19`).
- Retrait de `apps/api` (NestJS) une fois basculé.
- 12 tables (auth + consentement + pédagogie) migrées/répliquées en Laravel (`docs/17`).

**Critère de sortie (gate)**
- ✅ `e2e-acceptance.mjs` vert **contre Laravel** (contrat identique).
- ✅ tests Pest verts (machine à états consentement + parcours).
- ✅ zéro logique pédagogique dupliquée côté client.

---

## Phase 1 — Cœur pédagogique jouable (MVP enfant)

**Objectif :** un enfant de 6–12 ans **diagnostique puis joue une leçon de bout en bout sans
aide d'un adulte**, en ≤ 5 minutes de diagnostic et 5–10 min de leçon.

**Livrables**

| Fonctionnalité | Détail | Réf. |
|---|---|---|
| Diagnostic complet A→E | épreuves lettres→syllabes→mots→pseudo-mots→phrase ; résultat Découverte/Progression/Fluide | F1.1, F1.2, F1.3 |
| Arbre 5 niveaux | lettres→syllabes→mots→phrases→textes, déblocage séquentiel | F3.1 |
| Contenu 90 textes | 30 × 3 niveaux, chacune avec thème/âge/phonèmes/durée, validé (pas d'IA) | F3.6 |
| Gamification complète | badges + étoiles + avatar, seuils 3/5/10/20 lectures, streak adouci | F4.1, F4.2, F4.3 |
| Polices & réglages | OpenDyslexic/Lexend embarquées, taille/espacement/contraste persistants | F2.1 |
| TTS mot/syllabe | lecture totale/mot/syllabe, débit DYS | F2.2 |

**Critère de sortie (gate)**
- ✅ Un enfant réalise une leçon complète **sans adulte** (test utilisateur réel).
- ✅ Taux d'erreur b/d mesurable (fondation pour le KPI ≥ 20 % sur 4 semaines).
- ✅ 100 % des écrans de la boucle enfant conformes WCAG 2.1 AA.

---

## Phase 2 — Adaptation intelligente

**Objectif :** le parcours **s'adapte** aux difficultés récurrentes de l'enfant.

**Livrables**
- **8 compétences C1→C8** (score 0–100, mis à jour après chaque session). — F3.3
- **Adaptation phonologique** : si difficulté `an/en/on` → davantage de ces sons ensuite. — F3.4
- **SRS branché** (révision espacée). — F3.5

**Critère de sortie (gate)**
- ✅ Démo : « enfant en difficulté sur `an/en/on` » → reçoit automatiquement des textes et
  exercices ciblant ces sons.
- ✅ Jamais d'échec bloquant (adaptation bienveillante).
- ✅ Les 8 axes évoluent de façon **explicable** au parent.

---

## Phase 3 — Boucle adulte (parent + orthophoniste)

**Objectif :** le parent suit sans jargon ; l'orthophoniste dispose de données objectives.

**Livrables**
- **Dashboard parent** : temps, sessions, progression, compétences, difficultés (b/d, p/q). — F5.2
- **Export PDF/CSV** + suppression RGPD déjà en place (JSON) → ajout PDF. — F5.3
- **Recommandations parent** (lecture quotidienne, exercices ciblés) dérivées de F3.4. — F5.4
- **Espace orthophoniste V1** : historique, erreurs récurrentes, rapport mensuel. — F5.5

**Critère de sortie (gate)**
- ✅ **60 % des parents consultent le tableau de bord** (KPI produit).
- ✅ Export PDF fiable et lisible (partage équipe éducative).
- ✅ Satisfaction parent > 4/5 sur le dashboard.

---

## Phase 4 — Mesure & polish

**Objectif :** rendre **tous les KPI du cahier des charges mesurables** et itérer.

**Livrables**
- **Analytics privacy-first** : les 10 événements (`onboarding_started`…`parent_dashboard_opened`). — F6.1→F6.3
- **Tableaux de bord KPI** : activation, engagement, rétention, apprentissage. — F6.4
- **Assistance anti-blocage** (aide si blocage > 3 s). — F2.3
- **Réglages accessibilité finalisés** (mode sombre, contraste ajustable). — F2.1

**Critère de sortie (gate)**
- ✅ Les « critères du succès MVP » sont **tous mesurables** :
  activation 80 %/70 % · rétention D7 > 40 % / D14 > 25 % · MCLM & hésitations · WER < 20 % ·
  latence < 1,5 s · coût IA < 2 USD/enfant/mois.

---

## Phase 5 (post-MVP) — ASR & espace pro

**Objectif :** lecture à voix haute + administration à l'échelle.

**Livrables**
- **ASR d'analyse** (omission/substitution/inversion/hésitation/répétition) — spike STT 2 sem. — F2.4/M2.4
- **Back-office contenu** (CRUD des 90 textes validés). — F7.1
- **Espace enseignant/ortho complet** (assignation, suivi de groupe). — F7.2
- **Purge RGPD automatique** (jobs de nettoyage). — F7.3

**Note :** cette phase est **conditionnée** à la validation du MVP (critères Phase 4).

---

## Dépendances & ordre obligatoire

```
P0 ──► P1 ──► P2 ──► P3 ──► P4 ──► P5
        │        │        │
        │        └────────┼────────► P3 dépend de P2 (recos = adaptation)
        └─────────────────┴────────────────► P1 bloque tout le restant
```

- **P1 est le goulot d'étranglement** : tant que l'enfant ne joue pas de leçon complète,
  rien d'autre n'a de valeur mesurable.
- **P2 et P3** peuvent se chevaucher en partie (l'adaptation nourrit le dashboard), mais le
  dashboard dépend des axes de P2.
- **P4** ne mesure utilement que si P1→P3 livrent les parcours et les dashboards.
- **P5** est strictement post-MVP.

## Durées estimées (indicatif)

| Phase | Durée | Commentaire |
|---|---|---|
| P0 | 0–1 sem. | quasi terminé : valider + retirer NestJS |
| P1 | 4–5 sem. | contenu (90 textes) = tâche la plus lourde |
| P2 | 3–4 sem. | règles d'abord, puis modèle léger |
| P3 | 3–4 sem. | dashboard + export PDF + ortho V1 |
| P4 | 2–3 sem. | analytics + KPI + réglages |
| **Total MVP (P0→P4)** | **≈ 12–16 sem.** | aligné sur la roadmap v0.1 (Phase 1 = 8 sem. + phases) |

## Prochaine étape

Démarrer **Phase 1** dès que P0 est verrouillé. Le premier chantier de P1 est le
**contenu pédagogique (90 textes)** + **diagnostic complet**, car ils débloquent tout le
reste de la boucle enfant.
