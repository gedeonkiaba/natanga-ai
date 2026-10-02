<?php

declare(strict_types=1);

use App\Models\Diagnostic;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * T4 — endpoints de diagnostic (`docs/23` §4.3).
 * Le niveau est calculé par le `DiagnosticEngine` (testé en unitaire) ;
 * ici on verrouille le contrat HTTP (RFC 7807) et la persistance.
 */
uses(RefreshDatabase::class);

it('enregistre un diagnostic fluide et le persiste', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 0.9, 'B' => 0.9, 'C' => 0.9, 'D' => 0.9, 'E' => 0.9],
        'speedWpm' => 72,
        'errorCount' => 1,
        'hesitationCount' => 2,
    ]);

    $res->assertStatus(201);
    expect($res->json('level'))->toBe('fluide');
    expect($res->json('score'))->toBeGreaterThan(0.8);
    expect((float) $res->json('speedWpm'))->toBe(72.0);
    expect($res->json('errorCount'))->toBe(1);
    expect($res->json('hesitationCount'))->toBe(2);
    expect($res->json('explanation'))->toContain('Fluide');
    expect(Diagnostic::count())->toBe(1);
});

it('classe un score moyen en progression', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 0.6, 'B' => 0.6, 'C' => 0.6, 'D' => 0.6, 'E' => 0.6],
    ]);

    $res->assertStatus(201);
    expect($res->json('level'))->toBe('progression');
});

it('classe un score faible en découverte', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 0.2, 'B' => 0.2, 'C' => 0.2, 'D' => 0.2, 'E' => 0.2],
    ]);

    $res->assertStatus(201);
    expect($res->json('level'))->toBe('decouverte');
    expect($res->json('score'))->toBeLessThan(0.5);
});

it('retourne « découverte » sans épreuve renseignée', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', ['childId' => $child->id]);

    $res->assertStatus(201);
    expect($res->json('level'))->toBe('decouverte');
});

it('rejette un enfant inconnu (RFC 7807, 404)', function () {
    actingAsParent();
    $res = $this->postJson('/api/diagnostics', [
        'childId' => '00000000-0000-0000-0000-000000000000',
        'scores' => ['A' => 0.5],
    ]);

    $res->assertStatus(404);
    expect($res->json('code'))->toBe('CHILD_NOT_FOUND');
    expect($res->json('type'))->toBe('about:blank');
});

it('rejette un score hors plage [0..1]', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 1.5],
    ]);

    $res->assertStatus(422);
    expect(Diagnostic::count())->toBe(0);
});

it('rejette une épreuve inconnue (RFC 7807, 400)', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['Z' => 0.5],
    ]);

    $res->assertStatus(400);
    expect($res->json('code'))->toBe('ERR_SCORES');
});

it("retourne l'historique des diagnostics d'un enfant", function () {
    $child = makeVerifiedChild();

    $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 0.3, 'B' => 0.3, 'C' => 0.3, 'D' => 0.3, 'E' => 0.3],
    ])->assertStatus(201);

    $this->postJson('/api/diagnostics', [
        'childId' => $child->id,
        'scores' => ['A' => 0.9, 'B' => 0.9, 'C' => 0.9, 'D' => 0.9, 'E' => 0.9],
    ])->assertStatus(201);

    $history = $this->getJson("/api/children/{$child->id}/diagnostics");
    $history->assertOk();
    expect($history->json())->toHaveCount(2);
    expect(array_column($history->json(), 'level'))->toContain('fluide');
    expect(array_column($history->json(), 'level'))->toContain('decouverte');
});

it('rejette l’historique d’un enfant inconnu (404)', function () {
    actingAsParent();
    $this->getJson('/api/children/00000000-0000-0000-0000-000000000000/diagnostics')
        ->assertStatus(404);
});
