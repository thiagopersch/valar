<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse {
        $query = Project::query();

        if ($request->has('client_id')) {
            $query->where('client_id', $request->get('client_id'));
        }

        return ApiResponseAdapter::success(
            $query->get(),
            'Projetos listados com sucesso'
        );
    }

    public function store(Request $request): JsonResponse {
        $data = $request->validate([
            'client_id'   => ['required', 'uuid', 'exists:clients,id'],
            'name'        => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'status'      => ['required', 'string'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date'],
        ]);

        $project = Project::create([
            ...$data,
            'created_by' => auth()->id(),
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::created($project);
    }

    public function show(Project $project): JsonResponse {
        return ApiResponseAdapter::success($project);
    }

    public function update(Request $request, Project $project): JsonResponse {
        $data = $request->validate([
            'client_id'   => ['sometimes', 'required', 'uuid', 'exists:clients,id'],
            'name'        => ['sometimes', 'required', 'string'],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'required', 'string'],
            'start_date'  => ['nullable', 'date'],
            'end_date'    => ['nullable', 'date'],
        ]);

        $project->update([
            ...$data,
            'updated_by' => auth()->id(),
        ]);

        return ApiResponseAdapter::success($project, 'Projeto atualizado com sucesso');
    }

    public function destroy(Project $project): JsonResponse {
        $project->delete();

        return ApiResponseAdapter::noContent();
    }
}
