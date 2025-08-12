<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreSystemRequest;
use App\Http\Requests\UpdateSystemRequest;
use App\Http\Resources\SystemResource;
use App\Models\System;

class SystemController extends Controller
{
    public function index() {
        return SystemResource::collection(System::all());
    }

    public function store(StoreSystemRequest $request) {
        $system = System::create($request->validated());

        return new SystemResource($system);
    }

    public function show(System $system) {
        return new SystemResource($system);
    }

    public function update(UpdateSystemRequest $request, System $system) {
        $system->update($request->validated());

        return new SystemResource($system);
    }

    public function destroy(System $system) {
        $system->delete();

        return response(null, 204);
    }
}
