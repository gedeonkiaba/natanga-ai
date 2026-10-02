#!/bin/sh
# Démarrage de l'API : configuration figée, schéma à jour, contenu pédagogique
# (seeders idempotents, compte démo jamais créé en production).
set -e

if [ -z "$APP_KEY" ]; then
  echo "APP_KEY manquante : générez-la avec « php artisan key:generate --show »." >&2
  exit 1
fi

php artisan config:cache
php artisan migrate --force --no-interaction
if [ "${RUN_SEED:-true}" = "true" ]; then
  php artisan db:seed --force --no-interaction
fi

exec "$@"
