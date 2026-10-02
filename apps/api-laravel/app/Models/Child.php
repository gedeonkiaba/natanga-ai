<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Child extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = [
        'id', 'user_id', 'display_name', 'birth_year', 'avatar', 'age_band', 'status',
        'interests', 'placement_level', 'accessibility',
    ];

    protected $casts = [
        'interests' => 'array',
        'accessibility' => 'array',
        'placement_level' => 'string',
    ];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function consents(): HasMany
    {
        return $this->hasMany(Consent::class, 'child_id');
    }
}
