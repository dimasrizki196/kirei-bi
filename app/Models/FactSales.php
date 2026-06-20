<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FactSale extends Model
{
    protected $table = 'fact_sales';
    // Menggunakan default 'id' karena di screenshot Tableau terdeteksi kolom 'Id'
    protected $primaryKey = 'id';

    protected $fillable = [
        'barang_id',
        'waktu_id',
        'pembeli_id',
        'toko_id',
        'jumlah_beli',
        'total_harga'
    ];

    // Hubungan Balik (BelongsTo) ke semua Tabel Dimensi
    public function barang(): BelongsTo
    {
        return $this->belongsTo(Barang::class, 'barang_id', 'barang_id');
    }

    public function waktu(): BelongsTo
    {
        return $this->belongsTo(Waktu::class, 'waktu_id', 'waktu_id');
    }

    public function pembeli(): BelongsTo
    {
        return $this->belongsTo(Pembeli::class, 'pembeli_id', 'pembeli_id');
    }

    public function toko(): BelongsTo
    {
        return $this->belongsTo(Toko::class, 'toko_id', 'toko_id');
    }
}
