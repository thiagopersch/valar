<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreColigateRequest extends FormRequest
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
    public function rules(): array {
        return [
            'client_id' => ['required', 'string', 'exists:client,id'],
            'logo' => ['required', 'string'],
            'name' => ['required', 'string'],
            'email' => ['required', 'string'],
            'cnpj' => ['required', 'string', 'unique:coligate'],
            'cep' => ['required', 'string'],
            'street' => ['required', 'string'],
            'number' => ['required', 'string'],
            'complement' => ['required', 'string'],
            'district' => ['required', 'string'],
            'city' => ['required', 'string'],
            'state' => ['required', 'string'],
            'country' => ['required', 'string'],
            'created_by' => ['required', 'string', 'exists:user,id'],
            'updated_by' => ['required', 'string', 'exists:user,id'],
        ];
    }
}
