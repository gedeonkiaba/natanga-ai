<?php

declare(strict_types=1);

use App\Models\EmailToken;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Test e2e du parcours consentement — transposition fidèle du
 * `consent.e2e-spec.ts` NestJS (contrat API identique).
 * Nécessite une BDD de test (RefreshDatabase + SQLite en mémoire).
 */
uses(RefreshDatabase::class);

it('déroule le parcours complet de bout en bout', function () {
    // 1. Register.
    $reg = $this->postJson('/api/auth/register', [
        'email' => 'parent@e2e.test',
        'password' => 'secret1234',
    ]);
    $reg->assertStatus(201);
    $userId = $reg->json('userId');

    // 2. Verify-email avec token invalide → 401 ERR_TOKEN (RFC 7807).
    $bad = $this->postJson('/api/auth/verify-email', ['token' => 'invalide']);
    $bad->assertStatus(401);
    expect($bad->json('code'))->toBe('ERR_TOKEN');

    // 3. Verify-email avec le vrai token (mono-usage) → 201.
    $token = EmailToken::where('user_id', $userId)->value('token');
    expect($token)->not->toBeNull();
    $this->postJson('/api/auth/verify-email', ['token' => $token])->assertStatus(201);

    // 3 bis. Login → jeton Bearer ; toutes les requêtes suivantes sont authentifiées.
    $login = $this->postJson('/api/auth/login', [
        'email' => 'parent@e2e.test',
        'password' => 'secret1234',
    ]);
    $login->assertOk();
    expect($login->json('userId'))->toBe($userId);
    $bearer = ['Authorization' => 'Bearer '.$login->json('token')];

    // 4. Create child trop jeune → 422 ERR_AGE (garde-fou COPPA, parent vérifié).
    $tooYoung = ((int) date('Y')) - 3;
    $ko = $this->withHeaders($bearer)->postJson('/api/children', [
        'displayName' => 'X',
        'birthYear' => $tooYoung,
    ]);
    $ko->assertStatus(422);
    expect($ko->json('code'))->toBe('ERR_AGE');

    // 5. Create child valide → 201, INACTIVE (invariant C2), ageBand 6-8.
    $birthYear = ((int) date('Y')) - 7;
    $child = $this->withHeaders($bearer)->postJson('/api/children', [
        'displayName' => 'Léa',
        'birthYear' => $birthYear,
    ]);
    $child->assertStatus(201);
    $childId = $child->json('id');
    expect($child->json('status'))->toBe('INACTIVE');
    expect($child->json('ageBand'))->toBe('6-8');

    // 5 bis. Sans consentement : aucune activité enfant possible (403).
    $this->withHeaders($bearer)->getJson("/api/children/{$childId}/texts")
        ->assertStatus(403)->assertJsonPath('code', 'ERR_CONSENT_REQUIRED');

    // 6. Grant → enfant ACTIVE.
    $this->withHeaders($bearer)->postJson("/api/children/{$childId}/consents", ['action' => 'grant'])
        ->assertStatus(201);
    $after = $this->withHeaders($bearer)->getJson("/api/children/{$childId}");
    $after->assertStatus(200);
    expect($after->json('status'))->toBe('ACTIVE');

    $this->withHeaders($bearer)->getJson("/api/children/{$childId}/texts")->assertOk();

    // 7. Revoke → enfant INACTIVE + historique append-only (versions 1..2).
    $this->withHeaders($bearer)->postJson("/api/children/{$childId}/consents", ['action' => 'revoke'])
        ->assertStatus(201);
    $history = $this->withHeaders($bearer)->getJson("/api/children/{$childId}/consents");
    $history->assertStatus(200);
    expect(array_column($history->json(), 'version'))->toBe([1, 2]);

    // 8. Export (droit d'accès/portabilité).
    $export = $this->withHeaders($bearer)->getJson("/api/children/{$childId}/export");
    $export->assertStatus(200);
    expect($export->json())->toHaveKey('profile');
    expect($export->json())->toHaveKey('consents');

    // 9. Suppression (droit à l'effacement, idempotent).
    $this->withHeaders($bearer)->deleteJson("/api/children/{$childId}")
        ->assertStatus(200);
    $this->withHeaders($bearer)->deleteJson("/api/children/{$childId}")
        ->assertStatus(200);

    // 10. Health.
    $this->getJson('/api/health')->assertOk();
});

it('refuse un email déjà utilisé sans révéler l’existence', function () {
    $this->postJson('/api/auth/register', [
        'email' => 'dupe@e2e.test',
        'password' => 'secret1234',
    ])->assertStatus(201);

    $again = $this->postJson('/api/auth/register', [
        'email' => 'dupe@e2e.test',
        'password' => 'autre1234',
    ]);
    $again->assertStatus(401);
    expect($again->json('code'))->toBe('ERR_REGISTER');
});

it('refuse la création d’un enfant si le parent n’a pas vérifié son email', function () {
    $reg = $this->postJson('/api/auth/register', [
        'email' => 'pending@e2e.test',
        'password' => 'secret1234',
    ]);
    $reg->assertStatus(201);

    // Un parent non vérifié ne peut pas obtenir de jeton…
    $login = $this->postJson('/api/auth/login', [
        'email' => 'pending@e2e.test',
        'password' => 'secret1234',
    ]);
    $login->assertStatus(403);
    expect($login->json('code'))->toBe('ERR_NOT_VERIFIED');

    // … et sans jeton, la création d'enfant est refusée (401).
    $birthYear = ((int) date('Y')) - 7;
    $this->postJson('/api/children', ['displayName' => 'Léa', 'birthYear' => $birthYear])
        ->assertStatus(401)
        ->assertJsonPath('code', 'ERR_UNAUTHENTICATED');
});
