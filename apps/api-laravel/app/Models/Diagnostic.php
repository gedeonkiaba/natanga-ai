<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Résultat d'un diagnostic adaptatif A→E (table P1, `docs/23` §3.1).
 * Rejouable et consultable par le parent (M5).
 */
class Diagnostic extends Model
{
    /** La table n'a que `created_at` (pas de `updated_at`). */
    const UPDATED_AT = null;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'child_id', 'level_result', 'score', 'speed_wpm',
        'error_count', 'hesitation_count', 'created_at',
    ];

    protected $casts = [
        'score' => 'float',
        'speed_wpm' => 'float',
        'error_count' => 'integer',
        'hesitation_count' => 'integer',
        'created_at' => 'datetime',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }
}
