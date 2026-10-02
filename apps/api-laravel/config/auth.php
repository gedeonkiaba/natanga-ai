<?php

use App\Models\User;

return [
    // API stateless : le guard par défaut est `api` (jeton Bearer, cf. App\Auth\TokenGuard).
    'defaults' => [
        'guard' => 'api',
        'passwords' => 'users',
    ],

    'guards' => [
        'api' => [
            'driver' => 'api-token',
            'provider' => 'users',
        ],
    ],

    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => User::class,
        ],
    ],

    'passwords' => [],

    'password_timeout' => 10800,
];
