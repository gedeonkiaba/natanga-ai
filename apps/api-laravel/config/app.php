<?php

return [
    'name' => env('APP_NAME', 'Natanga'),
    'env' => env('APP_ENV', 'production'),
    'debug' => (bool) env('APP_DEBUG', false),
    'url' => env('APP_URL', 'http://localhost'),
    // Client web (liens envoyés par email : vérification de compte).
    // Proxies de confiance (IP/CIDR séparés par des virgules, ou « * ») : docs/26.
    'trusted_proxies' => env('TRUSTED_PROXIES'),
    'frontend_url' => env('FRONTEND_URL', 'http://localhost:3000'),
    'timezone' => 'UTC',
    'locale' => 'fr',
    'fallback_locale' => 'en',
    'key' => env('APP_KEY'),
    'cipher' => 'AES-256-CBC',
];
