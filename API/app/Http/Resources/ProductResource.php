<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->photo !== null) {
            $photoUrl = asset('photos/' . $this->photo);
        } else {
            $photoUrl = null;
        }

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'unit_of_measure' => $this->unit_of_measure,
            'price' => $this->price,
            'photo' => $photoUrl,
        ];

        if ($this->pivot && isset($this->pivot->quantity)) {
            $data['quantity'] = $this->pivot->quantity;
        }

        if ($this->total_sold) {
            $data['total_sold'] = $this->total_sold;
        }

        return $data;
    }
}
