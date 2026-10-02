<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Tentative de réponse. `error_kind` est une **métrique d'apprentissage**
 * (ex. confusion b/d), jamais un diagnostic médical (contrainte cahier des charges).
 */
class Attempt extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'child_id', 'exercise_id', 'item_id', 'is_correct', 'error_kind'];

    protected $casts = ['is_correct' => 'boolean'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }

    public function exercise(): BelongsTo
    {
        return $this->belongsTo(Exercise::class, 'exercise_id');
    }
}
