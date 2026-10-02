<?php

declare(strict_types=1);

use App\Domain\Gamification\GamificationEngine;
use App\Models\Lesson;
use App\Models\ReadingSession;
use App\Models\Reward;
use App\Models\Unlock;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * MVP0 LexiKids — Module 2 (atelier de lecture assistée) + Module 4 (gamification minimale).
 *
 * Règles verrouillées :
 *   - bibliothèque filtrée sur `kind = lecture` + `reading_level`
 *     (placement de l'enfant, `?level=` explicite, défaut '1') et `interest` optionnel,
 *   - session terminée = 1 étoile, +1 si précision ≥ 80 %, sinon 0 étoile,
 *   - récompense `star` (« session terminée ») si étoiles > 0,
 *   - déblocages 3 / 5 / 10 / 20 lectures (`GamificationEngine::UNLOCKS`),
 *     annoncés uniquement au franchissement (jamais deux fois),
 *   - 404 RFC 7807 (CHILD_NOT_FOUND) sur enfant inconnu, 422 sur `level` invalide.
 */
uses(RefreshDatabase::class);

/**
 * Texte de l'atelier (`kind = lecture`).
 * `interest` / `reading_level` ne sont pas dans le fillable du modèle :
 * écriture directe après `fill()`.
 */
function makeReadingText(string $readingLevel, string $interest = 'animaux', array $overrides = []): Lesson
{
    $lesson = new Lesson(array_merge([
        'id' => (string) Str::uuid(),
        'node_id' => 'n-textes',
        'title' => 'Texte niveau '.$readingLevel,
        'kind' => 'lecture',
        'text' => 'Le petit chat niveau '.$readingLevel.' dort.',
        'age_min' => 6,
        'duration_min' => 5,
        'phonemes' => ['a', 'an'],
        'order' => 1,
    ], $overrides));

    $lesson->reading_level = $readingLevel;
    $lesson->interest = $interest;
    $lesson->save();

    return $lesson;
}

/** Corps de session validé par défaut (précision 8/10 = 80 %). */
function readingPayload(array $overrides = []): array
{
    return array_merge([
        'duration_sec' => 120,
        'words_read' => 10,
        'correct_words' => 8,
        'completed' => true,
    ], $overrides);
}

beforeEach(function () {
    // Les leçons pointent un nœud réel (FK `node_id` → `skill_nodes`).
    DB::table('skill_nodes')->insert([
        'id' => 'n-textes',
        'level' => 'texts',
        'title' => 'Textes à lire',
        'order' => 1,
        'unlocked_when' => 0,
    ]);
});

/*
|--------------------------------------------------------------------------
| Module 2 — bibliothèque de textes
|--------------------------------------------------------------------------
*/

it("filtre la bibliothèque sur le niveau de lecture de l'enfant", function () {
    $child = makeVerifiedChild(['placement_level' => '1']);

    $t1 = makeReadingText('1', 'animaux', ['order' => 1]);
    $t2 = makeReadingText('1', 'espace', ['order' => 2]);
    $t3 = makeReadingText('2', 'espace', ['order' => 3]);
    // Une leçon hors atelier (kind != lecture) n'appartient pas à la bibliothèque.
    makeReadingText('1', 'animaux', ['kind' => 'exercise', 'order' => 4]);

    $res = $this->getJson("/api/children/{$child->id}/texts");
    $res->assertOk();
    expect($res->json('level'))->toBe('1');

    $texts = $res->json('texts');
    expect($texts)->toHaveCount(2);
    expect(array_column($texts, 'id'))->toBe([$t1->id, $t2->id]);
    expect(array_column($texts, 'readingLevel'))->toBe(['1', '1']);

    $first = $texts[0];
    expect($first)->toHaveKeys([
        'id', 'title', 'text', 'readingLevel', 'interest',
        'phonemes', 'ageMin', 'durationMin', 'nodeId',
    ]);
    expect($first['id'])->toBe($t1->id)
        ->and($first['title'])->toBe('Texte niveau 1')
        ->and($first['text'])->toContain('niveau 1')
        ->and($first['interest'])->toBe('animaux')
        ->and($first['phonemes'])->toBe(['a', 'an'])
        ->and($first['ageMin'])->toBe(6)
        ->and($first['durationMin'])->toBe(5)
        ->and($first['nodeId'])->toBe('n-textes');

    // Niveau explicite + filtre de centre d'intérêt.
    $filtered = $this->getJson("/api/children/{$child->id}/texts?level=2&interest=espace");
    $filtered->assertOk();
    expect($filtered->json('level'))->toBe('2');
    expect(array_column($filtered->json('texts'), 'id'))->toBe([$t3->id]);
});

it("retourne une liste vide (200) quand aucun texte n'existe au niveau de l'enfant", function () {
    $child = makeVerifiedChild(['placement_level' => '3']);
    makeReadingText('1', 'animaux');

    $res = $this->getJson("/api/children/{$child->id}/texts");

    $res->assertOk();
    expect($res->json('level'))->toBe('3');
    expect($res->json('texts'))->toBe([]);
});

it("retombe sur le niveau '1' sans placement_level", function () {
    $child = makeVerifiedChild(); // placement_level null
    makeReadingText('1', 'contes');

    $res = $this->getJson("/api/children/{$child->id}/texts");

    $res->assertOk();
    expect($res->json('level'))->toBe('1');
    expect($res->json('texts'))->toHaveCount(1);
});

it('rejette un niveau de lecture invalide (422, RFC 7807)', function () {
    $child = makeVerifiedChild(['placement_level' => '1']);

    $res = $this->getJson("/api/children/{$child->id}/texts?level=9");

    $res->assertStatus(422);
    expect($res->json('code'))->toBe('TEXT_LIBRARY_INVALID_LEVEL')
        ->and($res->json('type'))->toBe('about:blank')
        ->and($res->json('status'))->toBe(422);
});

/*
|--------------------------------------------------------------------------
| Module 4 — étoiles, récompenses et déblocages de session
|--------------------------------------------------------------------------
*/

it('récompense une session terminée précise avec 2 étoiles et une récompense star', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/sessions", readingPayload([
        'words_read' => 10,
        'correct_words' => 9, // précision 90 %
    ]));

    $res->assertStatus(201);
    expect($res->json('session.stars'))->toBe(2)
        ->and($res->json('session.completed'))->toBeTrue()
        ->and($res->json('session.wordsRead'))->toBe(10)
        ->and($res->json('session.correctWords'))->toBe(9);
    expect($res->json('reward.kind'))->toBe('star')
        ->and($res->json('reward.amount'))->toBe(2);
    expect($res->json('unlocked'))->toBeEmpty();

    expect(ReadingSession::count())->toBe(1);
    expect(Reward::count())->toBe(1);
    expect(Reward::first()->kind)->toBe('star')
        ->and(Reward::first()->amount)->toBe(2)
        ->and(Reward::first()->reason)->toBe('session terminée');
});

