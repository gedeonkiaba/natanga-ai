<?php

declare(strict_types=1);

namespace App\Services;

use App\Domain\DomainException;
use App\Models\Child;
use App\Models\ChildEvent;
use Illuminate\Support\Str;

/**
 * Événements produit privacy-first (Module 5 LexiKids, MVP0).
 * Métriques d'usage uniquement : **aucun PII** (jamais de nom, prénom ou
 * texte lu dans les propriétés — seule la liste blanche est acceptée).
 */
class EventService
{
    /** Liste blanche des événements produit. */
    public const ALLOWED_EVENTS = [
        'help_requested',
        'word_blocked',
        'session_interrupted',
        'text_opened',
        'onboarding_started',
        'onboarding_completed',
        'diagnostic_started',
        'diagnostic_completed',
    ];

    /** Taille maximale des propriétés jointes, une fois encodées en JSON. */
    private const MAX_PROPS_CHARS = 2000;

    /**
     * Enregistre un événement produit et retourne la ligne persistée.
     *
     * @param  array<string, mixed>  $data  {name: string, props?: array<string, mixed>}
     *
     * @throws DomainException EVENT_INVALID_NAME (422) si le nom est hors liste blanche.
     * @throws DomainException EVENT_INVALID_PROPS (422) si les propriétés sont invalides ou trop volumineuses.
     */
    public function store(Child $child, array $data): ChildEvent
    {
        $name = $data['name'] ?? null;
        if (! is_string($name) || ! in_array($name, self::ALLOWED_EVENTS, true)) {
            throw new DomainException('EVENT_INVALID_NAME', 'nom d’événement inconnu');
        }

        $props = $this->validateProps($data['props'] ?? null);

        return ChildEvent::create([
            'id' => (string) Str::uuid(),
            'child_id' => $child->id,
            'name' => $name,
            'props' => $props,
        ]);
    }

    /**
     * Les propriétés sont facultatives : tableau ≤ 2000 caractères encodés.
     *
     * @return array<string, mixed>|null
     *
     * @throws DomainException
     */
    private function validateProps(mixed $props): ?array
    {
        if ($props === null) {
            return null;
        }

        if (! is_array($props)) {
            throw new DomainException('EVENT_INVALID_PROPS', 'propriétés d’événement invalides');
        }

        $encoded = json_encode($props, JSON_UNESCAPED_UNICODE);
        if ($encoded === false || strlen($encoded) > self::MAX_PROPS_CHARS) {
            throw new DomainException('EVENT_INVALID_PROPS', 'propriétés d’événement trop volumineuses (2000 caractères max)');
        }

        return $props;
    }
}
