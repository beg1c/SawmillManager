<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function inventories()
    {
        return $this->belongsToMany(Inventory::class)->withPivot(['quantity']);
    }

    public function orders()
    {
        return $this->belongsToMany(Order::class)->withPivot(['quantity']);
    }

    protected $fillable = [
        'name',
        'description',
        'unit_of_measure',
        'price',
        'photo',
        'vat',
    ];
}
