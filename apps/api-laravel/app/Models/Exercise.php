<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Exercice d'une leçon. `params` (JSON) décrit le stimulus :
 *   - sound-grapheme  : { "phoneme": "a" }
 *   - word-recognition : { "correctItemId": "w-papa", "itemIds": [...] }
 */
class Exercise extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'lesson_id', 'type', 'params', 'order'];

    protected $casts = [
        'params' => 'array',
        'order' => 'integer',
    ];

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class, 'lesson_id');
    }
}
