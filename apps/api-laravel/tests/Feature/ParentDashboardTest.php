<?php

declare(strict_types=1);

use App\Models\Attempt;
use App\Models\ChildEvent;
use App\Models\Diagnostic;
use App\Models\Progress;
use App\Models\ReadingSession;
use App\Models\Reward;
use Database\Seeders\PedagogySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

/**
 * Module 5 LexiKids — espace parent minimal (MVP0) + événements produit.
 * Verrouille la synthèse du jour, les cumuls, les confusions récurrentes,
 * les recommandations bienveillantes et la liste blanche des événements.
 */
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PedagogySeeder::class);
});

it('résume la journée et la progression avec une recommandation sur les sons b et d', function () {
    $child = makeVerifiedChild(['avatar' => 'lapin', 'placement_level' => '2']);

    $todaySession = ReadingSession::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'duration_sec' => 420,
        'words_read' => 60,
        'correct_words' => 55,
        'completed' => true,
        'stars' => 3,
    ]);

    // Session d'hier : exclue des KPI du jour, incluse dans les cumuls.
    $yesterdaySession = ReadingSession::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'duration_sec' => 999,
        'completed' => false,
        'stars' => 7,
    ]);
    $yesterdaySession->created_at = now()->subDay();
    $yesterdaySession->save();

    // Confusion b/d récurrente : 2 tentatives erronées.
    foreach (range(1, 2) as $ignored) {
        Attempt::create([
            'id' => (string) Str::uuid(),
            'child_id' => $child->id,
            'exercise_id' => 'e-vowel-a',
            'is_correct' => false,
            'error_kind' => 'confusion-b-d',
        ]);
    }

    Reward::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'kind' => 'gems',
        'amount' => 10,
        'reason' => 'réussite',
    ]);

    Progress::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'node_id' => 'n-letters-a',
        'status' => 'mastered',
        'mastered_score' => 1,
    ]);

    Diagnostic::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'level_result' => 'progression',
        'score' => 0.62,
        'error_count' => 3,
        'hesitation_count' => 1,
        'created_at' => now(),
    ]);

    $res = $this->getJson("/api/parent/dashboard/{$child->id}");
    $res->assertOk();

    expect($res->json('dashboard.child.id'))->toBe($child->id);
    expect($res->json('dashboard.child.displayName'))->toBe('Léa');
    expect($res->json('dashboard.child.placementLevel'))->toBe('2');
    expect($res->json('dashboard.child.avatar'))->toBe('lapin');

    // Aujourd'hui : seule la session du jour compte.
    expect($res->json('dashboard.today.sessionsCount'))->toBe(1);
    expect($res->json('dashboard.today.durationSec'))->toBe(420);
    expect($res->json('dashboard.today.starsEarnedToday'))->toBe(3);

    // Cumuls : les deux sessions, les gemmes et la maîtrise.
    expect($res->json('dashboard.totals.sessions'))->toBe(2);
    expect($res->json('dashboard.totals.durationSec'))->toBe(1419);
    expect($res->json('dashboard.totals.stars'))->toBe(10);
    expect($res->json('dashboard.totals.gems'))->toBe(10);
    expect($res->json('dashboard.totals.masteredNodes'))->toBe(1);

    expect($res->json('dashboard.progression.mastered'))->toBe(1);
    expect($res->json('dashboard.progression.inProgress'))->toBe(0);
    expect($res->json('dashboard.progression.total'))->toBe(4);
    expect($res->json('dashboard.progression.percent'))->toBe(25);

    // Confusions : top 1 = b/d avec 2 occurrences.
    expect($res->json('dashboard.confusions'))->toHaveCount(1);
    expect($res->json('dashboard.confusions.0.errorKind'))->toBe('confusion-b-d');
    expect($res->json('dashboard.confusions.0.count'))->toBe(2);
    expect($res->json('dashboard.recommendations.0'))
        ->toBe('Des exercices sur les sons b et d seraient utiles.');

    // 5 dernières sessions : la plus récente d'abord.
    expect($res->json('dashboard.recentSessions'))->toHaveCount(2);
    expect($res->json('dashboard.recentSessions.0.id'))->toBe($todaySession->id);
    expect($res->json('dashboard.recentSessions.0.completed'))->toBeTrue();
    expect($res->json('dashboard.recentSessions.0.stars'))->toBe(3);

    expect($res->json('dashboard.diagnostic.result'))->toBe('progression');
    expect((float) $res->json('dashboard.diagnostic.score'))->toBe(0.62);
});

