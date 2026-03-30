<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceActivity;
use Illuminate\Http\Request;

class ServiceActivityController extends Controller
{
    public function index() {
        return response()->json(['data' => ServiceActivity::all()]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'status' => 'required|boolean',
            'created_by' => 'nullable|uuid|exists:users,id',
            'updated_by' => 'nullable|uuid|exists:users,id',
        ]);

        $activity = ServiceActivity::create($data);
        return response()->json(['data' => $activity], 201);
    }

    public function show(ServiceActivity $serviceActivity) {
        return response()->json(['data' => $serviceActivity]);
    }

    public function update(Request $request, ServiceActivity $serviceActivity) {
        $data = $request->validate([
            'name' => 'sometimes|required|string',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|boolean',
            'updated_by' => 'nullable|uuid|exists:users,id',
        ]);

        $serviceActivity->update($data);
        return response()->json(['data' => $serviceActivity]);
    }

    public function destroy(ServiceActivity $serviceActivity) {
        $serviceActivity->delete();
        return response()->noContent();
    }
}
