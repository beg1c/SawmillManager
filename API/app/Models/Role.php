<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    protected $fillable = [
        'role_name',
    ];
}
