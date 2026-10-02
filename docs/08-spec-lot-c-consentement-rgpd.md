# Spécifications fonctionnelles — Lot C : Auth & consentement RGPD/COPPA

> Version 1.0 — Sprint 1
> Références : US-01 (consentement parental), US-02 (profil enfant), US-15 (export/suppression),
> US-31/32 (qualité), cahier des charges MVP (`01-…`), stack (`04-…`).
> Cadre légal cible : **RGPD** (UE, art. 6/8/12/17/20/35) + **COPPA** (États-Unis, si marché US).
> Hébergement UE imposé. L'app **ne traite pas de données de santé** (voir §7 — limites).

---

## 0. Vocabulaire et acteurs

| Terme | Définition |
|---|---|
| **Titulaire du compte** | Adulte (parent ou tuteur légal) qui crée le compte et consent. |
| **Mineur / Enfant** | Utilisateur de 6–12 ans, lié à un compte titulaire. Jamais de compte autonome. |
| **Consentement** | Acte positif explicite du titulaire, libre, spécifique, éclairé, révocable. |
| **ConsentRecord** | Enregistrement horodaté et journalisé du consentement (preuve d'audit). |

**Règle de base :** un enfant n'est jamais joignable directement ; toutes les actions
sensibles (compte, consentement, données) passent par le titulaire.

---

## 1. Objet du lot

Fournir :
1. La création de compte titulaire (parent) sécurisée.
2. Le **consentement parental explicite** et **révocable**, journalisé.
3. La création et la gestion des **profils enfants**.
4. L'**export** et la **suppression** des données (droits RGPD).

Hors périmètre du lot C (géré ailleurs) : authentification fédérée (SSO) détaillée,
espace pro enseignant/orthophoniste (Phase 2), analytics.

---

## 2. Règles métier (invariants)

- **Invariant C1 — Lien obligatoire :** tout profil enfant possède **exactement un**
  titulaire référent actif. Pas d'enfant orphelin.
- **Invariant C2 — Consentement préalable :** aucun profil enfant ne peut devenir
  « actif » (utilisable) tant que le consentement n'est pas **valide et non révoqué**.
- **Invariant C3 — Âge déclaré :** l'âge de l'enfant est déclaré par le titulaire
  (année de naissance). On ne demande **jamais** d'âge à un enfant.
- **Invariant C4 — Révocabilité :** le consentement peut être retiré à tout moment,
  avec un effet immédiat sur l'accès de l'enfant.
- **Invariant C5 — Traçabilité :** toute création/modification/révocation de consentement
  produit un enregistrement d'audit **immuable** (append-only).
- **Invariant C6 — Minimisation :** on ne collecte que les données strictement
  nécessaires (voir §8 dictionnaire). Pas de géolocalisation, pas de contact enfant.
- **Invariant C7 — Pas de profil public :** le profil enfant n'est jamais visible ni
  indexé publiquement (pas de pseudo public, pas de classement).

---

## 3. États et machine à états (consentement)

### 3.1 États d'un consentement
```
PENDING   →   GRANTED   →   REVOKED
   │             │             │
   │             └───(expire)──┴──→ EXPIRED
   └───(refus)──→ DENIED
```
| État | Signification |
|---|---|
| `PENDING` | Formulaire ouvert, titulaire n'a pas encore tranché. |
| `GRANTED` | Consentement actif ; enfant utilisable. |
| `REVOKED` | Retiré par le titulaire ; accès enfant suspendu. |
| `EXPIRED` | Échéance atteinte ou version obsolète ; reconfirmation requise. |
| `DENIED` | Refus explicite ; enfant non utilisable. |

### 3.2 Transitions autorisées
| De → Vers | Déclencheur | Effet |
|---|---|---|
| `PENDING → GRANTED` | Le titulaire coche + confirme | `granted_at` horodaté, journal d'audit, enfant actif |
| `PENDING → DENIED` | Le titulaire refuse | Enfant reste inactif, aucune donnée d'usage |
| `GRANTED → REVOKED` | Retrait explicite | `revoked_at`, enfant suspendu immédiatement |
| `REVOKED → GRANTED` | Nouveau consentement | Crée une **nouvelle version** (pas de réouverture) |
| `GRANTED → EXPIRED` | Version de consentement à renouveler | Reconfirmation exigée |

> **Règle de version :** chaque (re)consentement crée un enregistrement **append-only**
> distinct. On n'écrase jamais un enregistrement historique.

---

## 4. Écrans et parcours UX

### 4.1 Parcours global
```
Création compte parent ──► Consentement ──► Création profil enfant ──► Accès enfant
          │                     │                     │
          └──── vérif. email ───┴──── (préalable) ─────┘
```

### 4.2 Écran « Consentement parental »
```
┌─────────────────────────────────────────────────────────────┐
│  Espace Parent · Consentement                    [Étape 2/3]│
├─────────────────────────────────────────────────────────────┤
│  Pour que {Prénom} puisse utiliser Natanga :                │
│                                                             │
│  ✔ [☐] Je confirme être son parent ou tuteur légal.         │
│  ✔ [☐] J'ai lu et j'accepte la Politique de confidentialité │
│        enfants (lien, langage simple).                      │
│  ✔ [☐] J'autorise Natanga à collecter uniquement les        │
│        données nécessaires aux exercices (voir liste).      │
│                                                             │
│   ── Ce que nous collectons / ce que nous ne collectons pas ─│
│   • Collecté : prénom, année de naissance, progrès d'exercices│
│   • Jamais : localisation, publicité, contact de l'enfant    │
│                                                             │
│   Rappel : je peux retirer ce consentement à tout moment.   │
│                                                             │
│   [ ‹ Retour ]                      [ ✓ J'accepte et continue]│
└─────────────────────────────────────────────────────────────┘
```
**Exigences UX :** cases **non pré-cochées** ; bouton d'acceptation **désactivé** tant que
toutes les cases ne sont pas cochées ; lien vers la politique en langage simple ; le
refus est **possible sans blocage** de la création du compte parent (il bloque seulement
le profil enfant).

### 4.3 Écran « Création profil enfant »
```
┌─────────────────────────────────────────────────────────────┐
│  Espace Parent · Profil enfant                    [Étape 3/3]│
├─────────────────────────────────────────────────────────────┤
│   Prénom : [________________]                               │
│   Année de naissance : [ ▾ 2014 ]  (nécessaire pour adapter) │
│   Compagnon : [🦊 Renard] [🐢 Tortue] [🦉 Hibou]             │
│                                                             │
│   [ ✓ Créer le profil ]                                     │
│   (profil inactif tant que le consentement n'est pas donné)  │
└─────────────────────────────────────────────────────────────┘
```
**Exigences :** prénom facultatif en clair ? Non — recommandé : prénom ou **pseudo local**
choisi par le parent, affiché uniquement dans l'app. Année de naissance → **tranche** (6–8 /
9–12) pour limiter la donnée brute stockée.

