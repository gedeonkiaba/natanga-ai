<?php

declare(strict_types=1);

namespace App\Providers;

use App\Auth\TokenGuard;
use App\Domain\Consent\ConsentStateMachine;
use App\Models\Child;
use App\Policies\ChildPolicy;
use App\Services\AuthService;
use App\Services\ChildrenService;
use App\Services\ConsentService;
use Illuminate\Http\Middleware\TrustProxies;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Enregistre les services de l'application dans le conteneur.
     */
    public function register(): void
    {
        // Machine à états (singleton, sans état mutable).
        $this->app->singleton(ConsentStateMachine::class);

        // Services métier.
        $this->app->singleton(AuthService::class);
        $this->app->singleton(ChildrenService::class);
        $this->app->singleton(ConsentService::class, function ($app) {
            return new ConsentService($app->make(ConsentStateMachine::class));
        });
    }

    public function boot(): void
    {
        // Guard `api` : jeton Bearer opaque haché (cf. config/auth.php).
        Auth::viaRequest('api-token', new TokenGuard);

        // Autorisation parent → enfant.
        Gate::policy(Child::class, ChildPolicy::class);

        // Derrière le proxy web (apps/web → /api), l'IP du client vient de
        // X-Forwarded-For : sans cela, le throttle (10/min) serait partagé par
        // TOUS les parents. Ne jamais faire confiance à « * » si l'API est
        // exposée directement sur Internet (en-tête falsifiable).
        $proxies = config('app.trusted_proxies');
        if (is_string($proxies) && $proxies !== '') {
            TrustProxies::at($proxies === '*' ? '*' : array_map('trim', explode(',', $proxies)));
        }
    }
}
