<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Barang;

class Pemasok extends Model
{
    protected $table = 'pemasoks';
    protected $primaryKey = 'pemasok_id';

    protected $fillable = [
        'type_pemasok'
    ];

    // Relasi: Satu pemasok bisa menyuplai banyak barang
    public function barangs(): HasMany
    {
        return $this->hasMany(Barang::class, 'pemasok_id', 'pemasok_id');
    }
}
