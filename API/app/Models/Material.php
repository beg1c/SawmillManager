<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    use HasFactory;

    public function inventory()
    {
        return $this->belongsTo(Inventory::class);
    }

    protected $fillable = [
        'name',
        'description',
        'unit_of_measure',
        'price',
    ];
}
