<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

/**
 * Compte parent. Authenticatable pour le guard `api` (jetons Bearer, cf. `App\Auth\TokenGuard`).
 */
class User extends Authenticatable
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'email', 'password_hash', 'role', 'status'];

    protected $hidden = ['password_hash'];

    /** Jeton en cours d'utilisation pour la requête (renseigné par le guard). */
    public ?ApiToken $currentToken = null;

    public function getAuthPassword(): string
    {
        return $this->password_hash;
    }

    /** Pas de « remember me » : API stateless. */
    public function getRememberTokenName(): string
    {
        return '';
    }

    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'user_id');
    }

    public function apiTokens(): HasMany
    {
        return $this->hasMany(ApiToken::class, 'user_id');
    }
}
