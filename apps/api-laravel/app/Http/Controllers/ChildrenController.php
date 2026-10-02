<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Child;
use App\Services\ChildrenService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Children', description: 'Gestion des profils enfants')]
class ChildrenController extends Controller
{
    public function __construct(private readonly ChildrenService $children) {}

    #[OA\Post(
        path: '/api/children',
        summary: 'Créer un profil enfant',
        tags: ['Children'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['displayName', 'birthYear'],
                properties: [
                    new OA\Property(property: 'displayName', type: 'string', example: 'Léa'),
                    new OA\Property(property: 'birthYear', type: 'integer', example: 2018),
                ]
            )
        ),
        security: [['bearerAuth' => []]],
        responses: [
            new OA\Response(response: 201, description: 'Profil créé (INACTIVE)'),
            new OA\Response(response: 422, description: 'Âge hors périmètre (ERR_AGE) ou parent non vérifié (ERR_PARENT)'),
        ]
    )]
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'displayName' => ['required', 'string'],
            'birthYear' => ['required', 'integer', 'min:1990', 'max:2030'],
        ]);

        $child = $this->children->create(
            (string) $request->user()->id,
            $data['displayName'],
            (int) $data['birthYear'],
        );

        return response()->json([
            'id' => $child->id,
            'userId' => $child->user_id,
            'displayName' => $child->display_name,
            'birthYear' => $child->birth_year,
            'avatar' => $child->avatar,
            'ageBand' => $child->age_band,
            'status' => $child->status,
        ], 201);
    }

    #[OA\Get(
        path: '/api/children',
        summary: 'Lister les profils enfants',
        tags: ['Children'],
        security: [['bearerAuth' => []]],
        responses: [new OA\Response(response: 200, description: 'Liste des enfants')]
    )]
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            Child::where('user_id', $request->user()->id)->get()
        );
    }

    public function show(Request $request): JsonResponse
    {
        // Enfant résolu et autorisé par le middleware `child.owner`.
        return response()->json($request->attributes->get('child'));
    }
}
