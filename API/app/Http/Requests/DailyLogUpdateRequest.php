<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class DailyLogUpdateRequest extends FormRequest
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
            'date' => 'date',
            'sawmill.id' => 'integer|exists:sawmills,id',
            'products' => 'array',
            'products.*.id' => 'exists:products,id',
            'products.*.quantity' => 'numeric|min:0',
            'materials' => 'array',
            'materials.*.id' => 'exists:materials,id',
            'materials.*.quantity' => 'numeric|min:0',
            'wastes' => 'array',
            'wastes.*.id' => 'exists:wastes,id',
            'wastes.*.quantity' => 'numeric|min:0',
            'locked_at' => 'nullable|date',
        ];
    }
}
