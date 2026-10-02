# API Laravel (production) — FrankenPHP (serveur PHP multi-thread, HTTP/2).
# Build depuis la racine du monorepo :
#   docker build -f apps/api-laravel/Dockerfile -t natanga-api .

FROM composer:2 AS vendor
WORKDIR /app
COPY apps/api-laravel/composer.json apps/api-laravel/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist --no-interaction --ignore-platform-req=ext-*
COPY apps/api-laravel/ ./
RUN composer dump-autoload --optimize --no-dev --classmap-authoritative \
 && rm -f bootstrap/cache/packages.php bootstrap/cache/services.php

FROM dunglas/frankenphp:1-php8.3-alpine
RUN install-php-extensions pdo_pgsql opcache
WORKDIR /app
COPY --from=vendor /app /app
COPY apps/api-laravel/docker-entrypoint.sh /usr/local/bin/natanga-entrypoint
RUN chmod +x /usr/local/bin/natanga-entrypoint \
 && mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    DB_CONNECTION=pgsql \
    CACHE_STORE=database \
    SESSION_DRIVER=array \
    QUEUE_CONNECTION=sync \
    SERVER_NAME=:8000

USER www-data
EXPOSE 8000
HEALTHCHECK --interval=15s --timeout=5s --retries=5 \
  CMD wget -qO- http://127.0.0.1:8000/api/health || exit 1
ENTRYPOINT ["natanga-entrypoint"]
CMD ["frankenphp", "php-server", "--root", "public", "--listen", ":8000"]
