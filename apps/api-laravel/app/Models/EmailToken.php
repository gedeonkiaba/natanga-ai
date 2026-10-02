<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailToken extends Model
{
    /** La table `email_tokens` n'a pas de colonnes timestamps (mono-usage, `expires_at` suffit). */
    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $primaryKey = 'token';

    protected $fillable = ['token', 'user_id', 'expires_at'];

    protected $casts = ['expires_at' => 'datetime'];
}
