<?php

use App\Http\Controllers\AccessibilityController;
use App\Http\Controllers\AttemptController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChildrenController;
use App\Http\Controllers\ConsentController;
use App\Http\Controllers\DiagnosticController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\GdprController;
use App\Http\Controllers\OnboardingController;
use App\Http\Controllers\ParentDashboardController;
use App\Http\Controllers\PedagogyController;
use App\Http\Controllers\ReadingSessionController;
use App\Http\Controllers\RewardController;
use App\Http\Controllers\TextLibraryController;

/*
|--------------------------------------------------------------------------
| Routes API Natanga — contrats identiques à l'API NestJS.
|--------------------------------------------------------------------------
| Le client Flutter (`apps/mobile-flutter`) consomme exactement ces endpoints.
| Les erreurs RFC 7807 sont rendues par le renderer `DomainException` déclaré
| dans `bootstrap/app.php` (`withExceptions`).
*/

/*
| Sécurité (docs/25) :
|  - `auth`          : jeton Bearer obligatoire (guard `api`, App\Auth\TokenGuard) ;
|  - `child.owner`   : l'enfant ciblé appartient au parent connecté, sinon 404 (anti-énumération) ;
|  - `child.consent` : consentement parental GRANTED requis (enfant ACTIVE), sinon 403.
*/

// --- Public ---------------------------------------------------------------
Route::middleware('throttle:10,1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/verify-email', [AuthController::class, 'verifyEmail']);
    Route::post('auth/resend-verification', [AuthController::class, 'resendVerification']);
    Route::post('auth/login', [AuthController::class, 'login']);
});

Route::get('health', fn () => response()->json(['status' => 'ok']));

// --- Authentifié ----------------------------------------------------------
Route::middleware('auth')->group(function () {
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);

    Route::post('children', [ChildrenController::class, 'store']);
    Route::get('children', [ChildrenController::class, 'index']);

    // Effacement RGPD : idempotent, contrôle de propriété dans le contrôleur
    // (un enfant inexistant ou d'un autre parent → 200 sans effet).
    Route::delete('children/{childId}', [GdprController::class, 'erase']);

    // Contenu pédagogique (non lié à un enfant).
    Route::get('lessons/{id}', [PedagogyController::class, 'lesson']);

    // --- Parent titulaire de l'enfant (lecture + gestion du consentement) ---
    Route::middleware('child.owner')->group(function () {
        Route::get('children/{id}', [ChildrenController::class, 'show']);

        Route::post('children/{childId}/consents', [ConsentController::class, 'apply']);
        Route::get('children/{childId}/consents', [ConsentController::class, 'history']);
        Route::get('children/{childId}/export', [GdprController::class, 'export']);

        Route::get('parent/dashboard/{childId}', [ParentDashboardController::class, 'show']);
        Route::get('children/{childId}/diagnostics', [DiagnosticController::class, 'history']);
        Route::get('children/{childId}/rewards', [RewardController::class, 'index']);
        Route::get('children/{childId}/sessions', [ReadingSessionController::class, 'index']);
        Route::get('children/{childId}/settings', [AccessibilityController::class, 'show']);

        // --- Activité de l'enfant : consentement parental actif obligatoire ---
        Route::middleware('child.consent')->group(function () {
            // M1 — onboarding
            Route::patch('children/{id}', [OnboardingController::class, 'update']);
            Route::post('children/{id}/level', [OnboardingController::class, 'adjustLevel']);

            // P1 — diagnostic & exercices (childId dans le corps)
            Route::post('diagnostics', [DiagnosticController::class, 'store']);
            Route::post('attempts', [AttemptController::class, 'store']);
            Route::get('children/{childId}/skill-tree', [PedagogyController::class, 'skillTree']);

            // M2 + M4 — atelier de lecture
            Route::get('children/{childId}/texts', [TextLibraryController::class, 'index']);
            Route::post('children/{childId}/sessions', [ReadingSessionController::class, 'store']);

            // M5 — réglages & événements
            Route::patch('children/{childId}/settings', [AccessibilityController::class, 'update']);
            Route::post('children/{childId}/events', [EventController::class, 'store']);
        });
    });
});
