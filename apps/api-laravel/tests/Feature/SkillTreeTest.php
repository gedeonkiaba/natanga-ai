<?php

declare(strict_types=1);

use App\Models\Progress;
use Database\Seeders\PedagogySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;

/**
 * T4 — arbre de compétences et détail de leçon (`docs/23` §5).
 * Verrouille le déblocage séquentiel (locked | available | in_progress | mastered)
 * et la résolution des items côté serveur.
 */
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(PedagogySeeder::class);
});

it("retourne l'arbre avec les statuts de déblocage séquentiel", function () {
    $child = makeVerifiedChild();

    $res = $this->getJson("/api/children/{$child->id}/skill-tree");
    $res->assertOk();

    expect($res->json('nodes'))->toHaveCount(4);
    expect(array_column($res->json('nodes'), 'status'))
        ->toBe(['available', 'locked', 'locked', 'locked']);
    expect($res->json('nodes.0.id'))->toBe('n-letters-a');
    expect($res->json('nodes.0.lessons.0.id'))->toBe('l-vowels-1');
    expect((float) $res->json('nodes.0.masteredScore'))->toBe(0.0);
});

it('débloque le nœud suivant quand le premier est maîtrisé', function () {
    $child = makeVerifiedChild();

    Progress::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'node_id' => 'n-letters-a',
        'status' => 'mastered',
        'mastered_score' => 1,
    ]);

    $res = $this->getJson("/api/children/{$child->id}/skill-tree");
    $res->assertOk();

    expect(array_column($res->json('nodes'), 'status'))
        ->toBe(['mastered', 'available', 'locked', 'locked']);
});

it('affiche un nœud « en cours » dès la première tentative', function () {
    $child = makeVerifiedChild();

    Progress::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'node_id' => 'n-letters-a',
        'status' => 'in_progress',
        'mastered_score' => 0.33,
    ]);

    $res = $this->getJson("/api/children/{$child->id}/skill-tree");
    $res->assertOk();

    expect($res->json('nodes.0.status'))->toBe('in_progress');
    expect($res->json('nodes.0.masteredScore'))->toBe(0.33);
});

it('retourne une leçon avec ses exercices et items résolus', function () {
    actingAsParent();
    $res = $this->getJson('/api/lessons/l-vowels-1');
    $res->assertOk();

    expect($res->json('kind'))->toBe('exercise');
    expect($res->json('nodeId'))->toBe('n-letters-a');
    expect($res->json('exercises'))->toHaveCount(4);

    $sound = collect($res->json('exercises'))->firstWhere('type', 'sound-grapheme');
    expect($sound['params']['phoneme'])->toBe('a');

    $word = collect($res->json('exercises'))->firstWhere('type', 'word-recognition');
    expect($word['items'])->toHaveCount(3);
    expect(array_column($word['items'], 'id'))
        ->toEqualCanonicalizing(['w-papa', 'w-maman', 'w-lapin']);
    // L'ordre SQL n'est pas garanti : on cherche par identifiant.
    expect(collect($word['items'])->firstWhere('id', 'w-papa')['label'])->toBe('papa');
});

it('404 sur une leçon inconnue (RFC 7807)', function () {
    actingAsParent();
    $res = $this->getJson('/api/lessons/l-inconnue');

    $res->assertStatus(404);
    expect($res->json('code'))->toBe('ERR_NOT_FOUND');
});

it('404 sur un enfant inconnu pour le skill-tree (RFC 7807)', function () {
    actingAsParent();
    $res = $this->getJson('/api/children/00000000-0000-0000-0000-000000000000/skill-tree');

    $res->assertStatus(404);
    expect($res->json('code'))->toBe('CHILD_NOT_FOUND');
});

it('chaque nœud du niveau 1 a une leçon jouable (b/d, p/q, mots simples)', function () {
    $child = makeVerifiedChild();

    $nodes = $this->getJson("/api/children/{$child->id}/skill-tree")->json('nodes');
    expect(array_column($nodes, 'id'))->toBe(['n-letters-a', 'n-letters-bd', 'n-letters-pq', 'n-mots-simples']);

    $bd = $this->getJson('/api/lessons/l-bd-1');
    $bd->assertOk();
    expect($bd->json())->toHaveKey('exercises');
    expect($bd->json('exercises'))->toHaveCount(5);
    expect($bd->json('exercises.0.params'))
        ->toBe(['phoneme' => 'b', 'cue' => 'b, comme ballon', 'itemIds' => ['g-b', 'g-d']]);

    foreach (['l-pq-1', 'l-mots-1'] as $lessonId) {
        expect($this->getJson("/api/lessons/{$lessonId}")->json('exercises'))->toHaveCount(5);
    }
});
