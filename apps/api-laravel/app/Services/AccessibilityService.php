<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use Illuminate\Support\Facades\Validator;

/**
 * Réglages d'accessibilité (Module 2 LexiKids, MVP0).
 * Chaque enfant bénéficie de valeurs par défaut bienveillantes ; le parent
 * peut ensuite ajuster la vitesse de la voix, la coloration syllabique,
 * la police et l'échelle de lecture — jamais en dehors des plages prévues.
 */
class AccessibilityService
{
    /** Réglages par défaut proposés quand l'enfant n'a encore rien choisi. */
    public const DEFAULTS = [
        'voiceSpeed' => 1.0,
        'syllableColoring' => true,
        'fontFamily' => 'system',
        'fontScale' => 1.0,
    ];

    /** Validation stricte : seules ces clés sont acceptées, dans ces plages. */
    private const RULES = [
        'voiceSpeed' => ['sometimes', 'numeric', 'min:0.5', 'max:1.5'],
        'syllableColoring' => ['sometimes', 'boolean'],
        'fontFamily' => ['sometimes', 'string', 'in:system,dyslexic,lexend'],
        'fontScale' => ['sometimes', 'numeric', 'min:0.8', 'max:2.0'],
    ];

    /**
     * Réglages effectifs de l'enfant (défauts si `accessibility` est vide).
     *
     * @return array<string, mixed>
     */
    public function show(Child $child): array
    {
        $stored = array_intersect_key((array) ($child->accessibility ?? []), self::DEFAULTS);

        return array_merge(self::DEFAULTS, $stored);
    }

    /**
     * Valide, fusionne avec les réglages existants puis persiste.
     *
     * @param  array<string, mixed>  $settings
     *
     * @throws DomainException ACCESSIBILITY_INVALID_SETTING (422) si un réglage est hors plage.
     */
    public function update(Child $child, array $settings): Child
    {
        $this->assertValid($settings);

        $child->accessibility = array_merge($this->show($child), $this->normalize($settings));
        $child->save();

        return $child;
    }

    /**
     * Validation stricte : plage de valeurs ET aucune clé inconnue.
     *
     * @param  array<string, mixed>  $settings
     *
     * @throws DomainException
     */
    private function assertValid(array $settings): void
    {
        $unknown = array_diff(array_keys($settings), array_keys(self::RULES));

        if ($unknown !== [] || Validator::make($settings, self::RULES)->fails()) {
            throw new DomainException('ACCESSIBILITY_INVALID_SETTING', 'réglage d’accessibilité hors plage autorisée');
        }
    }

    /**
     * Normalise les valeurs validées pour un stockage JSON stable.
     *
     * @param  array<string, mixed>  $settings
     * @return array<string, mixed>
     */
    private function normalize(array $settings): array
    {
        $normalized = [];

        if (array_key_exists('voiceSpeed', $settings)) {
            $normalized['voiceSpeed'] = (float) $settings['voiceSpeed'];
        }
        if (array_key_exists('syllableColoring', $settings)) {
            $normalized['syllableColoring'] = (bool) $settings['syllableColoring'];
        }
        if (array_key_exists('fontFamily', $settings)) {
            $normalized['fontFamily'] = (string) $settings['fontFamily'];
        }
        if (array_key_exists('fontScale', $settings)) {
            $normalized['fontScale'] = (float) $settings['fontScale'];
        }

        return $normalized;
    }
}
