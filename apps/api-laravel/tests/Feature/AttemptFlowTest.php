<?php

declare(strict_types=1);

use App\Models\Attempt;
use App\Models\Progress;
use App\Models\Reward;
use Database\Seeders\PedagogySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * T4 — session de leçon : tentative → récompense → progression (`docs/23` §7).
 * Règles verrouillées :
 *   - réussite = 10 gemmes, effort (erreur) = 5 gemmes (jamais de punition),
 *   - maîtrise = ≥3 tentatives et score ≥0.7 sur le nœud, acquise définitivement.
 */
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PedagogySeeder::class);
});

it('enregistre une tentative correcte et récompense la réussite', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/attempts', [
        'childId' => $child->id,
        'exerciseId' => 'e-vowel-a',
        'itemId' => 'g-a',
        'isCorrect' => true,
    ]);

    $res->assertStatus(201);
    expect($res->json('reward.kind'))->toBe('gems');
    expect($res->json('reward.amount'))->toBe(10);
    expect($res->json('reward.reason'))->toBe('réussite');
    expect($res->json('attempt.isCorrect'))->toBeTrue();
    expect($res->json('progress.status'))->toBe('in_progress');
    expect((float) $res->json('progress.masteredScore'))->toBe(1.0);

    expect(Attempt::count())->toBe(1);
    expect(Reward::count())->toBe(1);
});

it("récompense l'effort même en cas d'erreur (gamification bienveillante)", function () {
    $child = makeVerifiedChild();

    $res = $this->postJson('/api/attempts', [
        'childId' => $child->id,
        'exerciseId' => 'e-vowel-a',
        'itemId' => 'g-b',
        'isCorrect' => false,
        'errorKind' => 'confusion-b-d',
    ]);

    $res->assertStatus(201);
    expect($res->json('reward.kind'))->toBe('effort');
    expect($res->json('reward.amount'))->toBe(5);
    expect((float) $res->json('progress.masteredScore'))->toBe(0.0);

    // `error_kind` est conservé comme métrique d'apprentissage (pas un diagnostic).
    expect(Attempt::first()->error_kind)->toBe('confusion-b-d');
});

it('maîtrise le nœud après 3 tentatives solides et débloque le suivant', function () {
    $child = makeVerifiedChild();

    foreach (['e-vowel-a', 'e-vowel-i', 'e-vowel-o'] as $exerciseId) {
        $this->postJson('/api/attempts', [
            'childId' => $child->id,
            'exerciseId' => $exerciseId,
            'itemId' => 'g-a',
            'isCorrect' => true,
        ])->assertStatus(201);
    }

    $progress = Progress::where('child_id', $child->id)->first();
    expect($progress->status)->toBe('mastered');
    expect((float) $progress->mastered_score)->toBe(1.0);

    $tree = $this->getJson("/api/children/{$child->id}/skill-tree");
    $tree->assertOk();
    expect(array_column($tree->json('nodes'), 'status'))
        ->toBe(['mastered', 'available', 'locked', 'locked']);
});

it('ne maîtrise pas un nœud avec un score insuffisant', function () {
    $child = makeVerifiedChild();

    // 3 tentatives : 1 réussite, 2 erreurs → ratio 0.33 < 0.7.
    $this->postJson('/api/attempts', [
        'childId' => $child->id, 'exerciseId' => 'e-vowel-a', 'isCorrect' => true,
    ])->assertStatus(201);
    $this->postJson('/api/attempts', [
        'childId' => $child->id, 'exerciseId' => 'e-vowel-i', 'isCorrect' => false,
    ])->assertStatus(201);
    $this->postJson('/api/attempts', [
        'childId' => $child->id, 'exerciseId' => 'e-vowel-o', 'isCorrect' => false,
    ])->assertStatus(201);

    $progress = Progress::where('child_id', $child->id)->first();
    expect($progress->status)->toBe('in_progress');
    expect(abs((float) $progress->mastered_score - 0.3333))->toBeLessThan(0.001);

    // L'arbre reflète un nœud verrouillé tant que non maîtrisé.
    $tree = $this->getJson("/api/children/{$child->id}/skill-tree");
    expect(array_column($tree->json('nodes'), 'status'))
        ->toBe(['in_progress', 'locked', 'locked', 'locked']);
});

it('expose les récompenses de l’enfant', function () {
    $child = makeVerifiedChild();

    $this->postJson('/api/attempts', [
        'childId' => $child->id,
        'exerciseId' => 'e-vowel-a',
        'isCorrect' => true,
    ])->assertStatus(201);

    $res = $this->getJson("/api/children/{$child->id}/rewards");
    $res->assertOk();
    expect($res->json('rewards'))->toHaveCount(1);
    expect($res->json('rewards.0.kind'))->toBe('gems');
    expect($res->json('unlocks'))->toBeEmpty(); // seuils 3/5/10/20 lectures : branchés en T10.
});

it('404 sur un enfant ou un exercice inconnu (RFC 7807)', function () {
    actingAsParent();
    $this->postJson('/api/attempts', [
        'childId' => '00000000-0000-0000-0000-000000000000',
        'exerciseId' => 'e-vowel-a',
        'isCorrect' => true,
    ])->assertStatus(404)->assertJson(['code' => 'CHILD_NOT_FOUND']);

    $child = makeVerifiedChild();
    $this->postJson('/api/attempts', [
        'childId' => $child->id,
        'exerciseId' => 'e-inconnue',
        'isCorrect' => true,
    ])->assertStatus(404)->assertJson(['code' => 'ERR_NOT_FOUND']);
});

it('rejette un corps incomplet (422)', function () {
    $child = makeVerifiedChild();

    $this->postJson('/api/attempts', ['childId' => $child->id])
        ->assertStatus(422);
});
