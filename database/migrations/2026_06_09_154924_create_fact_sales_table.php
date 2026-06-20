<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('fact_sales', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('barang_id');
            $table->unsignedBigInteger('waktu_id');
            $table->unsignedBigInteger('pembeli_id');
            $table->unsignedBigInteger('toko_id');

            // Kolom tambahan opsional yang biasa ada di tabel fakta penjualan
            $table->integer('jumlah_beli')->default(1);
            $table->decimal('total_harga', 15, 2)->default(0);
            $table->timestamps();

            // Deklarasi Foreign Key
            $table->foreign('barang_id')->references('barang_id')->on('barangs')->onDelete('cascade');
            $table->foreign('waktu_id')->references('waktu_id')->on('waktus')->onDelete('cascade');
            $table->foreign('pembeli_id')->references('pembeli_id')->on('pembelis')->onDelete('cascade');
            $table->foreign('toko_id')->references('toko_id')->on('tokos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fact_sales');
    }
};
