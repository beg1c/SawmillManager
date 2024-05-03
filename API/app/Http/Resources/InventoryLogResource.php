<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryLogResource extends JsonResource
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
            'context' => $this->context,
            'action' => $this->action,
            'quantity' => $this->quantity,
            'timestamp' => $this->created_at,
        ];

        if ($this->user) {
            $data['user'] = $this->user->name;
        }

        if ($this->dailylog) {
            $data['dailylog'] = $this->dailylog->date;
        }

        if ($this->order) {
            $data['order'] = $this->order->id;
        }

        if ($this->product) {
            $data['product'] = $this->product->name;
        }

        if ($this->material) {
            $data['material'] = $this->material->name;
        }

        if ($this->waste) {
            $data['waste'] = $this->waste->name;
        }

        return $data;
    }
}
