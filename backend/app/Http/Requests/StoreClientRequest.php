<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
    public function rules(): array {
        return [
            'name' => ['required', 'string'],
            'url' => ['required', 'string', 'unique:client'],
            'token' => ['required', 'string'],
            'field_link_applyment' => ['required', 'string'],
            'status' => ['required', 'boolean'],
            'created_by' => ['required', 'string', 'exists:user,id'],
            'updated_by' => ['required', 'string', 'exists:user,id'],
        ];
    }
}
