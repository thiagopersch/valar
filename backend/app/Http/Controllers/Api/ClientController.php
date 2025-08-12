<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index() {
        return ClientResource::collection(Client::all());
    }

    public function store(StoreClientRequest $request) {
        $client = Client::create($request->validated());

        return new ClientResource($client);
    }

    public function show(Client $client) {
        return new ClientResource($client);
    }

    public function update(UpdateClientRequest $request, Client $client) {
        $client->update($request->validated());

        return new ClientResource($client);
    }

    public function destroy(Client $client) {
        $client->delete();

        return response(null, 204);
    }
}
