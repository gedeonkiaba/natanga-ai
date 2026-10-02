<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Nœud de l'arbre de compétences (letters → syllables → words → sentences → texts).
 * `unlocked_when` = nombre de nœuds précédents à maîtriser pour le débloquer.
 */
class SkillNode extends Model
{
    /** La table `skill_nodes` n'a pas de colonnes timestamps. */
    public $timestamps = false;

    public $incrementing = false;

    protected $keyType = 'string';

    protected $fillable = ['id', 'level', 'title', 'order', 'unlocked_when'];

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class, 'node_id');
    }
}
