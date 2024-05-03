<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;


class Equipment extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function sawmill(): BelongsTo
    {
        return $this->belongsTo(Sawmill::class);
    }

    protected $fillable = [
        'name',
        'type',
        'description',
        'notes',
        'production_year',
        'last_service_date',
        'last_service_working_hours',
        'photo',
        'next_service_date'
    ];
}
