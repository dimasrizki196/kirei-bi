<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Pemasok;
use App\Models\FactSale;

class Barang extends Model
{
    protected $table = 'barangs';
    protected $primaryKey = 'barang_id';

    protected $fillable = [
        'nama_barang',
        'type',
        'pemasok_id',
        'harga',
        'stok_saat_ini',
        'batas_minimum_stok'
    ];

    // Relasi: Barang dimiliki oleh satu Pemasok
    public function pemasok(): BelongsTo
    {
        return $this->belongsTo(Pemasok::class, 'pemasok_id', 'pemasok_id');
    }

    // Relasi: Barang bisa tercatat di banyak transaksi di tabel fakta
    public function sales(): HasMany
    {
        return $this->hasMany(FactSale::class, 'barang_id', 'barang_id');
    }
}