### 4.4 Écran « Retrait / suppression » (droits RGPD)
```
┌─────────────────────────────────────────────────────────────┐
│  Espace Parent · Données de {Prénom}               [RGPD]   │
├─────────────────────────────────────────────────────────────┤
│   📥 [Exporter mes données (JSON / PDF)]                    │
│   🚫 [Retirer mon consentement]  → enfant suspendu          │
│   🗑 [Supprimer toutes les données] → effacement définitif  │
│                                                             │
│   ℹ️ La suppression est irréversible et effective sous      │
│      30 jours maximum.                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Cas d'utilisation détaillés (scénarios Gherkin)

### UC-C1 — Créer un compte parent
```gherkin
Scénario : création réussie
  Étant donné un visiteur sans compte
  Quand il saisit un email valide et un mot de passe robuste
  Et qu'il confirme son email (lien à usage unique, expiration 24 h)
  Alors le compte titulaire est créé en état ACTIVE
  Et un email de confirmation RGPD est envoyé

Scénario : email déjà utilisé
  Étant donné un compte existant lié à cet email
  Quand il tente une nouvelle inscription
  Alors le système refuse et affiche une erreur non révélatrice
       (« Cet email est déjà utilisé », sans préciser le compte)
```

### UC-C2 — Donner un consentement valide
```gherkin
Scénario : consentement complet
  Étant donné un titulaire authentifié sans consentement actif
  Quand il coche les 3 cases et valide
  Alors un ConsentRecord GRANTED est créé (version N, horodaté)
  Et le profil enfant passe à l'état ACTIVE
  Et une entrée d'audit est écrite (qui, quoi, quand, version, source)

