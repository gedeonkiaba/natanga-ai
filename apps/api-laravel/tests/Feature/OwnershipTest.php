<?php

declare(strict_types=1);

use App\Models\Child;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Isolation entre parents (ChildPolicy + middleware `child.owner`).
 * Le parent B ne doit JAMAIS lire ni modifier l'enfant du parent A, et la réponse
 * doit être indiscernable d'un enfant inexistant (404 CHILD_NOT_FOUND).
 */
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);

    // Enfant du parent A (consentement accordé).
    $this->childOfA = makeVerifiedChild([], actAsParent: false);

    // Le test agit en tant que parent B, qui a son propre enfant.
    $this->childOfB = makeVerifiedChild();
});

dataset('routes sur un enfant', [
    'profil' => ['GET', '/api/children/{id}', []],
    'onboarding' => ['PATCH', '/api/children/{id}', ['avatar' => 'fox']],
    'niveau' => ['POST', '/api/children/{id}/level', ['level' => '2']],
    'consentement (écriture)' => ['POST', '/api/children/{id}/consents', ['action' => 'revoke']],
    'consentement (historique)' => ['GET', '/api/children/{id}/consents', []],
    'export RGPD' => ['GET', '/api/children/{id}/export', []],
    'dashboard parent' => ['GET', '/api/parent/dashboard/{id}', []],
    'diagnostics (historique)' => ['GET', '/api/children/{id}/diagnostics', []],
    'diagnostic (création)' => ['POST', '/api/diagnostics', ['childId' => '{id}', 'scores' => ['A' => 0.5]]],
    'tentative' => ['POST', '/api/attempts', ['childId' => '{id}', 'exerciseId' => 'e-1', 'isCorrect' => true]],
    'skill-tree' => ['GET', '/api/children/{id}/skill-tree', []],
    'récompenses' => ['GET', '/api/children/{id}/rewards', []],
    'bibliothèque' => ['GET', '/api/children/{id}/texts', []],
    'sessions (liste)' => ['GET', '/api/children/{id}/sessions', []],
    'sessions (création)' => ['POST', '/api/children/{id}/sessions', ['duration_sec' => 60, 'words_read' => 10, 'correct_words' => 9, 'completed' => true]],
    'réglages (lecture)' => ['GET', '/api/children/{id}/settings', []],
    'réglages (écriture)' => ['PATCH', '/api/children/{id}/settings', ['fontScale' => 1.5]],
    'événement' => ['POST', '/api/children/{id}/events', ['name' => 'help_requested']],
]);

it('renvoie 404 CHILD_NOT_FOUND quand un parent cible l’enfant d’un autre', function (string $method, string $uri, array $body) {
    $id = $this->childOfA->id;
    $uri = str_replace('{id}', $id, $uri);
    $body = array_map(fn ($v) => $v === '{id}' ? $id : $v, $body);

    $res = $this->json($method, $uri, $body);

    $res->assertStatus(404);
    expect($res->json('code'))->toBe('CHILD_NOT_FOUND');
})->with('routes sur un enfant');

it('produit une réponse identique pour un enfant d’autrui et un enfant inexistant', function () {
    $foreign = $this->getJson("/api/children/{$this->childOfA->id}");
    $missing = $this->getJson('/api/children/00000000-0000-0000-0000-000000000000');

    expect($foreign->status())->toBe($missing->status())
        ->and($foreign->json())->toBe($missing->json());
});

it('n’altère aucune donnée de l’enfant d’autrui', function () {
    $this->patchJson("/api/children/{$this->childOfA->id}", ['avatar' => 'pirate']);
    $this->postJson("/api/children/{$this->childOfA->id}/consents", ['action' => 'revoke']);

    $fresh = Child::find($this->childOfA->id);
    expect($fresh->avatar)->not->toBe('pirate')
        ->and($fresh->status)->toBe('ACTIVE')
        ->and($fresh->consents()->count())->toBe(1);
});

it('DELETE sur l’enfant d’autrui : 200 idempotent SANS effacement', function () {
    $this->deleteJson("/api/children/{$this->childOfA->id}")
        ->assertOk()
        ->assertJsonPath('erased', true);

    expect(Child::find($this->childOfA->id))->not->toBeNull();
});

it('ne liste que les enfants du parent connecté', function () {
    $ids = array_column($this->getJson('/api/children')->assertOk()->json(), 'id');

    expect($ids)->toBe([$this->childOfB->id]);
});

it('laisse le parent titulaire accéder à son propre enfant', function () {
    $this->getJson("/api/children/{$this->childOfB->id}")->assertOk()->assertJsonPath('id', $this->childOfB->id);
});
