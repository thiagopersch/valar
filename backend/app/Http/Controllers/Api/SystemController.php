<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSystemRequest;
use App\Http\Requests\UpdateSystemRequest;
use App\Http\Resources\SystemResource;
use App\Models\System;
use Illuminate\Http\JsonResponse;

class SystemController extends Controller
{
    protected array $relations = ['coligate', 'client', 'createdBy', 'updatedBy'];

    public function index(): JsonResponse {
        $systems = System::with($this->relations)->get();

        return ApiResponseAdapter::success(
            SystemResource::collection($systems),
            'Sistemas listados com sucesso'
        );
    }

    public function store(StoreSystemRequest $request): JsonResponse {
        $system = System::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        $system->load($this->relations);

        return ApiResponseAdapter::created(new SystemResource($system));
    }

    public function show(System $system): JsonResponse {
        $system->load($this->relations);

        return ApiResponseAdapter::success(new SystemResource($system));
    }

    public function update(UpdateSystemRequest $request, System $system): JsonResponse {
        $system->update([
            ...$request->validated(),
            'updated_by' => auth()->id(),
        ]);

        $system->load($this->relations);

        return ApiResponseAdapter::success(
            new SystemResource($system),
            'Sistema atualizado com sucesso'
        );
    }

    public function destroy(System $system): JsonResponse {
        $system->delete();

        return ApiResponseAdapter::noContent();
    }
}
