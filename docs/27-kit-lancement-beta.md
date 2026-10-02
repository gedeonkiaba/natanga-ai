# 27 — Kit de lancement : bêta fermée (Growth Team)

> Sprint NEXUS « Startup MVP Build », phase Launch. Rôles : Growth Hacker, Content Creator,
> Social Media Strategist, garde-fous Brand Guardian, mesure Analytics Reporter.
> Pré-requis : gate « Reality Check » de `docs/26` franchi.

## 1. Objectif de la bêta (4 semaines)

| Objectif | Cible | Mesure (`docs/sql/kpi-beta.sql`) |
|---|---|---|
| Recruter des familles réelles | **30 familles** (≥ 1 enfant 6–12 ans) | `comptes_crees` |
| Activation (compte → 1ʳᵉ lecture terminée) | **≥ 70 %** des comptes confirmés | `parents_premiere_lecture / emails_confirmes` |
| Rétention J7 enfant | **> 40 %** (cahier des charges) | `revenus_j7 / eligibles_j7` |
| Engagement | ≥ 3 lectures / enfant / semaine | requête 3 |
| Apprentissage (proxy) | % de mots lus seul(e) en hausse sur 4 semaines | `pct_mots_lus_seul` |
| Qualitatif | 10 entretiens parents, 5 observations enfant | grille §5 |

**Critère de passage à la bêta ouverte** : activation ≥ 60 % *et* J7 ≥ 30 % *et* aucun incident
RGPD *et* un enfant réussit une lecture complète sans aide adulte en observation (gate P1, `docs/22`).

## 2. Positionnement & messages (Brand Guardian)

**Promesse** : « Des histoires courtes, à son niveau, qu'il peut lire seul — chaque mot difficile
peut être écouté. »

| ✅ À dire | ❌ Interdit |
|---|---|
| « entraîne », « accompagne », « à son rythme » | « soigne », « guérit », « traite la dyslexie » |
| « police adaptée à la dyslexie », « coloration syllabique » | « diagnostic », « détecte la dyslexie » |
| « complément au travail de l'orthophoniste » | « remplace l'orthophoniste » |
| « aucune publicité, aucune voix enregistrée » | tout chiffre d'efficacité non mesuré |

Toujours rappeler : *Natanga ne pose pas de diagnostic et ne remplace pas un professionnel.*

## 3. Canaux d'acquisition (Growth Hacker) — par ordre de priorité

1. **Orthophonistes (prescripteurs)** — 10 cabinets contactés directement. Leur proposer de
   recommander la bêta à 3 familles chacun. Levier le plus qualifié et le plus crédible.
2. **Associations DYS** (FFDys, APEDYS départementales, Dyspraxie France Dys) — demande de relais
   dans leur lettre/groupe parents. Proposer une visio de présentation de 20 min.
3. **Groupes Facebook de parents d'enfants DYS / TDAH** (avec accord des modérateurs) — post §4.2.
4. **Enseignants RASED / ULIS** du réseau proche — un message court + lien d'inscription.
5. **Bouche-à-oreille** — à J+7, demander à chaque famille active : « Connaissez-vous une famille
   à qui cela pourrait servir ? »

Pas de publicité payante ni de ciblage d'enfants (cible = adultes uniquement).

## 4. Contenus prêts à l'emploi (Content Creator)

### 4.1 Email aux orthophonistes

> **Objet** : Bêta gratuite — des histoires courtes à lire seul, pour vos patients 6–12 ans
>
> Bonjour,
>
> Nous lançons une bêta fermée de Natanga, une application web de lecture pour les enfants de
> 6 à 12 ans en difficulté. L'enfant lit de courtes histoires à son niveau (3 niveaux, 90 textes
> écrits à la main), dans une police adaptée, avec coloration syllabique ; il touche un mot qui
> résiste pour l'entendre. Le parent voit la régularité et les mots qui posent problème.
>
> Natanga ne pose pas de diagnostic et ne remplace pas votre travail : c'est un support
> d'entraînement entre deux séances. Aucune publicité, aucune voix enregistrée, données
> exportables et supprimables par le parent.
>
> Accepteriez-vous de la proposer à 2 ou 3 familles ? Vos retours de professionnelle nous seraient
> précieux (15 min d'échange à la fin du mois).
>
> [lien d'inscription] — Merci !

### 4.2 Post communautés de parents (Social Media Strategist)

> 📚 Votre enfant (6–12 ans) trouve la lecture difficile ? Nous cherchons **30 familles** pour
> tester gratuitement Natanga pendant 4 semaines.
>
> ✔️ de courtes histoires à son niveau (animaux, espace, contes…)
> ✔️ police pensée pour la dyslexie, syllabes en couleur
> ✔️ un mot difficile ? on le touche, il est lu à voix haute
> ✔️ des étoiles, jamais d'échec
>
> Pas de pub, pas d'enregistrement de la voix. Ça ne remplace pas l'orthophoniste : c'est un
> entraînement doux, 10 min par jour. Inscription : [lien] — vos retours construiront la suite 🙏

### 4.3 Calendrier social (4 semaines)

| Semaine | Message | Format |
|---|---|---|
| S1 | Appel à familles bêta (§4.2) | post + relais associations |
| S2 | « Pourquoi la coloration syllabique aide » (pédagogie, sans promesse) | carrousel 4 visuels |
| S3 | Témoignage parent (avec accord écrit, sans photo ni prénom réel d'enfant) | citation |
| S4 | « Ce que la bêta nous a appris » + annonce de la suite | post bilan |

## 5. Boucle de retours

- **J+2** : email automatique (manuel en bêta) « Tout fonctionne ? » → détecter les blocages
  d'inscription (email non reçu → bouton « Renvoyer le lien »).
- **J+7** : entretien parent 15 min — grille : *facilité d'inscription*, *l'enfant lit-il seul ?*,
  *quels mots touchés*, *le tableau de bord est-il compris ?*, *intention de continuer (0–10)*.
- **Observation enfant** (5 enfants, en présence du parent) : l'enfant réalise-t-il une lecture
  complète sans aide ? Noter hésitations, mots touchés, réactions aux étoiles.
- Synthèse hebdomadaire : KPI §1 + 3 verbatims + top 3 frictions → backlog du sprint suivant.

## 6. Pré-requis opérationnels avant le premier envoi

- [ ] Déploiement `docker-compose.prod.yml` derrière TLS, `PUBLIC_URL` définitif (`docs/26` §6).
- [ ] Fournisseur email transactionnel configuré (SPF/DKIM) — **tester la réception sur Gmail,
      Outlook, Orange** : l'email de vérification est le 1er point de friction de l'entonnoir.
- [ ] Mentions légales + politique de confidentialité + contact DPO publiés.
- [ ] Re-catégorisation des 90 textes par thème réel (voir `docs/26` §5, risque R1).
- [ ] Sauvegarde quotidienne PostgreSQL vérifiée (restauration testée une fois).
