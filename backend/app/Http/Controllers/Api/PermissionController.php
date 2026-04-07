<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;
use Illuminate\Http\JsonResponse;

class PermissionController extends Controller
{
    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            PermissionResource::collection(Permission::all()),
            'Permissões listadas com sucesso'
        );
    }

    public function store(StorePermissionRequest $request): JsonResponse {
        $permission = Permission::create($request->validated());

        return ApiResponseAdapter::created(new PermissionResource($permission));
    }

    public function show(Permission $permission): JsonResponse {
        return ApiResponseAdapter::success(new PermissionResource($permission));
    }

    public function update(UpdatePermissionRequest $request, Permission $permission): JsonResponse {
        $permission->update($request->validated());

        return ApiResponseAdapter::success(
            new PermissionResource($permission),
            'Permissão atualizada com sucesso'
        );
    }

    public function destroy(Permission $permission): JsonResponse {
        $permission->delete();

        return ApiResponseAdapter::noContent();
    }
}
