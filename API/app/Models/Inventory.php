<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Inventory extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function sawmill()
    {
        return $this->belongsTo(Sawmill::class);
    }

    public function materials()
    {
        return $this->belongsToMany(Material::class)->withPivot(['quantity']);
    }

    public function products()
    {
        return $this->belongsToMany(Product::class)->withPivot(['quantity']);
    }

    public function wastes()
    {
        return $this->belongsToMany(Waste::class)->withPivot(['quantity']);
    }

    public function logs()
    {
        return $this->hasMany(InventoryLog::class);
    }
}
