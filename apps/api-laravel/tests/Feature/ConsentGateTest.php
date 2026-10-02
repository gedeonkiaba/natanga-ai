<?php

declare(strict_types=1);

use App\Models\Child;
use App\Models\ChildEvent;
use App\Models\ReadingSession;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Garde RGPD/COPPA (middleware `child.consent`) : sans consentement parental
 * GRANTED, aucune activité de l'enfant n'est possible ni aucune donnée collectée.
 * Le parent garde l'accès en lecture, à l'export et à l'effacement.
 */
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(DatabaseSeeder::class);
    $this->child = makeVerifiedChild(['status' => 'INACTIVE']);
});

dataset('activités enfant', [
    'onboarding' => ['PATCH', '/api/children/{id}', ['avatar' => 'fox']],
    'niveau' => ['POST', '/api/children/{id}/level', ['level' => '2']],
    'diagnostic' => ['POST', '/api/diagnostics', ['childId' => '{id}', 'scores' => ['A' => 0.5]]],
    'tentative' => ['POST', '/api/attempts', ['childId' => '{id}', 'exerciseId' => 'e-1', 'isCorrect' => true]],
    'skill-tree' => ['GET', '/api/children/{id}/skill-tree', []],
    'bibliothèque' => ['GET', '/api/children/{id}/texts', []],
    'session de lecture' => ['POST', '/api/children/{id}/sessions', ['duration_sec' => 60, 'words_read' => 10, 'correct_words' => 9, 'completed' => true]],
    'réglages (écriture)' => ['PATCH', '/api/children/{id}/settings', ['fontScale' => 1.5]],
    'événement' => ['POST', '/api/children/{id}/events', ['name' => 'help_requested']],
]);

dataset('accès parent sans consentement', [
    'profil' => ['/api/children/{id}'],
    'historique consentement' => ['/api/children/{id}/consents'],
    'export RGPD' => ['/api/children/{id}/export'],
    'dashboard' => ['/api/parent/dashboard/{id}'],
    'sessions (liste)' => ['/api/children/{id}/sessions'],
    'réglages (lecture)' => ['/api/children/{id}/settings'],
    'récompenses' => ['/api/children/{id}/rewards'],
    'diagnostics (historique)' => ['/api/children/{id}/diagnostics'],
]);

function bind(string $uri, array $body, string $id): array
{
    return [
        str_replace('{id}', $id, $uri),
        array_map(fn ($v) => $v === '{id}' ? $id : $v, $body),
    ];
}

it('bloque toute activité enfant sans consentement (403 ERR_CONSENT_REQUIRED)', function (string $method, string $uri, array $body) {
    [$uri, $body] = bind($uri, $body, $this->child->id);

    $res = $this->json($method, $uri, $body);

    $res->assertStatus(403);
    expect($res->json())->toMatchArray([
        'type' => 'about:blank',
        'status' => 403,
        'code' => 'ERR_CONSENT_REQUIRED',
    ]);
})->with('activités enfant');

it('ne collecte aucune donnée quand le consentement manque', function () {
    $id = $this->child->id;
    $this->postJson("/api/children/{$id}/sessions", ['duration_sec' => 60, 'words_read' => 10, 'correct_words' => 9, 'completed' => true]);
    $this->postJson("/api/children/{$id}/events", ['name' => 'help_requested']);

    expect(ReadingSession::where('child_id', $id)->count())->toBe(0)
        ->and(ChildEvent::where('child_id', $id)->count())->toBe(0);
});

it('laisse le parent consulter, exporter et gérer sans consentement', function (string $uri) {
    [$uri] = bind($uri, [], $this->child->id);

    $this->getJson($uri)->assertOk();
})->with('accès parent sans consentement');

it('ouvre les activités après grant et les referme après revoke', function () {
    $id = $this->child->id;
    $session = ['duration_sec' => 60, 'words_read' => 10, 'correct_words' => 9, 'completed' => true];

    $this->postJson("/api/children/{$id}/sessions", $session)->assertStatus(403);

    $this->postJson("/api/children/{$id}/consents", ['action' => 'grant'])->assertStatus(201);
    $this->postJson("/api/children/{$id}/sessions", $session)->assertStatus(201);

    $this->postJson("/api/children/{$id}/consents", ['action' => 'revoke'])->assertStatus(201);
    $this->postJson("/api/children/{$id}/sessions", $session)->assertStatus(403);

    expect(ReadingSession::where('child_id', $id)->count())->toBe(1);
});

it('refuse aussi après un refus explicite (deny)', function () {
    $this->postJson("/api/children/{$this->child->id}/consents", ['action' => 'deny'])->assertStatus(201);
    $this->getJson("/api/children/{$this->child->id}/texts")->assertStatus(403);
});

it('autorise la suppression RGPD sans consentement', function () {
    $this->deleteJson("/api/children/{$this->child->id}")->assertOk();

    expect(Child::find($this->child->id))->toBeNull();
});
