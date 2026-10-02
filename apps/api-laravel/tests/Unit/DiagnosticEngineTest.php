<?php

declare(strict_types=1);

use App\Domain\Pedagogy\DiagnosticEngine;

it('classe un score élevé en « fluide »', function () {
    $engine = new DiagnosticEngine();
    $result = $engine->computeLevel([
        'A' => 0.9, 'B' => 0.9, 'C' => 0.9, 'D' => 0.9, 'E' => 0.9,
    ]);

    expect($result['level'])->toBe(DiagnosticEngine::FLUIDE);
    expect($result['score'])->toBeGreaterThanOrEqual(0.8);
});

it('classe un score moyen en « progression »', function () {
    $engine = new DiagnosticEngine();
    $result = $engine->computeLevel([
        'A' => 0.6, 'B' => 0.6, 'C' => 0.6, 'D' => 0.6, 'E' => 0.6,
    ]);

    expect($result['level'])->toBe(DiagnosticEngine::PROGRESSION);
});

it('classe un score faible en « découverte »', function () {
    $engine = new DiagnosticEngine();
    $result = $engine->computeLevel([
        'A' => 0.4, 'B' => 0.4, 'C' => 0.4, 'D' => 0.4, 'E' => 0.4,
    ]);

    expect($result['level'])->toBe(DiagnosticEngine::DECOUVERTE);
});

it('retourne « découverte » sans épreuve', function () {
    $engine = new DiagnosticEngine();
    $result = $engine->computeLevel([]);

    expect($result['level'])->toBe(DiagnosticEngine::DECOUVERTE);
    expect($result['score'])->toBe(0.0);
});

it('pondère davantage les épreuves D et E', function () {
    $engine = new DiagnosticEngine();

    // A, B, C parfaites mais D, E nulles → score tiré vers le bas par la pondération 1.5.
    $result = $engine->computeLevel([
        'A' => 1.0, 'B' => 1.0, 'C' => 1.0, 'D' => 0.0, 'E' => 0.0,
    ]);

    // Moyenne non pondérée = 0.6 ; pondérée (D/E×1.5) = 3.0 / 6.0 = 0.5.
    expect($result['score'])->toBe(0.5);
});

it('refuse un score hors plage', function () {
    $engine = new DiagnosticEngine();

    expect(fn () => $engine->computeLevel(['A' => 1.5]))
        ->toThrow(InvalidArgumentException::class);
    expect(fn () => $engine->computeLevel(['A' => -0.1]))
        ->toThrow(InvalidArgumentException::class);
});

it('refuse une épreuve inconnue', function () {
    $engine = new DiagnosticEngine();

    expect(fn () => $engine->computeLevel(['Z' => 0.5]))
        ->toThrow(InvalidArgumentException::class);
});

it('dérive le niveau directement depuis un score (levelFromScore)', function () {
    $engine = new DiagnosticEngine();

    expect($engine->levelFromScore(0.95))->toBe(DiagnosticEngine::FLUIDE);
    expect($engine->levelFromScore(0.8))->toBe(DiagnosticEngine::FLUIDE);
    expect($engine->levelFromScore(0.7))->toBe(DiagnosticEngine::PROGRESSION);
    expect($engine->levelFromScore(0.5))->toBe(DiagnosticEngine::PROGRESSION);
    expect($engine->levelFromScore(0.49))->toBe(DiagnosticEngine::DECOUVERTE);
});
