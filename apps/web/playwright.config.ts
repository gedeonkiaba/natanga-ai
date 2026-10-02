import { defineConfig, devices } from '@playwright/test';

/**
 * E2E du parcours réel : Next (build de production) → proxy /api → Laravel → SQLite.
 * Prérequis : `pnpm --filter @natanga/web build`, PHP 8.2+ et `composer install` dans apps/api-laravel.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'e2e-report' }]],
  outputDir: 'e2e-results',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    locale: 'fr-FR',
  },
  projects: [
    // Chaque projet = un client distinct ; X-Real-IP joue le rôle de Caddy (prod).
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], extraHTTPHeaders: { 'x-real-ip': '203.0.113.10' } },
    },
    {
      name: 'mobile',
      use: { ...devices['Pixel 7'], extraHTTPHeaders: { 'x-real-ip': '203.0.113.20' } },
    },
  ],
  webServer: [
    {
      command: 'bash ../../scripts/e2e-api-server.sh',
      url: 'http://127.0.0.1:8000/api/health',
      reuseExistingServer: false,
      timeout: 120_000,
    },
    {
      command: 'pnpm start --port 3000',
      url: 'http://localhost:3000',
      env: { API_URL: 'http://127.0.0.1:8000', CLIENT_IP_HEADER: 'x-real-ip' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
