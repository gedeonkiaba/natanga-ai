<?php

declare(strict_types=1);

use App\Auth\TokenGuard;
use App\Models\ApiToken;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Authentification par jeton Bearer (guard `api`, App\Auth\TokenGuard).
 * Chaque requête réinitialise les guards pour simuler un process PHP neuf.
 */
uses(RefreshDatabase::class);

function freshRequest(): void
{
    app('auth')->forgetGuards();
}

it('émet un jeton au login et l’accepte sur une route protégée', function () {
    [$user] = makeParentWithToken('login@test.local');

    $login = $this->postJson('/api/auth/login', ['email' => 'LOGIN@test.local', 'password' => 'secret1234']);
    $login->assertOk();
    expect($login->json('tokenType'))->toBe('Bearer')
        ->and($login->json('userId'))->toBe($user->id)
        ->and(strlen($login->json('token')))->toBe(64);

    freshRequest();
    $this->withToken($login->json('token'))->getJson('/api/auth/me')
        ->assertOk()
        ->assertJsonPath('userId', $user->id);
});

it('ne stocke jamais le jeton en clair (hash SHA-256 uniquement)', function () {
    [$user, $plain] = makeParentWithToken();

    $row = ApiToken::where('user_id', $user->id)->firstOrFail();
    expect($row->token_hash)->toBe(hash('sha256', $plain))
        ->and($row->token_hash)->not->toBe($plain);
});

it('renvoie la même erreur pour un email inconnu et un mauvais mot de passe', function () {
    makeParentWithToken('known@test.local');

    $wrongPwd = $this->postJson('/api/auth/login', ['email' => 'known@test.local', 'password' => 'mauvais123']);
    $unknown = $this->postJson('/api/auth/login', ['email' => 'nobody@test.local', 'password' => 'mauvais123']);

    $wrongPwd->assertStatus(401);
    $unknown->assertStatus(401);
    expect($wrongPwd->json())->toBe($unknown->json())
        ->and($wrongPwd->json('code'))->toBe('ERR_LOGIN');
});

it('rejette en 401 RFC 7807 une requête sans jeton, avec jeton inconnu ou mal formé', function (array $headers) {
    $res = $this->withHeaders($headers)->getJson('/api/children');

    $res->assertStatus(401);
    expect($res->json())->toMatchArray([
        'type' => 'about:blank',
        'status' => 401,
        'code' => 'ERR_UNAUTHENTICATED',
    ]);
})->with([
    'sans en-tête' => [[]],
    'jeton inconnu' => [['Authorization' => 'Bearer '.str_repeat('x', 64)]],
    'schéma Basic' => [['Authorization' => 'Basic Zm9vOmJhcg==']],
    'ancien x-user-id' => [['x-user-id' => '00000000-0000-0000-0000-000000000000']],
]);

it('rejette un jeton expiré', function () {
    [$user, $plain] = makeParentWithToken();
    ApiToken::where('user_id', $user->id)->update(['expires_at' => now()->subMinute()]);

    $this->withToken($plain)->getJson('/api/auth/me')->assertStatus(401);
});

it('rejette le jeton d’un compte qui n’est plus ACTIVE', function () {
    [$user, $plain] = makeParentWithToken();
    $user->update(['status' => 'SUSPENDED']);

    $this->withToken($plain)->getJson('/api/auth/me')->assertStatus(401);
});

it('révoque le jeton courant au logout (les autres appareils restent connectés)', function () {
    [$user, $phone] = makeParentWithToken();
    $tablet = TokenGuard::issue($user, 'tablet');

    $this->withToken($phone)->postJson('/api/auth/logout')->assertNoContent();

    freshRequest();
    $this->withToken($phone)->getJson('/api/auth/me')->assertStatus(401);

    freshRequest();
    $this->withToken($tablet)->getJson('/api/auth/me')->assertOk();
});

it('limite les tentatives de login (throttle)', function () {
    makeParentWithToken('brute@test.local');

    foreach (range(1, 10) as $i) {
        $this->postJson('/api/auth/login', ['email' => 'brute@test.local', 'password' => 'essai'.$i.'xx']);
    }

    $this->postJson('/api/auth/login', ['email' => 'brute@test.local', 'password' => 'secret1234'])
        ->assertStatus(429);
});
