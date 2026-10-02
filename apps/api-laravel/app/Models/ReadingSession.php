<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Session de lecture assistée (Module 2 LexiKids).
 * Mesure : durée, mots lus/corrects, complétion, étoiles gagnées (Module 4).
 */
class ReadingSession extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'child_id', 'lesson_id', 'duration_sec', 'words_read',
        'correct_words', 'completed', 'stars',
    ];

    protected $casts = [
        'duration_sec' => 'integer',
        'words_read' => 'integer',
        'correct_words' => 'integer',
        'completed' => 'boolean',
        'stars' => 'integer',
    ];

    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class, 'child_id');
    }
}
