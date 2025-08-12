<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfileRequest extends FormRequest
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
            'coligate_id' => ['required', 'string', 'exists:coligate,id'],
            'client_id' => ['required', 'string', 'exists:client,id'],
            'user_id' => ['required', 'string', 'exists:user,id'],
            'name' => ['required', 'string'],
            'description' => ['required', 'string'],
            'status' => ['required', 'boolean'],
            'created_by' => ['required', 'string', 'exists:user,id'],
            'updated_by' => ['required', 'string', 'exists:user,id'],
        ];
    }
}
