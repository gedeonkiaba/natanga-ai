<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Événement produit privacy-first (aide demandée, blocage > 3 s, onboarding...).
 * Métriques d'usage uniquement — jamais de donnée de santé (contrainte éthique).
 */
class ChildEvent extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'child_id', 'name', 'props'];

    protected $casts = ['props' => 'array'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }
}
