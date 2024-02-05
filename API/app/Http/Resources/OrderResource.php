<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'amount' => $this->amount,
            'notes' => $this->notes,
            'deadline' => $this->deadline,
            'ordered_at' => $this->ordered_at,
            'ready_at' => $this->ready_at,
            'dispatched_at' => $this->dispatched_at,
            'status' => $this->status,
            'products' => ProductResource::collection($this->products),
            'customer' => new CustomerResource($this->customer),
            'sawmill' => new SawmillResource($this->sawmill),
        ];
    }
}
