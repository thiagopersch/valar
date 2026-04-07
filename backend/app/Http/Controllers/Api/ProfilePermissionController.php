<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProfilePermissionRequest;
use App\Http\Requests\UpdateProfilePermissionRequest;
use App\Http\Resources\ProfilePermissionResource;
use App\Models\ProfilePermission;
use Illuminate\Http\JsonResponse;

class ProfilePermissionController extends Controller
{
    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            ProfilePermissionResource::collection(ProfilePermission::all()),
            'Permissões de perfil listadas com sucesso'
        );
    }

    public function store(StoreProfilePermissionRequest $request): JsonResponse {
        $profilePermission = ProfilePermission::create($request->validated());

        return ApiResponseAdapter::created(new ProfilePermissionResource($profilePermission));
    }

    public function show(ProfilePermission $profilePermission): JsonResponse {
        return ApiResponseAdapter::success(new ProfilePermissionResource($profilePermission));
    }

    public function update(UpdateProfilePermissionRequest $request, ProfilePermission $profilePermission): JsonResponse {
        $profilePermission->update($request->validated());

        return ApiResponseAdapter::success(
            new ProfilePermissionResource($profilePermission),
            'Permissão de perfil atualizada com sucesso'
        );
    }

    public function destroy(ProfilePermission $profilePermission): JsonResponse {
        $profilePermission->delete();

        return ApiResponseAdapter::noContent();
    }
}
