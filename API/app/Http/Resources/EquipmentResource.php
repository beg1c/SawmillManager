<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquipmentResource extends JsonResource
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
            'type' => $this->type,
            'description' =>$this->description,
            'notes' => $this->notes,
            'production_year' => $this->production_year,
            'last_service_date' => $this->last_service_date,
            'last_service_working_hours' => $this->last_service_working_hours,
            'sawmill' => new SawmillResource($this->sawmill),
            'photo' => $photoUrl
        ];

        return $data;
    }
}
