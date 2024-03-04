<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Material extends Model
{
    use HasFactory;

    public function inventories()
    {
        return $this->belongsToMany(Inventory::class);
    }

    protected $fillable = [
        'name',
        'description',
        'unit_of_measure',
        'price',
        'photo'
    ];
}
