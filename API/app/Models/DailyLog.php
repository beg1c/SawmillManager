<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyLog extends Model
{
    use HasFactory;

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)->withPivot(['quantity']);
    }

    public function materials(): BelongsToMany
    {
        return $this->belongsToMany(Material::class)->withPivot(['quantity']);
    }

    public function wastes(): BelongsToMany
    {
        return $this->belongsToMany(Waste::class)->withPivot(['quantity']);
    }

    public function sawmill(): BelongsTo
    {
        return $this->belongsTo(Sawmill::class);
    }

    protected $fillable = [
        'date'
    ];
}
