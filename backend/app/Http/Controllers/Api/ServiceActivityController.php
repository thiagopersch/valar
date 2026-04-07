<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Models\ServiceActivity;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceActivityController extends Controller
{
    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            ServiceActivity::all(),
            'Atividades de serviço listadas com sucesso'
        );
    }

    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'name'        => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', 'boolean'],
        ]);

        $activity = ServiceActivity::create([
            ...$data,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::created($activity);
    }

    public function show(ServiceActivity $serviceActivity): JsonResponse {
        return ApiResponseAdapter::success($serviceActivity);
    }

    public function update(Request $request, ServiceActivity $serviceActivity): JsonResponse {
        $data = $request->validate([
            'name'        => ['sometimes', 'required', 'string'],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'required', 'boolean'],
        ]);

        $serviceActivity->update([
            ...$data,
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::success($serviceActivity, 'Atividade de serviço atualizada com sucesso');
    }

    public function destroy(ServiceActivity $serviceActivity): JsonResponse {
        $serviceActivity->delete();

        return ApiResponseAdapter::noContent();
    }
}
