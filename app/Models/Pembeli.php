<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\FactSale;

class Pembeli extends Model
{
    protected $table = 'pembelis';
    protected $primaryKey = 'pembeli_id';

    protected $fillable = [
        'alamat',
        'kota'
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(FactSale::class, 'pembeli_id', 'pembeli_id');
    }
}
