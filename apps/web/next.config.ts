import path from 'node:path';
import type { NextConfig } from 'next';

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
        ],
      },
    ];
  },
};

export default nextConfig;