Scénario : consentement incomplet
  Étant donné le formulaire de consentement affiché
  Quand toutes les cases ne sont pas cochées
  Alors le bouton « J'accepte » reste désactivé
  Et aucun ConsentRecord n'est créé

Scénario : refus
  Quand le titulaire choisit « Je refuse »
  Alors un ConsentRecord DENIED est créé
  Et le profil enfant reste INACTIVE
  Et aucune donnée d'usage n'est collectée
```

### UC-C3 — Révoquer le consentement
```gherkin
Scénario : retrait
  Étant donné un consentement GRANTED actif
  Quand le titulaire retire son consentement
  Alors le ConsentRecord passe à REVOKED (horodaté)
  Et l'accès de l'enfant est suspendu immédiatement
  Et les données existantes restent (jusqu'à suppression explicite)
  Et l'opération est journalisée
```

### UC-C4 — Exporter les données (droit d'accès/portabilité)
```gherkin
Scénario : export
  Étant donné un titulaire authentifié
  Quand il demande l'export des données de son enfant
  Alors un fichier JSON/PDF est généré dans les 30 jours (cible < 24 h)
  Et il contient : profil, progrès, récompenses, consentements, réglages
  Et l'export est tracé dans le journal d'audit
```

### UC-C5 — Supprimer les données (droit à l'effacement)
```gherkin
Scénario : suppression définitive
  Étant donné un titulaire authentifié
  Quand il confirme la suppression (double confirmation)
  Alors toutes les données de l'enfant sont effacées (cascade)
  Et un consentement REVOKED final est journalisé (puis anonymisé/purgé)
  Et l'effacement est confirmé dans un délai ≤ 30 jours
```

### UC-C6 — Contrôle d'âge (garde-fou COPPA)
```gherkin
Scénario : âge minimum
  Étant donné un profil enfant dont l'année de naissance est < 6 ans
  Alors l'accès au parcours est refusé avec un message adapté au parent
       (« Ce contenu s'adresse aux enfants à partir de 6 ans »)
  Et aucune donnée d'usage n'est collectée
```

---

## 6. Cas limites et erreurs

| Cas limite | Comportement attendu |
|---|---|
| Email non confirmé | Compte en état `PENDING_VERIFICATION` ; pas de consentement possible. |
| Consentement expiré (version obsolète) | Reconfirmation exigée ; l'enfant est suspendu jusqu'à renouvellement. |
| Plusieurs enfants, un seul consentement révoqué | Seul l'enfant concerné est suspendu ; les autres restent actifs. |
| Tentative d'accès enfant sans titulaire actif | Blocage + redirection vers l'espace parent. |
| Export demandé pendant une suppression en cours | File d'attente : la suppression est prioritaire, l'export est rejeté proprement. |
| Double-clic sur « Supprimer » | Idempotent : un seul effacement effectif, réponse cohérente. |
| Données orphelines après purge | Job de nettoyage nocturne vérifie l'absence d'enfants orphelins (Invariant C1). |

---

## 7. Limites légales — ce que le lot C ne fait PAS

- **Pas de diagnostic médical** ni de traitement de données de santé (art. 9 RGPD) :
  les éléments comme « confond b/d » sont des **métriques d'apprentissage**, jamais un
  diagnostic. Le détail des troubles reste hors périmètre (§voir disclaimer produit).
- **Pas de vérification d'identité lourde** (pas d'âge vérifié par document) : on déclare
  l'âge « raisonnablement » (best-effort COPPA). Toute exigence renforcée sera traitée
  en Phase 2 (ex. consentement vérifiable COPPA avec méthode de paiement/téléphone).
- **Pas de transfert hors UE** dans ce lot (hébergement UE imposé).

---

## 8. Dictionnaire de données (minimal, minimisation)

| Entité | Champ | Type | Obligatoire | Notes |
|---|---|---|---|---|
| `users` | `id` | uuid | Oui | PK |
| `users` | `email` | varchar | Oui | Unique, haché si stockage séparé |
| `users` | `password_hash` | varchar | Oui | Argon2id |
| `users` | `role` | enum | Oui | `parent` (MVP) |
| `users` | `status` | enum | Oui | `PENDING_VERIFICATION` / `ACTIVE` |
| `children` | `id` | uuid | Oui | PK |
| `children` | `user_id` | uuid FK | Oui | Titulaire référent |
| `children` | `display_name` | varchar | Oui | Prénom ou pseudo local |
| `children` | `birth_year` | smallint | Oui | → tranche 6–8 / 9–12 en dérivé |
| `children` | `avatar` | varchar | Non | Clé d'avatar |
| `children` | `universe` | enum | Oui | Uni graphique dérivé de la tranche |
| `children` | `status` | enum | Oui | `ACTIVE` / `INACTIVE` / `SUSPENDED` |
| `consents` | `id` | uuid | Oui | PK |
| `consents` | `child_id` | uuid FK | Oui | Enfant concerné |
| `consents` | `version` | int | Oui | Incrémentée, jamais écrasée |
| `consents` | `status` | enum | Oui | voir §3.1 |
| `consents` | `granted_at` | timestamptz | Non | |
| `consents` | `revoked_at` | timestamptz | Non | |
| `consents` | `audit_json` | jsonb | Oui | Preuve (source, user-agent, version, IP tronquée) |

---

## 9. Points d'entrée API (prévisionnels)

| Méthode | Endpoint | Rôle | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Créer compte parent | — |
| POST | `/api/auth/verify-email` | Confirmer email | — |
| POST | `/api/children` | Créer profil enfant | parent |
| POST | `/api/children/{id}/consents` | Donner/refuser consentement | parent |
| DELETE | `/api/children/{id}/consents/active` | Révoquer | parent |
| GET | `/api/children/{id}/export` | Exporter données | parent |
| DELETE | `/api/children/{id}` | Supprimer (cascade) | parent |
| GET | `/api/consents/{childId}/audit` | Historique de consentement | parent |

> Conventions API : JSON, erreurs standardisées (RFC 7807 problem+json), rate-limiting,
> journalisation sans données personnelles dans les logs (niveau `info`).

---

## 10. Critères d'acceptation (US-01 détaillée)

- [ ] Un compte parent ne peut exister sans email vérifié.
- [ ] Aucun profil enfant actif sans `ConsentRecord` `GRANTED` non révoqué.
- [ ] Le consentement est révocable en ≤ 2 actions, effet immédiat.
- [ ] Chaque consentement est horodaté, versionné et journalisé (audit immuable).
- [ ] L'export (JSON/PDF) et la suppression sont disponibles et testés.
- [ ] La suppression est idempotente et effective ≤ 30 jours (cible : immédiat).
- [ ] Les cases de consentement sont non pré-cochées et le bouton bloqué tant que
      incomplet (testé en e2e).
- [ ] Les erreurs de login ne révèlent pas l'existence d'un compte (anti-énumération).

---

## 11. Tests (couverture cible)

| Niveau | Type | Exemples |
|---|---|---|
| Unitaire | `ConsentService` (machine à états) | Transitions valides/invalides, versionnement. |
| Unitaire | Validation des formulaires | Cases manquantes, âge hors plage. |
| Intégration | API endpoints | Register/verify, consent grant/revoke, export, delete. |
| e2e | Parcours complet | Création parent → consentement → profil → accès enfant. |
| Sécurité | Anti-énumération, rate-limit | Login/register ne fuient pas l'existence d'un compte. |
| Conformité | Audit | Chaque transition écrit une entrée d'audit ; purge correcte. |

---

## 12. Risques spécifiques au lot C & mitigations

| Risque | Mitigation |
|---|---|
| **Consentement mal compris** → invalidité juridique | Langage simple, cases détaillées, lien vers la politique, tests utilisateur avec des parents. |
| **Preuve de consentement insuffisante** | `audit_json` immuable (horodatage, version, source, IP tronquée), conservation en append-only. |
| **Anti-énumération / fuite d'existence de compte** | Messages d'erreur génériques, rate-limiting, monitoring. |
| **Suppression incomplète (répliques, cache, sauvegardes)** | Purge cascade documentée, job de nettoyage, stratégie de sauvegarde à durée bornée. |
| **COPPA (si marché US)** exige un consentement « vérifiable » | V2 : méthode vérifiable (paiement, téléphone, formulaire signé) — tracé comme évolution. |
| **Données d'usage collectées avant consentement** | Garde technique : le client n'envoie aucun événement tant que l'état n'est pas `ACTIVE`. |
