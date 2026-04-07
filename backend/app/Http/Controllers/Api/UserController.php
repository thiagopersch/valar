<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    protected array $relations = ['coligate', 'client', 'createdBy', 'updatedBy'];

    public function index(Request $request): JsonResponse {
        $perPage = (int) $request->get('per_page', 25);
        $page    = (int) $request->get('page', 1);

        $paginator = User::with($this->relations)
            ->orderBy('status', 'desc')
            ->orderBy('name', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        return ApiResponseAdapter::paginated(
            UserResource::collection($paginator),
            $paginator,
            'Usuários listados com sucesso'
        );
    }

    public function store(StoreUserRequest $request): JsonResponse {
        $user = User::create($request->validated());
        $user->load($this->relations);

        return ApiResponseAdapter::created(new UserResource($user));
    }

    public function show(User $user): JsonResponse {
        $user->load($this->relations);

        return ApiResponseAdapter::success(new UserResource($user));
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse {
        $user->update($request->validated());
        $user->load($this->relations);

        return ApiResponseAdapter::success(
            new UserResource($user),
            'Usuário atualizado com sucesso'
        );
    }

    public function destroy(User $user): JsonResponse {
        $user->delete();

        return ApiResponseAdapter::noContent();
    }
}
