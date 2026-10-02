# Socle monorepo — état d'initialisation (Sprint 1 · Lot A.1/A.2)

> Document de suivi technique. Version 0.1 — date de génération : voir git.

## Objectif
Poser les fondations techniques du monorepo Natanga, validées par une installation et des
builds/typechecks/tests qui passent.

## Structure livrée

```
project-natanga/
├── package.json              # root : workspace + scripts turbo/pnpm
├── pnpm-workspace.yaml       # packages + allowBuilds + overrides @types/react
├── turbo.json                # pipeline build/dev/lint/typecheck/test
├── tsconfig.base.json        # config TypeScript partagée (strict)
├── eslint.config.mjs         # config ESLint partagée (placeholder, a11y en Lot B)
├── .prettierrc.json
├── .editorconfig
├── .npmrc
├── .gitignore
├── README.md
├── .github/workflows/ci.yml  # CI : lint + typecheck + tests
├── apps/
│   ├── api/                  # NestJS (healthcheck + root)
│   ├── web/                  # Next.js App Router (accueil + layout)
│   └── mobile/               # Expo (React Native, expo-speech)
└── packages/
    ├── core/                 # logique métier : domain, age-band, srs, rewards
    └── ui/                   # design system : tokens + composants accessibles
```

## Validation effectuée (vérifiée en session)

| Vérification | Résultat |
|---|---|
| `pnpm install` (6 workspaces) | ✅ exit 0 |
| `@natanga/core` — typecheck | ✅ exit 0 |
| `@natanga/core` — tests (12) | ✅ 12/12 passent |
| `@natanga/ui` — typecheck | ✅ exit 0 |
| `@natanga/api` — typecheck | ✅ exit 0 |
| `@natanga/api` — `nest build` | ✅ exit 0 |
| `@natanga/web` — `next build` | ✅ exit 0 (routes statiques générées) |

## Décisions techniques prises (ADR informelles)

1. **Monorepo pnpm + Turborepo** — partage des types et de la logique via `@natanga/core`.
2. **`allowBuilds` dans `pnpm-workspace.yaml`** — pnpm ≥ 10 exige l'approbation des scripts
   de build natifs (`@nestjs/core`, `esbuild`, `unrs-resolver`).
3. **`overrides` `@types/react` → 19** — aligne les types React sur le web (Next 19) pour
   éviter le double `@types/react` 18/19 qui casse le typecheck de `children`.
4. **`eslint.ignoreDuringBuilds: true` (web)** — le lint a11y dédié (US-32) sera branché au
   Lot B ; le socle ne bloque pas le build sur un lint non finalisé.
5. **`vitest --pool=forks --poolOptions.forks.singleFork=true`** — contourne la limite
   d'environnement (spawn EPERM sous sandbox) ; à conserver en CI local si besoin.

## Contraintes d'environnement relevées (à connaître pour la suite)

- **Sandbox de fichiers** : `pnpm install`, `next build`, `nest build`, `vitest` nécessitent
  le mode `danger-full-access` (scripts natifs / spawn de workers). En CI (Linux), ces
  restrictions n'existent pas.
- **Réseau lent** : l'installation initiale (~1121 paquets) a pris ~4 min ; prévoir un cache
  pnpm en CI.
- **Wrapper `npm.ps1` défectueux** : toujours invoquer `pnpm.exe` directement
  (`C:\Users\USER\AppData\Roaming\npm\node_modules\pnpm\pnpm.exe`) plutôt que `npm`/`pnpm`
  via le shim PowerShell.

## Prochaine étape
Lot B (design system & accessibilité) : lint a11y bloquant, composants réels
`Button`/`Text`/`ProgressBar`/`Badge`, intégration polices OpenDyslexic/Lexend.
