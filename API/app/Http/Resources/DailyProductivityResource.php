<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyProductivityResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'date' => $this->date,
            'material_quantity' => $this->material_quantity,
            'waste_quantity' => $this->waste_quantity,
            'product_quantity' => $this->product_quantity,
        ];
    }
}
