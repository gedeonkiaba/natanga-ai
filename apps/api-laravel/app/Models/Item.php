<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Élément pédagogique (graphème | phonème | mot).
 * `syllables` (JSON) alimente le TTS mot/syllabe (F2.2, `docs/23` §8.3).
 */
class Item extends Model
{
    /** La table `items` n'a pas de colonnes timestamps. */
    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'type', 'label', 'phoneme', 'syllables', 'audio_url', 'metadata'];

    protected $casts = [
        'syllables' => 'array',
        'metadata' => 'array',
    ];
}
