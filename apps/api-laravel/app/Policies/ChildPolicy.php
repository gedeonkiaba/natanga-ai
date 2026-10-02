<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\Child;
use App\Models\User;

/**
 * Autorisation sur un profil enfant : seul le parent titulaire y accède.
 * (Rôles futurs — orthophoniste/enseignant — à ajouter ici via une table de partage.)
 */
class ChildPolicy
{
    public function manage(User $user, Child $child): bool
    {
        return $child->user_id === $user->id;
    }
}
