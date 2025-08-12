<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProfilePermissionRequest;
use App\Http\Requests\UpdateProfilePermissionRequest;
use App\Http\Resources\ProfilePermissionResource;
use App\Models\ProfilePermission;

class ProfilePermissionController extends Controller
{
    public function index() {
        return ProfilePermissionResource::collection(ProfilePermission::all());
    }

    public function store(StoreProfilePermissionRequest $request) {
        $profilePermission = ProfilePermission::create($request->validated());

        return new ProfilePermissionResource($profilePermission);
    }

    public function show(ProfilePermission $profilePermission) {
        return new ProfilePermissionResource($profilePermission);
    }

    public function update(UpdateProfilePermissionRequest $request, ProfilePermission $profilePermission) {
        $profilePermission->update($request->validated());

        return new ProfilePermissionResource($profilePermission);
    }

    public function destroy(ProfilePermission $profilePermission) {
        $profilePermission->delete();

        return response(null, 204);
    }
}
