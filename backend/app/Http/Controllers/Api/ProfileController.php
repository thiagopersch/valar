<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProfileRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\ProfileResource;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            ProfileResource::collection(Profile::all()),
            'Perfis listados com sucesso'
        );
    }

    public function store(StoreProfileRequest $request): JsonResponse {
        $profile = Profile::create($request->validated());

        return ApiResponseAdapter::created(new ProfileResource($profile));
    }

    public function show(Profile $profile): JsonResponse {
        return ApiResponseAdapter::success(new ProfileResource($profile));
    }

    public function update(UpdateProfileRequest $request, Profile $profile): JsonResponse {
        $profile->update($request->validated());

        return ApiResponseAdapter::success(
            new ProfileResource($profile),
            'Perfil atualizado com sucesso'
        );
    }

    public function destroy(Profile $profile): JsonResponse {
        $profile->delete();

        return ApiResponseAdapter::noContent();
    }
}