it('accorde la 2ᵉ étoile dès une précision exactement égale à 80 %', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/sessions", readingPayload()); // 8/10

    $res->assertStatus(201);
    expect($res->json('session.stars'))->toBe(2)
        ->and($res->json('reward.amount'))->toBe(2);
});

it('récompense une session terminée peu précise avec 1 étoile', function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/sessions", readingPayload([
        'words_read' => 10,
        'correct_words' => 4, // précision 40 %
    ]));

    $res->assertStatus(201);
    expect($res->json('session.stars'))->toBe(1);
    expect($res->json('reward.kind'))->toBe('star')
        ->and($res->json('reward.amount'))->toBe(1);
});

it("n'attribue ni étoile ni récompense à une session non terminée", function () {
    $child = makeVerifiedChild();

    $res = $this->postJson("/api/children/{$child->id}/sessions", readingPayload([
        'completed' => false,
        'correct_words' => 10,
    ]));

    $res->assertStatus(201);
    expect($res->json('session.stars'))->toBe(0)
        ->and($res->json('session.completed'))->toBeFalse()
        ->and($res->json('reward'))->toBeNull()
        ->and($res->json('unlocked'))->toBeEmpty();

    expect(Reward::count())->toBe(0);
    expect(ReadingSession::first()->stars)->toBe(0);
});

