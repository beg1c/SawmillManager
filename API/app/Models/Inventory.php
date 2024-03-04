<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventory extends Model
{
    use HasFactory;

    public function sawmill()
    {
        return $this->belongsTo(Sawmill::class);
    }

    public function materials()
    {
        return $this->hasMany(InventoryMaterial::class);
    }

    public function products()
    {
        return $this->hasMany(InventoryProduct::class);
    }

    public function wastes()
    {
        return $this->hasMany(InventoryWaste::class);
    }
}
