<?php

declare(strict_types=1);

use App\Models\Progress;
use Database\Seeders\PedagogySeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
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

    expect($res->json('nodes'))->toHaveCount(54); // 52 leçons du parcours + 2 nœuds de textes
    expect(array_slice(array_column($res->json('nodes'), 'status'), 0, 4))
        ->toBe(['available', 'locked', 'locked', 'locked']);
    expect($res->json('nodes.0.id'))->toBe('n-son-a');
    expect($res->json('nodes.0.lessons.0.id'))->toBe('l-son-a');
    expect((float) $res->json('nodes.0.masteredScore'))->toBe(0.0);
});

it('débloque le nœud suivant quand le premier est maîtrisé', function () {
    $child = makeVerifiedChild();

    Progress::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'node_id' => 'n-son-a',
        'status' => 'mastered',
        'mastered_score' => 1,
    ]);

    $res = $this->getJson("/api/children/{$child->id}/skill-tree");
    $res->assertOk();

    expect(array_slice(array_column($res->json('nodes'), 'status'), 0, 4))
        ->toBe(['mastered', 'available', 'locked', 'locked']);
});

it('affiche un nœud « en cours » dès la première tentative', function () {
    $child = makeVerifiedChild();

    Progress::create([
        'id' => (string) Str::uuid(),
        'child_id' => $child->id,
        'node_id' => 'n-son-a',
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
    $res = $this->getJson('/api/lessons/l-son-a');
    $res->assertOk();

    expect($res->json('kind'))->toBe('exercise');
    expect($res->json('nodeId'))->toBe('n-son-a');
    expect($res->json('exercises'))->toHaveCount(4);

    $sound = collect($res->json('exercises'))->firstWhere('type', 'sound-grapheme');
    expect($sound['params']['phoneme'])->toBe('a');

    $word = collect($res->json('exercises'))->firstWhere('type', 'word-recognition');
    expect($word['items'])->toHaveCount(3);
    expect(array_column($word['items'], 'id'))
        ->toEqualCanonicalizing(['w-avion', 'w-doigt', 'w-ecole']);
    // L'ordre SQL n'est pas garanti : on cherche par identifiant.
    expect(collect($word['items'])->firstWhere('id', 'w-avion')['label'])->toBe('avion');
    expect(collect($word['items'])->firstWhere('id', 'w-avion')['syllables'])->toBe(['a', 'vi', 'on']);
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

it('sert le parcours de la base de connaissances : 6 niveaux, 52 leçons jouables', function () {
    $child = makeVerifiedChild();

    $nodes = $this->getJson("/api/children/{$child->id}/skill-tree")->json('nodes');
    expect(array_slice(array_column($nodes, 'id'), 0, 4))->toBe(['n-son-a', 'n-son-e', 'n-son-i', 'n-son-o']);
    expect(array_slice(array_column($nodes, 'id'), -2))->toBe(['n-textes-courts', 'n-textes-fluide']);
    expect(array_unique(array_column(array_slice($nodes, 0, 52), 'level')))
        ->toEqualCanonicalizing(['sounds', 'letters', 'syllables', 'words', 'complex-sounds', 'sentences']);

    $a = $this->getJson('/api/lessons/l-son-a')->json();
    expect($a['objective'])->toBe('Reconnaître, entendre, associer et tracer le son /a/.');
    expect($a['exercises'][0]['params'])
        ->toBe(['phoneme' => 'a', 'cue' => 'a, comme dans avion', 'itemIds' => ['g-a', 'g-o']]);

    $bd = $this->getJson('/api/lessons/l-bd-1');
    $bd->assertOk();
    expect($bd->json('exercises'))->toHaveCount(5);
    expect($bd->json('exercises.0.params'))
        ->toBe(['phoneme' => 'b', 'cue' => 'b, comme ballon', 'itemIds' => ['g-b', 'g-d']]);

    $phrase = $this->getJson('/api/lessons/l-phrase-1')->json('exercises');
    expect($phrase)->toHaveCount(3);
    expect(array_column($phrase[0]['items'], 'type'))->toBe(['sentence', 'sentence', 'sentence']);
});

it('rattache les textes de lecture aux nouveaux nœuds et retire les anciens nœuds', function () {
    // État d'une base seedée par une version précédente.
    DB::table('skill_nodes')->insert(['id' => 'n-letters-a', 'level' => 'letters', 'title' => 'Les voyelles', 'order' => 99, 'unlocked_when' => 0]);
    DB::table('lessons')->insert(['id' => 'text-old', 'node_id' => 'n-letters-a', 'title' => 'Texte', 'kind' => 'lecture', 'duration_min' => 1, 'order' => 1]);
    DB::table('lessons')->insert(['id' => 'l-vowels-1', 'node_id' => 'n-letters-a', 'title' => 'Écouter les voyelles', 'duration_min' => 6, 'order' => 1]);

    $this->seed(PedagogySeeder::class);

    expect(DB::table('skill_nodes')->where('id', 'n-letters-a')->exists())->toBeFalse();
    expect(DB::table('lessons')->where('id', 'text-old')->value('node_id'))->toBe('n-mot-maman');
    expect(DB::table('lessons')->where('id', 'l-vowels-1')->exists())->toBeFalse();
});
