<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use App\Http\Resources\PermissionResource;
use App\Models\Permission;

class PermissionController extends Controller
{
    public function index() {
        return PermissionResource::collection(Permission::all());
    }

    public function store(StorePermissionRequest $request) {
        $permission = Permission::create($request->validated());

        return new PermissionResource($permission);
    }

    public function show(Permission $permission) {
        return new PermissionResource($permission);
    }

    public function update(UpdatePermissionRequest $request, Permission $permission) {
        $permission->update($request->validated());

        return new PermissionResource($permission);
    }

    public function destroy(Permission $permission) {
        $permission->delete();

        return response(null, 204);
    }
}
