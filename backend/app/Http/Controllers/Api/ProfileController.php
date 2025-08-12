<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;

class ProfileController extends Controller
{
    public function index() {
        return ProfileResource::collection(Profile::all());
    }

    public function store(StoreProfileRequest $request) {
        $profile = Profile::create($request->validated());

        return new ProfileResource($profile);
    }

    public function show(Profile $profile) {
        return new ProfileResource($profile);
    }

    public function update(UpdateProfileRequest $request, Profile $profile) {
        $profile->update($request->validated());

        return new ProfileResource($profile);
    }

    public function destroy(Profile $profile) {
        $profile->delete();

        return response(null, 204);
    }
}
