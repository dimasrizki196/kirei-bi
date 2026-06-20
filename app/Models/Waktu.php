<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\FactSale;

class Waktu extends Model
{
    protected $table = 'waktus';
    protected $primaryKey = 'waktu_id';

    protected $fillable = [
        'hari',
        'bulan',
        'tahun'
    ];

    public function sales(): HasMany
    {
        return $this->hasMany(FactSale::class, 'waktu_id', 'waktu_id');
    }
}
