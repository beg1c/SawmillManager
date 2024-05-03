<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class InventoryItemStoreRequest extends FormRequest
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
            'type' => 'required|in:products,materials,wastes',
            'item_id' => [
                'required',
                function ($attribute, $value, $fail) {
                    $type = request()->input('type');

                    $table = match ($type) {
                        'products' => 'products',
                        'materials' => 'materials',
                        'wastes' => 'wastes',
                        default => null,
                    };

                    if ($table === null) {
                        $fail("Item does not exist as provided type is invalid.");
                        return;
                    }

                    if (!DB::table($table)->where('id', $value)->exists()) {
                        $fail("The selected $attribute does not exist in $type.");
                    }
                },
            ],
            'quantity' => 'numeric'
        ];
    }
}
