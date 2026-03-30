<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    protected $relations = [
        'contractedSystems',
        'serviceActivities',
        'commercialUser',
        'customerSuccessUser',
        'projectManagerUser',
        'relationshipManagerUser',
        'dedicatedAnalystUser',
        'createdBy',
        'updatedBy',
    ];

    public function index() {
        return ClientResource::collection(Client::with($this->relations)->get());
    }

    public function store(StoreClientRequest $request) {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
        }
        if ($request->hasFile('favicon')) {
            $data['favicon'] = $request->file('favicon')->store('clients/favicons', 'public');
        }
        if ($request->hasFile('background')) {
            $data['background'] = $request->file('background')->store('clients/backgrounds', 'public');
        }

        $client = Client::create($data);

        if (isset($data['systems'])) {
            $client->contractedSystems()->sync($data['systems']);
        }
        if (isset($data['service_activities'])) {
            $client->serviceActivities()->sync($data['service_activities']);
        }

        $client->load($this->relations);

        return new ClientResource($client);
    }

    public function show(Client $client) {
        $client->load($this->relations);
        return new ClientResource($client);
    }

    public function update(UpdateClientRequest $request, Client $client) {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($client->logo)
                Storage::disk('public')->delete($client->logo);
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
        }
        if ($request->hasFile('favicon')) {
            if ($client->favicon)
                Storage::disk('public')->delete($client->favicon);
            $data['favicon'] = $request->file('favicon')->store('clients/favicons', 'public');
        }
        if ($request->hasFile('background')) {
            if ($client->background)
                Storage::disk('public')->delete($client->background);
            $data['background'] = $request->file('background')->store('clients/backgrounds', 'public');
        }

        $client->update($data);

        if (array_key_exists('systems', $data)) {
            $client->contractedSystems()->sync($data['systems']);
        }
        if (array_key_exists('service_activities', $data)) {
            $client->serviceActivities()->sync($data['service_activities']);
        }

        $client->load($this->relations);

        return new ClientResource($client);
    }

    public function destroy(Client $client) {
        if ($client->logo)
            Storage::disk('public')->delete($client->logo);
        if ($client->favicon)
            Storage::disk('public')->delete($client->favicon);
        if ($client->background)
            Storage::disk('public')->delete($client->background);

        $client->delete();

        return response()->noContent();
    }
}
