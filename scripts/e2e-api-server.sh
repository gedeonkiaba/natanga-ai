#!/usr/bin/env bash
# Lance l'API Laravel sur une base SQLite neuve pour les tests E2E web (Playwright).
# Les emails partent dans le journal (MAIL_MAILER=log) : le test y lit le lien de
# vérification, exactement comme un parent le lirait dans sa boîte.
set -euo pipefail
cd "$(dirname "$0")/../apps/api-laravel"

export E2E_DIR="${E2E_DIR:-$(mktemp -d)}"
export APP_ENV=local APP_DEBUG=false APP_KEY="base64:$(head -c 32 /dev/urandom | base64)"
# SQLite par défaut ; PostgreSQL (moteur de prod) si DB_CONNECTION=pgsql est fourni.
export DB_CONNECTION="${DB_CONNECTION:-sqlite}"
if [ "$DB_CONNECTION" = sqlite ]; then
  export DB_DATABASE="$E2E_DIR/e2e.sqlite"
  touch "$DB_DATABASE"
fi
export CACHE_STORE="${CACHE_STORE:-file}" SESSION_DRIVER=file QUEUE_CONNECTION=sync
export MAIL_MAILER=log LOG_CHANNEL=single
export TRUSTED_PROXIES=127.0.0.1
export FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

rm -f storage/logs/laravel.log
rm -rf storage/framework/cache/data # compteurs de throttle d'un run précédent
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views
php artisan migrate:fresh --seed --force --no-interaction >/dev/null
cd public # le routeur de Laravel résout index.php depuis le répertoire courant
exec php -S 127.0.0.1:"${API_PORT:-8000}" ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php
