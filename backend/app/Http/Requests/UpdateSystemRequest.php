<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSystemRequest extends FormRequest
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
            'coligate_id' => ['sometimes', 'string', 'exists:coligate,id'],
            'client_id' => ['sometimes', 'string', 'exists:client,id'],
            'code' => ['sometimes', 'string'],
            'name' => ['sometimes', 'string'],
            'fantasy_name' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],
            'token' => ['sometimes', 'string'],
            'created_by' => ['sometimes', 'string', 'exists:user,id'],
            'updated_by' => ['sometimes', 'string', 'exists:user,id'],
        ];
    }
}
