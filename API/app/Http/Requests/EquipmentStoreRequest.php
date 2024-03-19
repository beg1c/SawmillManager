<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Base64Image;

class EquipmentStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'type' => 'required|string|max:30',
            'description' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:100',
            'production_year' => 'nullable|numeric',
            'last_service_date' => 'nullable|date',
            'last_service_working_hours' => 'nullable|numeric|max:50000',
            'sawmill.id' => 'nullable|exists:sawmills,id',
            'photo' => ['nullable', new Base64Image],
            'next_service_date' => 'nullable|date',
        ];
    }
}
