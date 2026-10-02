# Dockerfile multi-stage pour l'API NestJS (Natanga).
# Étape 1 : installation des dépendances (pnpm).
FROM node:22-slim AS deps
RUN corepack enable && corepack prepare pnpm@12.4.1 --activate
WORKDIR /app

# Copie minimale pour installer (workspace pnpm).
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/core/package.json packages/core/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install --frozen-lockfile --filter @natanga/api... 

# Étape 2 : build.
FROM deps AS build
COPY . .
RUN pnpm --filter @natanga/api build

# Étape 3 : image de production minimale.
FROM node:22-slim AS runner
RUN corepack enable && corepack prepare pnpm@12.4.1 --activate
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/packages ./packages

WORKDIR /app/apps/api

EXPOSE 3000
CMD ["node", "dist/main.js"]
