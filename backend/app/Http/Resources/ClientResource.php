<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'contact_name' => $this->contact_name,
            'url' => $this->url,
            'token' => $this->token,
            'field_link_applyment' => $this->field_link_applyment,
            'status' => $this->status,
            'logo' => $this->logo ? asset('storage/' . $this->logo) : null,
            'favicon' => $this->favicon ? asset('storage/' . $this->favicon) : null,
            'background' => $this->background ? asset('storage/' . $this->background) : null,
            'color_primary' => $this->color_primary,
            'contract_start_date' => $this->contract_start_date,
            'contract_end_date' => $this->contract_end_date,
            'foundation_date' => $this->foundation_date,
            'old_contractual_level' => $this->old_contractual_level,
            'contractual_level' => $this->contractual_level,
            'potential_level' => $this->potential_level,
            'demand_level' => $this->demand_level,
            'priority_level' => $this->priority_level,
            'commercial_user' => new UserResource($this->whenLoaded('commercialUser')),
            'has_dedicated_customer_success' => $this->has_dedicated_customer_success,
            'customer_success_user' => new UserResource($this->whenLoaded('customerSuccessUser')),
            'project_manager_user' => new UserResource($this->whenLoaded('projectManagerUser')),
            'relationship_manager_user' => new UserResource($this->whenLoaded('relationshipManagerUser')),
            'has_dedicated_analyst' => $this->has_dedicated_analyst,
            'dedicated_analyst_user' => new UserResource($this->whenLoaded('dedicatedAnalystUser')),
            'analyst_type' => $this->analyst_type,
            'implementation_type' => $this->implementation_type,
            'general_observations' => $this->general_observations,
            'health_score' => $this->health_score,
            'systems' => SystemResource::collection($this->whenLoaded('contractedSystems')),
            'service_activities' => $this->whenLoaded('serviceActivities'),
            'created_at' => $this->created_at,
            'created_by' => new UserResource($this->whenLoaded('createdBy')),
            'updated_at' => $this->updated_at,
            'updated_by' => new UserResource($this->whenLoaded('updatedBy')),
            'deleted_at' => $this->deleted_at,
        ];
    }
}
