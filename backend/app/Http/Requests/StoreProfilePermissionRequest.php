<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProfilePermissionRequest extends FormRequest
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
            'profile_id' => ['required', 'string', 'exists:profile,id'],
            'permission_id' => ['required', 'string', 'exists:permission,id'],
            'read' => ['required', 'boolean'],
            'write' => ['required', 'boolean'],
            'delete' => ['required', 'boolean'],
            'created_by' => ['required', 'string', 'exists:user,id'],
            'updated_by' => ['required', 'string', 'exists:user,id'],
        ];
    }
}
