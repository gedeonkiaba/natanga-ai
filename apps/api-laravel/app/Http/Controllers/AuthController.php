<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: 'Auth', description: 'Création de compte parent et vérification email')]
class AuthController extends Controller
{
    public function __construct(private readonly AuthService $auth) {}

    #[OA\Post(
        path: '/api/auth/register',
        summary: 'Créer un compte parent',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email', example: 'parent@example.com'),
                    new OA\Property(property: 'password', type: 'string', minLength: 8, example: 'secret1234'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Compte créé'),
            new OA\Response(response: 401, description: 'Email déjà utilisé (RFC 7807), code ERR_REGISTER'),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'min:8'],
        ]);

        return response()->json($this->auth->register($data['email'], $data['password']), 201);
    }

    #[OA\Post(
        path: '/api/auth/verify-email',
        summary: 'Vérifier l’email (token mono-usage)',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['token'],
                properties: [new OA\Property(property: 'token', type: 'string', example: 'uuid-token')]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Email vérifié'),
            new OA\Response(response: 401, description: 'Token invalide (RFC 7807), code ERR_TOKEN'),
        ]
    )]
    public function verifyEmail(Request $request): JsonResponse
    {
        $data = $request->validate(['token' => ['required', 'string']]);

        return response()->json($this->auth->verifyEmail($data['token']), 201);
    }

    #[OA\Post(
        path: '/api/auth/resend-verification',
        summary: 'Renvoyer le lien de vérification (réponse neutre)',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email'],
                properties: [new OA\Property(property: 'email', type: 'string', format: 'email')]
            )
        ),
        responses: [new OA\Response(response: 202, description: 'Lien renvoyé si un compte en attente existe')]
    )]
    public function resendVerification(Request $request): JsonResponse
    {
        $data = $request->validate(['email' => ['required', 'email']]);

        $this->auth->resendVerification($data['email']);

        return response()->json(['status' => 'sent-if-pending'], 202);
    }

    #[OA\Post(
        path: '/api/auth/login',
        summary: 'Connexion parent (jeton Bearer)',
        tags: ['Auth'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['email', 'password'],
                properties: [
                    new OA\Property(property: 'email', type: 'string', format: 'email'),
                    new OA\Property(property: 'password', type: 'string'),
                    new OA\Property(property: 'deviceName', type: 'string', example: 'natanga-mobile'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Jeton émis {token, tokenType, expiresInDays, userId}'),
            new OA\Response(response: 401, description: 'Identifiants invalides (ERR_LOGIN)'),
            new OA\Response(response: 403, description: 'Email non vérifié (ERR_NOT_VERIFIED)'),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'deviceName' => ['nullable', 'string', 'max:100'],
        ]);

        return response()->json(
            $this->auth->login($data['email'], $data['password'], $data['deviceName'] ?? 'default'),
        );
    }

    #[OA\Post(
        path: '/api/auth/logout',
        summary: 'Déconnexion (révoque le jeton courant)',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        responses: [new OA\Response(response: 204, description: 'Jeton révoqué')]
    )]
    public function logout(Request $request): JsonResponse
    {
        $this->auth->logout($request->user());

        return response()->json(null, 204);
    }

    #[OA\Get(
        path: '/api/auth/me',
        summary: 'Compte parent connecté',
        tags: ['Auth'],
        security: [['bearerAuth' => []]],
        responses: [new OA\Response(response: 200, description: '{userId, email, status}')]
    )]
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'userId' => $user->id,
            'email' => $user->email,
            'status' => $user->status,
        ]);
    }
}
