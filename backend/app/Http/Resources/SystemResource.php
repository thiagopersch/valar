<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SystemResource extends JsonResource
{

    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'coligate_id' => $this->coligate_id,
            'client_id' => $this->client_id,
            'code' => $this->code,
            'name' => $this->name,
            'fantasy_name' => $this->fantasy_name,
            'description' => $this->description,
            'token' => $this->token,
            'created_at' => $this->created_at,
            'created_by' => $this->created_by,
            'updated_at' => $this->updated_at,
            'updated_by' => $this->updated_by,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
