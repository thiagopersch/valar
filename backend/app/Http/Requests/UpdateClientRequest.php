<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateClientRequest extends FormRequest
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
            'name' => ['sometimes', 'string'],
            'url' => ['sometimes', 'string', 'unique:client,url,' . $this->client->id],
            'token' => ['sometimes', 'string'],
            'field_link_applyment' => ['sometimes', 'string'],
            'status' => ['sometimes', 'boolean'],
            'created_by' => ['sometimes', 'string', 'exists:user,id'],
            'updated_by' => ['sometimes', 'string', 'exists:user,id'],
        ];
    }
}