it('annonce le déblocage à la 3ᵉ lecture puis plus jamais (seuils 3/5/10/20)', function () {
    expect(array_keys(GamificationEngine::UNLOCKS))->toBe([3, 5, 10, 20]);

    $child = makeVerifiedChild();
    $url = "/api/children/{$child->id}/sessions";

    // Une session non terminée ne compte jamais parmi les lectures.
    $incomplete = $this->postJson($url, readingPayload(['completed' => false]));
    $incomplete->assertStatus(201);
    expect($incomplete->json('unlocked'))->toBeEmpty();

    $first = $this->postJson($url, readingPayload());
    $first->assertStatus(201);
    expect($first->json('unlocked'))->toBeEmpty();

    $second = $this->postJson($url, readingPayload());
    $second->assertStatus(201);
    expect($second->json('unlocked'))->toBeEmpty(); // 2 lectures sur 3 : rien encore.

    $third = $this->postJson($url, readingPayload());
    $third->assertStatus(201);
    expect($third->json('unlocked'))->toBe([
        ['kind' => 'star', 'key' => 'star-3-lectures'],
    ]);
    expect(Unlock::where('child_id', $child->id)->count())->toBe(1);

    $fourth = $this->postJson($url, readingPayload());
    $fourth->assertStatus(201);
    expect($fourth->json('unlocked'))->toBeEmpty(); // déjà annoncé : jamais deux fois.
    expect(Unlock::where('child_id', $child->id)->count())->toBe(1);
});

it('rejette des mesures hors plage (422)', function () {
    $child = makeVerifiedChild();

    $this->postJson("/api/children/{$child->id}/sessions", readingPayload([
        'words_read' => -1,
    ]))->assertStatus(422);

    expect(ReadingSession::count())->toBe(0);
});

/*
|--------------------------------------------------------------------------
| Historique + erreurs
|--------------------------------------------------------------------------
*/

it("liste les sessions de l'enfant du plus récent au plus ancien", function () {
    $child = makeVerifiedChild();

    $firstId = $this->postJson("/api/children/{$child->id}/sessions", readingPayload())
        ->assertStatus(201)
        ->json('session.id');

    $this->travel(1)->minutes();

    $secondId = $this->postJson("/api/children/{$child->id}/sessions", readingPayload([
        'words_read' => 5,
        'correct_words' => 2,
    ]))
        ->assertStatus(201)
        ->json('session.id');

    $res = $this->getJson("/api/children/{$child->id}/sessions");
    $res->assertOk();

    $sessions = $res->json('sessions');
    expect($sessions)->toHaveCount(2);
    expect(array_column($sessions, 'id'))->toBe([$secondId, $firstId]);

    expect($sessions[0])->toHaveKeys([
        'id', 'childId', 'lessonId', 'durationSec', 'wordsRead',
        'correctWords', 'completed', 'stars', 'createdAt',
    ]);
    expect($sessions[0]['childId'])->toBe($child->id)
        ->and($sessions[0]['stars'])->toBe(1)
        ->and($sessions[1]['stars'])->toBe(2)
        ->and($sessions[0]['createdAt'])->not->toBeNull();
});

it('retourne 404 CHILD_NOT_FOUND pour un enfant inconnu (RFC 7807)', function () {
    actingAsParent();
    $unknown = '00000000-0000-0000-0000-000000000000';

    $texts = $this->getJson("/api/children/{$unknown}/texts");
    $texts->assertStatus(404);
    expect($texts->json('code'))->toBe('CHILD_NOT_FOUND')
        ->and($texts->json('type'))->toBe('about:blank');

    $index = $this->getJson("/api/children/{$unknown}/sessions");
    $index->assertStatus(404);
    expect($index->json('code'))->toBe('CHILD_NOT_FOUND');

    $store = $this->postJson("/api/children/{$unknown}/sessions", readingPayload());
    $store->assertStatus(404);
    expect($store->json('code'))->toBe('CHILD_NOT_FOUND');

    expect(ReadingSession::count())->toBe(0);
});
