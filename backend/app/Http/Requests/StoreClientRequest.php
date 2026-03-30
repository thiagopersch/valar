<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\HealthScore;
use App\Enums\ImplementationType;
use App\Enums\PriorityLevel;
use App\Enums\DemandLevel;
use App\Enums\Level;

class StoreClientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    protected function prepareForValidation(): void {
        $this->merge([
            'status' => $this->toBoolean($this->status),
            'has_dedicated_customer_success' => $this->toBoolean($this->has_dedicated_customer_success),
            'has_dedicated_analyst' => $this->toBoolean($this->has_dedicated_analyst),
        ]);
    }

    private function toBoolean($value): ?bool {
        if (is_null($value) || $value === '') {
            return null;
        }

        return filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }

    public function rules(): array {
        return [
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['nullable', 'string'],
            'contact_name' => ['nullable', 'string'],
            'url' => ['nullable', 'string'],
            'token' => ['sometimes', 'string'],
            'field_link_applyment' => ['sometimes', 'string'],
            'status' => ['nullable', 'boolean'],
            'logo' => ['nullable', 'image', 'mimes:svg,png,webp', 'max:5120'],
            'favicon' => ['nullable', 'image', 'mimes:svg,png,webp', 'max:5120'],
            'color_primary' => ['nullable', 'string'],
            'background' => ['nullable', 'image', 'mimes:svg,png,webp,jpg,jpeg', 'max:5120'],
            'contract_start_date' => ['required', 'date'],
            'contract_end_date' => ['nullable', 'date'],
            'foundation_date' => ['nullable', 'date'],
            'old_contractual_level' => ['nullable', 'integer'],
            'contractual_level' => ['required', new Enum(Level::class)],
            'potential_level' => ['required', new Enum(Level::class)],
            'demand_level' => ['required', new Enum(DemandLevel::class)],
            'priority_level' => ['required', new Enum(PriorityLevel::class)],
            'commercial_user_id' => ['required', 'uuid', 'exists:users,id'],
            'has_dedicated_customer_success' => ['nullable', 'boolean'],
            'customer_success_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'project_manager_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'relationship_manager_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'has_dedicated_analyst' => ['nullable', 'boolean'],
            'dedicated_analyst_user_id' => ['nullable', 'uuid', 'exists:users,id'],
            'analyst_type' => ['nullable', 'string'],
            'implementation_type' => ['required', new Enum(ImplementationType::class)],
            'general_observations' => ['nullable', 'string'],
            'health_score' => ['required', new Enum(HealthScore::class)],
            'systems' => ['array'],
            'systems.*' => ['uuid', 'exists:system,id'],
            'service_activities' => ['array'],
            'service_activities.*' => ['uuid', 'exists:service_activities,id'],
            'created_by' => ['nullable', 'string'],
            'updated_by' => ['nullable', 'string'],
        ];
    }
}
