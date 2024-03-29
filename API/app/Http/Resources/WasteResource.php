<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WasteResource extends JsonResource
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
            'vat' => $this->vat,
        ];

        if ($this->pivot && isset($this->pivot->quantity)) {
            $data['quantity'] = $this->pivot->quantity;
        }

        if ($this->pivot && isset($this->pivot->historic_price)) {
            $data['price'] = $this->pivot->historic_price;
        }

        if ($this->pivot && isset($this->pivot->historic_vat)) {
            $data['vat'] = $this->pivot->historic_vat;
        }

        return $data;
    }
}
