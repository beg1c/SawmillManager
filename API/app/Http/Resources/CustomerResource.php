<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CustomerResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
          'id' => $this->id,
          'name' => $this->name,
          'contact_number' => $this->contact_number,
          'address' => $this->address,
        ];

        if ($this->orders_sum_amount) {
            $data['total_spent'] = intval($this->orders_sum_amount);
        }

        return $data;
    }
}
