<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColigateRequest;
use App\Http\Requests\UpdateColigateRequest;
use App\Http\Resources\ColigateResource;
use App\Models\Coligate;
use Illuminate\Http\Request;

class ColigateController extends Controller
{
    public function index() {
        return ColigateResource::collection(Coligate::all());
    }

    public function store(StoreColigateRequest $request) {
        $coligate = Coligate::create($request->validated());

        return new ColigateResource($coligate);
    }

    public function show(Coligate $coligate) {
        return new ColigateResource($coligate);
    }

    public function update(UpdateColigateRequest $request, Coligate $coligate) {
        $coligate->update($request->validated());

        return new ColigateResource($coligate);
    }

    public function destroy(Coligate $coligate) {
        $coligate->delete();

        return response(null, 204);
    }
}
