import path from 'node:path';
import type { NextConfig } from 'next';

/**
 * CSP : aucune ressource tierce (scripts, polices, API) — limite l'exfiltration du
 * jeton en cas d'injection. 'unsafe-inline' reste requis pour les scripts inline de
 * Next sans nonce (durcissement par nonce : docs/26 §Risques).
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Serveur autonome minimal pour l'image Docker (apps/web/Dockerfile).
  output: 'standalone',
  // Packages du workspace consommés en source (transpilés par Next).
  transpilePackages: ['@natanga/core', '@natanga/ui'],
  // Le lint a11y est exécuté séparément (eslint racine, jsx-a11y).
  eslint: { ignoreDuringBuilds: true },
  // Racine du monorepo : le traçage inclut les packages du workspace.
  outputFileTracingRoot: path.join(__dirname, '../..'),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(process.env.NODE_ENV === 'production' ? [{ key: 'Content-Security-Policy', value: CSP }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
