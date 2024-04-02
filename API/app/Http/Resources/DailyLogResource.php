<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DailyLogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'sawmill' => new SawmillResource($this->sawmill),
            'products' => ProductResource::collection($this->products),
            'materials' => MaterialResource::collection($this->materials),
            'wastes' => WasteResource::collection($this->wastes),
            'locked_at' => $this->locked_at,
        ];
    }
}
