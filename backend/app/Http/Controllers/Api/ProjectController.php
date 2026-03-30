<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index() {
        // Can filter by client_id if provided
        $query = Project::query();
        if (request()->has('client_id')) {
            $query->where('client_id', request('client_id'));
        }
        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'client_id' => 'required|uuid|exists:clients,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'created_by' => 'nullable|uuid|exists:users,id',
            'updated_by' => 'nullable|uuid|exists:users,id',
        ]);

        $project = Project::create($data);
        return response()->json(['data' => $project], 201);
    }

    public function show(Project $project) {
        return response()->json(['data' => $project]);
    }

    public function update(Request $request, Project $project) {
        $data = $request->validate([
            'client_id' => 'sometimes|required|uuid|exists:clients,id',
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'updated_by' => 'nullable|uuid|exists:users,id',
        ]);

        $project->update($data);
        return response()->json(['data' => $project]);
    }

    public function destroy(Project $project) {
        $project->delete();
        return response()->noContent();
    }
}
