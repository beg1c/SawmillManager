<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Inventory extends Model
{
    use HasFactory;

    public function sawmill()
    {
        return $this->belongsTo(Sawmill::class);
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class);
    }

    public function wastes()
    {
        return $this->belongsToMany(Waste::class);
    }
}
