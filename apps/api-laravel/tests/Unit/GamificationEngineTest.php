<?php

declare(strict_types=1);

use App\Domain\Gamification\GamificationEngine;

it('récompense la réussite par 10 gemmes', function () {
    $engine = new GamificationEngine();
    $reward = $engine->rewardForAnswer(true);

    expect($reward['kind'])->toBe(GamificationEngine::KIND_GEMS);
    expect($reward['amount'])->toBe(10);
});

it('récompense l’effort même en cas d’erreur (5 gemmes)', function () {
    $engine = new GamificationEngine();
    $reward = $engine->rewardForAnswer(false);

    expect($reward['kind'])->toBe(GamificationEngine::KIND_EFFORT);
    expect($reward['amount'])->toBe(5);
});

it('débloque l’étoile à 3 lectures', function () {
    $engine = new GamificationEngine();
    $unlocked = $engine->unlocksFor(3);

    expect($unlocked)->toHaveKey(3);
    expect($unlocked[3]['key'])->toBe('star-3-lectures');
});

it('ne débloque rien en dessous de 3 lectures', function () {
    $engine = new GamificationEngine();

    expect($engine->unlocksFor(0))->toBe([]);
    expect($engine->unlocksFor(2))->toBe([]);
});

it('débloque tous les seuils à 20 lectures', function () {
    $engine = new GamificationEngine();
    $unlocked = $engine->unlocksFor(20);

    expect($unlocked)->toHaveKeys([3, 5, 10, 20]);
    expect($unlocked[20]['key'])->toBe('badge-20-lectures');
});

it('détecte les nouveaux déblocages franchis entre deux lectures', function () {
    $engine = new GamificationEngine();

    // Passage de 4 → 5 lectures : seul le seuil 5 est « nouveau ».
    $new = $engine->newlyUnlocked(4, 5);

    expect($new)->toHaveKey(5);
    expect($new)->not->toHaveKey(3); // déjà atteint avant
});

it('adoucit le streak sans remise à zéro brutale', function () {
    $engine = new GamificationEngine();

    expect($engine->softenStreak(0, 5))->toBe(0);
    expect($engine->softenStreak(3, 1))->toBe(2);
    expect($engine->softenStreak(3, 10))->toBe(0);
});
