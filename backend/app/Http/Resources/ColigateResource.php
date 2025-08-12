<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ColigateResource extends JsonResource
{

    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'client_id' => $this->client_id,
            'logo' => $this->logo,
            'name' => $this->name,
            'email' => $this->email,
            'cnpj' => $this->cnpj,
            'cep' => $this->cep,
            'street' => $this->street,
            'number' => $this->number,
            'complement' => $this->complement,
            'district' => $this->district,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
            'created_at' => $this->created_at,
            'created_by' => $this->created_by,
            'updated_at' => $this->updated_at,
            'updated_by' => $this->updated_by,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
