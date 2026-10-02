<?php

return [
    'api' => [
        'title' => 'Natanga API',
        'description' => 'API backend Natanga — auth, consentement RGPD/COPPA, pédagogie (lecture/écriture 6-12 ans).',
        'version' => '1.0.0',
        'termsOfServiceUrl' => null,
        'contact' => null,
        'license' => null,
    ],
    'routes' => [
        'api' => 'api/documentation',
        'docs' => storage_path('api-docs/api-docs.json'),
        'oauth2_callback' => 'api/oauth2-callback',
        'middleware' => [
            'api' => [],
            'asset' => [],
            'docs' => [],
            'oauth2_callback' => [],
        ],
    ],
    'paths' => [
        'annotations' => base_path('app'),
        'base' => env('L5_SWAGGER_BASE_PATH', null),
        'docs' => storage_path('api-docs'),
        'docs_json' => 'api-docs.json',
        'docs_yaml' => 'api-docs.yaml',
        'format_to_use_for_docs' => env('L5_FORMAT_TO_USE_FOR_DOCS', 'json'),
        'excludes' => [],
    ],
    'constants' => [
        'L5_SWAGGER_CONST_HOST' => env('L5_SWAGGER_CONST_HOST', 'http://localhost:3000'),
    ],
    'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
    'generate_yaml_copy' => env('L5_SWAGGER_GENERATE_YAML_COPY', false),
    'proxy' => false,
    'additional_config_url' => null,
    'operations_sort' => env('L5_SWAGGER_OPERATIONS_SORT', null),
    'validator_url' => null,
    'ui' => [
        'display' => [
            'dark_mode' => true,
            'doc_expansion' => 'none',
            'filter' => true,
        ],
        'authorization' => [
            'persist_authorization' => false,
            'oauth2' => [],
        ],
    ],
];
