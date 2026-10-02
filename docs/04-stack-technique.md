# Proposition de stack technique — Natanga

| Couche | Choix | Justification |
|---|---|---|
| **Mobile** | React Native (Expo) | Mono-langage TypeScript, partage de logique métier avec le web, déploiement iOS/Android rapide, écosystème TTS/ASR/ML Kit mature (expo-speech, ML Kit via wrapper). |
| **Web** | Next.js (App Router) | SSR/SEO pour la partie vitrine + espace parent, partage du design system, RSC pour perf. |
| **Backend** | NestJS (Node.js) | Architecture modulaire structurée (modules/services/guards), DI, validation, idéal pour un domaine métier riche et testable. |
| **BDD** | PostgreSQL (+ JSONB) | Relationnel robuste pour les données d'apprentissage, JSONB pour la flexibilité des réglages d'exercices. |
| **Cache/Queue** | Redis | Sessions, file d'attente SRS, taux limite, cache de contenu. |
| **TTS / ASR** | Azure Speech / Whisper (français) | Qualité française, RGPD (hébergement UE si Azure), streaming. *(Phase 2 pour l'ASR d'évaluation.)* |
| **Écriture manuscrite** | Google ML Kit Digital Ink (custom) | Reconnaissance de tracé reconnue, on-device → conforme privacy. *(Phase 2.)* |
| **IA adaptative** | Règles + modèle léger (Bandit/IRT) avant ML lourd | Start simple, explicable, RGPD-friendly ; montée en charge progressive. |
| **Offline** | SQLite (WatermelonDB / expo-sqlite) + sync par file | Persistance locale + résolution de conflits, essentiel pour le hors-ligne. |
| **Analytics** | Plausible / PostHog self-hosted (sans pub) | Privacy-first, pas de tracking publicitaire, hébergement UE. |
| **Hébergement** | UE (Scaleway/OVH/AWS eu-central) | Conformité RGPD, souveraineté des données. |
| **CI/CD + Qualité** | GitHub Actions, Jest, Testing Library, ESLint (a11y), Playwright | Tests unitaires/intégration, lint accessibilité bloquant en CI, coverage. |

## Architecture
- **Monorepo** (Turborepo + pnpm) : `apps/mobile`, `apps/web`, `apps/api`, `packages/core`
  (types + logique métier partagés), `packages/ui` (design system), `packages/i18n`.
- **Front** → API REST/GraphQL NestJS → PostgreSQL (+ Redis cache/queue).
- **Offline-first** : SQLite local + file de sync ; résolution de conflits à la reconnexion.
- **IA progressive** : règles déterministes (test de placement, difficulté) → modèle léger
  (multi-armed bandit / IRT) → ML avancé (phase 4).
