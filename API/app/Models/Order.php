<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;


class Order extends Model
{
    use HasFactory;

    public function sawmill(): BelongsTo
    {
        return $this->belongsTo(Sawmill::class);
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)->withPivot(['quantity']);
    }

    protected $fillable = [
        'amount',
        'notes',
        'deadline',
        'ordered_at',
        'ready_at',
        'dispatched_at',
        'status',
    ];

}
