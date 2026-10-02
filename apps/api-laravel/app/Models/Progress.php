<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Progression d'un enfant sur un nœud : locked / in_progress / mastered.
 * Invariant bienveillant : la maîtrise acquise n'est jamais retirée.
 */
class Progress extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'child_id', 'node_id', 'status', 'mastered_score'];

    protected $casts = ['mastered_score' => 'float'];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }

    public function node(): BelongsTo
    {
        return $this->belongsTo(SkillNode::class, 'node_id');
    }
}
