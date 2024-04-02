<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Base64Image;

class ProductStoreRequest extends FormRequest
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
            'name' => 'required|string|max:30',
            'description' => 'nullable|string|max:100',
            'price' => 'required|numeric',
            'unit_of_measure' => 'required|string|in:m3',
            'photo' => ['nullable', new Base64Image],
            'vat' => 'required|numeric',
        ];
    }
}
