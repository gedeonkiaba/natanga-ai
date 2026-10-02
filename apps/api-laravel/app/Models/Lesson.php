<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Leçon (5–10 min). `kind` = exercise (séquence d'exercices) | reading (texte à lire).
 * Les colonnes `kind`/`phonemes`/`age_min`/`text` servent les 90 textes (P1, `docs/23` §3.2).
 */
class Lesson extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'node_id', 'title', 'kind', 'phonemes', 'age_min',
        'duration_min', 'text', 'order',
    ];

    protected $casts = [
        'phonemes' => 'array',
        'age_min' => 'integer',
        'duration_min' => 'integer',
        'order' => 'integer',
    ];

    public function node(): BelongsTo
    {
        return $this->belongsTo(SkillNode::class, 'node_id');
    }

    public function exercises(): HasMany
    {
        return $this->hasMany(Exercise::class, 'lesson_id')->orderBy('order');
    }
}
