<?php

declare(strict_types=1);

namespace App\Services;

use App\Auth\TokenGuard;
use App\Domain\DomainException;
use App\Mail\VerifyEmailMail;
use App\Models\EmailToken;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

use function Illuminate\Support\defer;

/**
 * Service d'authentification — transposition du `AuthService` NestJS.
 * Anti-énumération : messages neutres, jamais d'indice sur l'existence d'un compte.
 */
class AuthService
{
    public function register(string $email, string $password): array
    {
        if (User::where('email', strtolower($email))->exists()) {
            // Ne révèle pas l'existence : message volontairement neutre.
            throw new DomainException('ERR_REGISTER', 'email déjà utilisé');
        }

        $user = User::create([
            'id' => Str::uuid(),
            'email' => strtolower($email),
            'password_hash' => Hash::make($password),
            'role' => 'parent',
            'status' => 'PENDING_VERIFICATION',
        ]);

        $this->sendVerification($user);

        return ['userId' => $user->id, 'email' => $user->email];
    }

    /**
     * Renvoie le lien de vérification. Réponse identique que le compte existe ou
     * non (anti-énumération) ; seul un compte en attente reçoit un email.
     */
    public function resendVerification(string $email): void
    {
        $user = User::where('email', strtolower($email))->first();

        if ($user === null || $user->status !== 'PENDING_VERIFICATION') {
            return;
        }

        EmailToken::where('user_id', $user->id)->delete();
        $this->sendVerification($user);
    }

    /**
     * Émet un token mono-usage (24 h) et envoie le lien de vérification.
     * Un échec d'envoi est journalisé sans bloquer l'inscription (MAIL_HOST est
     * obligatoire en production, cf. docker-compose.prod.yml) : le parent
     * peut redemander un lien (`/auth/resend-verification`).
     */
    private function sendVerification(User $user): void
    {
        $token = (string) Str::uuid();
        EmailToken::create([
            'token' => $token,
            'user_id' => $user->id,
            'expires_at' => now()->addDay(),
        ]);

        $url = rtrim((string) config('app.frontend_url'), '/').'/verifier?token='.$token;

        // Envoi APRÈS la réponse HTTP : le temps de réponse ne révèle pas si un
        // compte en attente existe (anti-énumération sur resend-verification).
        $email = $user->email;
        defer(function () use ($email, $url) {
            try {
                Mail::to($email)->send(new VerifyEmailMail($url));
            } catch (\Throwable $e) {
                report($e);
            }
        });
    }

    public function verifyEmail(string $token): array
    {
        $record = EmailToken::find($token);
        if ($record === null || $record->expires_at->isPast()) {
            throw new DomainException('ERR_TOKEN', 'lien de vérification invalide ou expiré');
        }

        $user = User::find($record->user_id);
        if ($user === null) {
            throw new DomainException('ERR_TOKEN', 'compte introuvable');
        }

        $user->update(['status' => 'ACTIVE']);
        $record->delete(); // mono-usage

        return ['userId' => $user->id, 'status' => 'ACTIVE'];
    }

    /**
     * Connexion parent → jeton Bearer (renvoyé en clair une seule fois).
     *
     * Anti-énumération : email inconnu et mauvais mot de passe renvoient la même
     * erreur (401 ERR_LOGIN) ; un hash factice est calculé pour égaliser le temps
     * de réponse. Le statut « email non vérifié » n'est révélé qu'après un mot de
     * passe correct.
     */
    public function login(string $email, string $password, string $deviceName = 'default'): array
    {
        $user = User::where('email', strtolower($email))->first();

        if ($user === null) {
            Hash::check($password, self::dummyHash());
            throw new DomainException('ERR_LOGIN', 'identifiants invalides');
        }

        if (! Hash::check($password, $user->password_hash)) {
            throw new DomainException('ERR_LOGIN', 'identifiants invalides');
        }

        if ($user->status !== 'ACTIVE') {
            throw new DomainException('ERR_NOT_VERIFIED', 'adresse email non vérifiée');
        }

        $token = TokenGuard::issue($user, $deviceName);

        return [
            'token' => $token,
            'tokenType' => 'Bearer',
            'expiresInDays' => TokenGuard::TTL_DAYS,
            'userId' => $user->id,
        ];
    }

    /** Révoque le jeton de la requête courante (déconnexion de cet appareil). */
    public function logout(User $user): void
    {
        $user->currentToken?->delete();
    }

    private static function dummyHash(): string
    {
        static $hash = null;

        return $hash ??= Hash::make('natanga-timing-equalizer');
    }
}
