<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateColigateRequest extends FormRequest
{

    public function authorize(): bool {
        return true;
    }

    public function rules(): array {
        return [
            'client_id' => ['sometimes', 'string', 'exists:client,id'],
            'logo' => ['sometimes', 'string'],
            'name' => ['sometimes', 'string'],
            'email' => ['sometimes', 'string'],
            'cnpj' => ['sometimes', 'string', 'unique:coligate,cnpj,' . $this->coligate->id],
            'cep' => ['sometimes', 'string'],
            'street' => ['sometimes', 'string'],
            'number' => ['sometimes', 'string'],
            'complement' => ['sometimes', 'string'],
            'district' => ['sometimes', 'string'],
            'city' => ['sometimes', 'string'],
            'state' => ['sometimes', 'string'],
            'country' => ['sometimes', 'string'],
            'created_by' => ['sometimes', 'string', 'exists:user,id'],
            'updated_by' => ['sometimes', 'string', 'exists:user,id'],
        ];
    }
}
