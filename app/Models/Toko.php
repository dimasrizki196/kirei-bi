<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\FactSale;

class Toko extends Model
{
    protected $table = 'tokos';
    protected $primaryKey = 'toko_id';

    protected $fillable = [
        'alamat',
        'kota'
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(FactSale::class, 'toko_id', 'toko_id');
    }
}
