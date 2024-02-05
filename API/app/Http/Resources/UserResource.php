<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        if ($this->avatar !== null) {
            $avatarUrl = asset('avatars/' . $this->avatar);
        } else {
            $avatarUrl = null;
        }

        $data = [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'contact_number' => $this->contact_number,
            'birthday' => $this->birthday,
            'role' => new RoleResource($this->role),
            'sawmills' => SawmillResource::collection($this->sawmills),
            'avatar' => $avatarUrl
        ];

        return $data;
    }
}
