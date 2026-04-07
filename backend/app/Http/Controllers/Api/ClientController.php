<?php

namespace App\Http\Controllers\Api;

use App\Adapters\ApiResponseAdapter;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    protected array $relations = [
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

    public function index(): JsonResponse {
        return ApiResponseAdapter::success(
            ClientResource::collection(Client::with($this->relations)->get()),
            'Clientes listados com sucesso'
        );
    }

    public function store(StoreClientRequest $request): JsonResponse {
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

        $data['created_by'] = auth()->id();
        $data['updated_by'] = auth()->id();

        $client = Client::create($data);

        if (isset($data['systems'])) {
            $client->contractedSystems()->sync($data['systems']);
        }
        if (isset($data['service_activities'])) {
            $client->serviceActivities()->sync($data['service_activities']);
        }

        $client->load($this->relations);

        return ApiResponseAdapter::created(new ClientResource($client));
    }

    public function show(Client $client): JsonResponse {
        $client->load($this->relations);

        return ApiResponseAdapter::success(new ClientResource($client));
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($client->logo) Storage::disk('public')->delete($client->logo);
            $data['logo'] = $request->file('logo')->store('clients/logos', 'public');
        }
        if ($request->hasFile('favicon')) {
            if ($client->favicon) Storage::disk('public')->delete($client->favicon);
            $data['favicon'] = $request->file('favicon')->store('clients/favicons', 'public');
        }
        if ($request->hasFile('background')) {
            if ($client->background) Storage::disk('public')->delete($client->background);
            $data['background'] = $request->file('background')->store('clients/backgrounds', 'public');
        }

        $data['updated_by'] = auth()->id();

        $client->update($data);

        if (array_key_exists('systems', $data)) {
            $client->contractedSystems()->sync($data['systems']);
        }
        if (array_key_exists('service_activities', $data)) {
            $client->serviceActivities()->sync($data['service_activities']);
        }

        $client->load($this->relations);

        return ApiResponseAdapter::success(
            new ClientResource($client),
            'Cliente atualizado com sucesso'
        );
    }

    public function destroy(Client $client): JsonResponse {
        if ($client->logo) Storage::disk('public')->delete($client->logo);
        if ($client->favicon) Storage::disk('public')->delete($client->favicon);
        if ($client->background) Storage::disk('public')->delete($client->background);

        $client->delete();

        return ApiResponseAdapter::noContent();
    }
}
