import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Packages du workspace consommés en source (transpilés par Next).
  transpilePackages: ['@natanga/core', '@natanga/ui'],
  // Le lint a11y dédié (Lot B) sera exécuté séparément en CI ; on ne bloque pas
  // le build du socle tant qu'eslint-config-next n'est pas finalisé.
  eslint: { ignoreDuringBuilds: true },
  // Ancre la racine de traçage sur le monorepo (évite la détection d'un
  // package-lock.json parasite hors du workspace).
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
