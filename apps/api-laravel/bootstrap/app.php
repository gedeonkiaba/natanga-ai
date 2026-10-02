<?php

use App\Domain\DomainException;
use App\Http\Middleware\EnsureChildConsent;
use App\Http\Middleware\EnsureChildOwnership;
use App\Providers\AppServiceProvider;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use L5Swagger\L5SwaggerServiceProvider;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        api: __DIR__.'/../routes/api.php',
        apiPrefix: 'api',
    )
    ->withProviders([
        AppServiceProvider::class,
        L5SwaggerServiceProvider::class,
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'child.owner' => EnsureChildOwnership::class,
            'child.consent' => EnsureChildConsent::class,
        ]);

        // API pure : jamais de redirection vers une page de login.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // RFC 7807 (problem+json) — équivalent du `DomainExceptionFilter` NestJS.
        // Note : dans Laravel 11, `Illuminate\Routing\Pipeline` intercepte les exceptions
        // du contrôleur AVANT tout middleware ; le rendu se fait donc ici, via le Handler.
        $exceptions->render(function (DomainException $e, Request $request) {
            return response()->json([
                'type' => 'about:blank',
                'title' => $e->getMessage(),
                'status' => $e->httpStatus(),
                'code' => $e->errorCode,
            ], $e->httpStatus());
        });

        // 401 RFC 7807 pour toute requête non authentifiée (jeton absent, invalide ou expiré).
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            return response()->json([
                'type' => 'about:blank',
                'title' => 'authentification requise',
                'status' => 401,
                'code' => 'ERR_UNAUTHENTICATED',
            ], 401);
        });

        // Anti-fuite : jamais de stacktrace pour une erreur de domaine.
        $exceptions->dontReport(DomainException::class);
    })
    ->create();
