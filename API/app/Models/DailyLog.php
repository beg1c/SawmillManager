<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DailyLog extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($dailyLog) {
            $dailyLog->inventoryLogs()->delete();
        });
    }

    public function inventoryLogs()
    {
        return $this->hasMany(InventoryLog::class);
    }

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
        'date',
        'locked_at',
    ];
}
