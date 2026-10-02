<?php

declare(strict_types=1);

use App\Models\Lesson;
use App\Models\SkillNode;
use Database\Seeders\ReadingTextSeeder;
use Database\Seeders\TreeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(TreeSeeder::class);
    $this->seed(ReadingTextSeeder::class);
});

it('seeds the pedagogical tree with five distinct levels', function () {
    expect(SkillNode::count())->toBeGreaterThanOrEqual(5)
        ->and(SkillNode::pluck('level')->unique()->count())->toBe(5);
});

it('seeds ninety reading lessons, thirty per reading level', function () {
    expect(Lesson::where('kind', 'lecture')->count())->toBe(90);

    foreach (['1', '2', '3'] as $level) {
        expect(Lesson::where('kind', 'lecture')->where('reading_level', $level)->count())->toBe(30);
    }
});

it('spreads reading lessons across the six interests', function () {
    $interests = Lesson::where('kind', 'lecture')->pluck('interest');

    expect($interests->unique()->sort()->values()->all())
        ->toEqualCanonicalizing(['animaux', 'espace', 'contes', 'dinosaures', 'nature', 'musique']);

    $interests->groupBy(fn ($interest) => $interest)
        ->each(fn ($group) => expect($group->count())->toBe(15));
});

it('is idempotent when seeded twice', function () {
    $nodes = SkillNode::count();
    $lectures = Lesson::where('kind', 'lecture')->count();

    $this->seed(TreeSeeder::class);
    $this->seed(ReadingTextSeeder::class);

    expect(SkillNode::count())->toBe($nodes)
        ->and(Lesson::where('kind', 'lecture')->count())->toBe($lectures)
        ->toBe(90);
});