it('propose une recommandation douce à un parent sans aucune donnée', function () {
    $child = makeVerifiedChild();

    $res = $this->getJson("/api/parent/dashboard/{$child->id}");
    $res->assertOk();

    $recommendations = $res->json('dashboard.recommendations');
    expect($recommendations)->toBeArray()->not->toBeEmpty();
    expect(count($recommendations))->toBeLessThanOrEqual(3);
    foreach ($recommendations as $recommendation) {
        expect(strlen($recommendation))->toBeLessThan(120);
    }

    expect($res->json('dashboard.confusions'))->toBeEmpty();
    expect($res->json('dashboard.recentSessions'))->toBeEmpty();
    expect($res->json('dashboard.diagnostic'))->toBeNull();
    expect($res->json('dashboard.today.sessionsCount'))->toBe(0);
    expect($res->json('dashboard.today.durationSec'))->toBe(0);
    expect($res->json('dashboard.today.starsEarnedToday'))->toBe(0);
    expect($res->json('dashboard.totals.sessions'))->toBe(0);
    expect($res->json('dashboard.totals.gems'))->toBe(0);
    expect($res->json('dashboard.progression.mastered'))->toBe(0);
    expect($res->json('dashboard.progression.total'))->toBe(4);
    expect($res->json('dashboard.progression.percent'))->toBe(0);
});

it('404 sur un enfant inconnu pour le tableau de bord (RFC 7807)', function () {
    actingAsParent();
    $this->getJson('/api/parent/dashboard/00000000-0000-0000-0000-000000000000')
        ->assertStatus(404)
        ->assertJson(['code' => 'CHILD_NOT_FOUND']);
});

it('enregistre un événement produit valide (201)', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/events", [
        'name' => 'help_requested',
        'props' => ['screen' => 'lecture'],
    ]);

    $res->assertStatus(201);
    expect($res->json('event.id'))->not->toBeEmpty();
    expect($res->json('event.name'))->toBe('help_requested');
    expect($res->json('event.createdAt'))->not->toBeEmpty();

    expect(ChildEvent::count())->toBe(1);
    expect(ChildEvent::first()->props)->toBe(['screen' => 'lecture']);
});

it('rejette un événement hors liste blanche (422 EVENT_INVALID_NAME)', function () {
    $child = makeVerifiedChild();

    $this->postJson("/api/children/{$child->id}/events", ['name' => 'souris_survolée'])
        ->assertStatus(422)
        ->assertJson(['code' => 'EVENT_INVALID_NAME']);

    expect(ChildEvent::count())->toBe(0);
});

it('refuse des propriétés d’événement trop volumineuses (422 EVENT_INVALID_PROPS)', function () {
    $child = makeVerifiedChild();

    $this->postJson("/api/children/{$child->id}/events", [
        'name' => 'text_opened',
        'props' => ['blob' => str_repeat('a', 2100)],
    ])->assertStatus(422)->assertJson(['code' => 'EVENT_INVALID_PROPS']);

    expect(ChildEvent::count())->toBe(0);
});

it('404 sur un enfant inconnu pour un événement (RFC 7807)', function () {
    actingAsParent();
    $this->postJson('/api/children/00000000-0000-0000-0000-000000000000/events', [
        'name' => 'help_requested',
    ])->assertStatus(404)->assertJson(['code' => 'CHILD_NOT_FOUND']);
});
