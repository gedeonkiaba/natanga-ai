<?php

declare(strict_types=1);

namespace App\Auth;

use App\Models\ApiToken;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Résolution de l'utilisateur à partir d'un jeton `Authorization: Bearer <token>`.
 *
 * - Seul le hash SHA-256 du jeton est stocké et comparé.
 * - Jeton expiré ou parent non ACTIVE → non authentifié.
 * - `last_used_at` est rafraîchi au plus une fois par minute (évite une écriture par requête).
 */
final class TokenGuard
{
    /** Durée de vie d'un jeton (jours). */
    public const TTL_DAYS = 30;

    public function __invoke(Request $request): ?User
    {
        $plain = $request->bearerToken();
        if ($plain === null || $plain === '') {
            return null;
        }

        $token = ApiToken::where('token_hash', self::hash($plain))->first();
        if ($token === null || $token->isExpired()) {
            return null;
        }

        $user = $token->user;
        if ($user === null || $user->status !== 'ACTIVE') {
            return null;
        }

        if ($token->last_used_at === null || $token->last_used_at->lt(now()->subMinute())) {
            $token->forceFill(['last_used_at' => now()])->save();
        }

        $user->currentToken = $token;

        return $user;
    }

    /**
     * Émet un nouveau jeton pour l'utilisateur et renvoie le jeton EN CLAIR
     * (unique occasion où il est visible).
     */
    public static function issue(User $user, string $name = 'default'): string
    {
        $plain = Str::random(64);

        ApiToken::create([
            'id' => (string) Str::uuid(),
            'user_id' => $user->id,
            'name' => mb_substr($name, 0, 100),
            'token_hash' => self::hash($plain),
            'expires_at' => now()->addDays(self::TTL_DAYS),
        ]);

        return $plain;
    }

    public static function hash(string $plain): string
    {
        return hash('sha256', $plain);
    }
}
