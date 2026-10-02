<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Déblocage gamification (étoile | badge | avatar), seuils 3/5/10/20 lectures.
 * UNIQUE (child_id, key) : un déblocage ne se débloque qu'une fois.
 */
class Unlock extends Model
{
    /** La table `unlocks` n'a pas de colonnes timestamps (usage de `unlocked_at`). */
    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'child_id', 'kind', 'key', 'unlocked_at'];

    protected $casts = ['unlocked_at' => 'datetime'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }
}
