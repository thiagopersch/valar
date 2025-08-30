<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'name' => ['sometimes', 'string'],
            'email' => ['sometimes', 'string', 'unique:users,email,' . ($this->user ? $this->user->id : null)],
            'password' => ['sometimes', 'string'],
            'change_password' => ['sometimes', 'boolean'],
            'status' => ['sometimes', 'boolean'],
            'created_by' => ['sometimes', 'string', 'exists:users,id'],
            'updated_by' => ['sometimes', 'string', 'exists:users,id'],
        ];
    }
}
