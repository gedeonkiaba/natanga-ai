<?php

declare(strict_types=1);

use App\Auth\TokenGuard;
use App\Models\Child;
use App\Models\Consent;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/*
|--------------------------------------------------------------------------
| Test Case
|--------------------------------------------------------------------------
*/

uses(TestCase::class)->in('Feature', 'Unit');

/**
 * Crée directement un parent ACTIVE + un enfant valide (6-8 ans) dont le
 * consentement parental est accordé (status ACTIVE, consentement GRANTED v1),
 * puis AUTHENTIFIE le test en tant que ce parent (guard `api`).
 *
 * Le parcours HTTP complet (login, jeton Bearer, consentement) est couvert par
 * `ConsentFlowTest`, `AuthTokenTest`, `OwnershipTest` et `ConsentGateTest` ;
 * ici on teste le domaine pédagogique.
 *
 * Passer `['status' => 'INACTIVE']` pour un enfant sans consentement.
 */
function makeVerifiedChild(array $childAttributes = [], bool $actAsParent = true): Child
{
    $user = User::create([
        'id' => (string) Str::uuid(),
        'email' => 'parent-'.Str::uuid()->toString().'@test.local',
        'password_hash' => Hash::make('secret1234'),
        'role' => 'parent',
        'status' => 'ACTIVE',
    ]);

    $child = Child::create(array_merge([
        'id' => (string) Str::uuid(),
        'user_id' => $user->id,
        'display_name' => 'Léa',
        'birth_year' => ((int) date('Y')) - 7,
        'age_band' => '6-8',
        'status' => 'ACTIVE',
    ], $childAttributes));

    if ($child->status === 'ACTIVE') {
        Consent::create([
            'id' => $child->id.':'.Str::uuid(),
            'child_id' => $child->id,
            'version' => 1,
            'status' => 'GRANTED',
            'granted_at' => now(),
            'audit' => ['source' => 'test', 'userAgent' => 'pest', 'ipPrefix' => '0.0.0.0', 'timestamp' => now()->toIso8601String()],
        ]);
    }

    if ($actAsParent) {
        test()->actingAs($user, 'api');
    }

    return $child;
}

/** Crée un parent ACTIVE (sans enfant) et renvoie un jeton Bearer réel pour lui. */
function makeParentWithToken(?string $email = null): array
{
    $user = User::create([
        'id' => (string) Str::uuid(),
        'email' => $email ?? 'parent-'.Str::uuid()->toString().'@test.local',
        'password_hash' => Hash::make('secret1234'),
        'role' => 'parent',
        'status' => 'ACTIVE',
    ]);

    return [$user, TokenGuard::issue($user, 'pest')];
}

/** Authentifie le test en tant qu'un nouveau parent ACTIVE sans enfant. */
function actingAsParent(): User
{
    [$user] = makeParentWithToken();
    test()->actingAs($user, 'api');

    return $user;
}
