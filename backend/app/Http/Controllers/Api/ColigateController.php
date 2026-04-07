<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreColigateRequest;
use App\Http\Requests\UpdateColigateRequest;
use App\Http\Resources\ColigateResource;
use App\Models\Coligate;
use Illuminate\Http\JsonResponse;

class ColigateController extends Controller
{
    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            ColigateResource::collection(Coligate::all()),
            'Coligadas listadas com sucesso'
        );
    }

    public function store(StoreColigateRequest $request): JsonResponse {
        $coligate = Coligate::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::created(new ColigateResource($coligate));
    }

    public function show(Coligate $coligate): JsonResponse {
        return ApiResponseAdapter::success(new ColigateResource($coligate));
    }

    public function update(UpdateColigateRequest $request, Coligate $coligate): JsonResponse {
        $coligate->update([
            ...$request->validated(),
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::success(
            new ColigateResource($coligate),
            'Coligada atualizada com sucesso'
        );
    }

    public function destroy(Coligate $coligate): JsonResponse {
        $coligate->delete();

        return ApiResponseAdapter::noContent();
    }
}
