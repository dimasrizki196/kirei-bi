<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TransaksiImport implements ToCollection, WithHeadingRow
{
    public function headingRow(): int
    {
        return 5;
    }

    public function collection(Collection $rows)
    {
        DB::transaction(function () use ($rows) {
            $jumlahBerhasil = 0;
            $jumlahSkip = 0; // Menghitung berapa baris yang di-skip karena duplikat

            foreach ($rows as $index => $row) {
                $barisExcel = $index + 6;

                // Lewati jika baris kosong
                if (empty($row['barang_id']) && empty($row['tanggal_transaksi'])) {
                    continue;
                }

                // 1. CEK NAMA KOLOM
                $kolomToko = isset($row['toko_id']) ? 'toko_id' : (isset($row['kota_id']) ? 'kota_id' : null);

                if (!isset($row['barang_id']) || !$kolomToko || !isset($row['tanggal_transaksi'])) {
                    throw new \Exception("GAGAL: Nama kolom di Excel tidak sesuai! Pastikan ada kolom 'barang_id', 'toko_id' (atau 'kota_id'), dan 'tanggal_transaksi'.");
                }

                $barangId         = trim($row['barang_id']);
                $tokoId           = trim($row[$kolomToko]);
                $tanggalTransaksi = trim($row['tanggal_transaksi']);
                $jumlahBeli       = trim($row['jumlah_beli']);
                $totalHarga       = trim($row['total_harga']);

                $kotaPembeli      = trim($row['kota_pembeli'] ?? '');
                $alamatPembeli    = trim($row['alamat_pembeli'] ?? 'Pelanggan Umum');

                // 2. VALIDASI DIMENSI MASTER (Wajib Ada)
                $barang = DB::table('barangs')->where('barang_id', $barangId)->first();
                if (!$barang) {
                    throw new \Exception("GAGAL pada Baris {$barisExcel}: Barang ID '{$barangId}' tidak ada di database.");
                }

                $tokoExists = DB::table('tokos')->where('toko_id', $tokoId)->exists();
                if (!$tokoExists) {
                    throw new \Exception("GAGAL pada Baris {$barisExcel}: Toko/Cabang ID '{$tokoId}' tidak ada di database.");
                }

                // 3. CARI/BUAT ID WAKTU
                try {
                    if (is_numeric($tanggalTransaksi)) {
                        $dateObj = \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($tanggalTransaksi);
                        $date = Carbon::instance($dateObj);
                    } else {
                        $date = Carbon::parse($tanggalTransaksi);
                    }
                    $hari = $date->day;
                    $bulan = $date->month;
                    $tahun = $date->year;
                } catch (\Exception $e) {
                    throw new \Exception("GAGAL pada Baris {$barisExcel}: Format tanggal '{$tanggalTransaksi}' salah.");
                }

                $waktuId = DB::table('waktus')->where('hari', $hari)->where('bulan', $bulan)->where('tahun', $tahun)->value('waktu_id');
                if (!$waktuId) {
                    $waktuId = DB::table('waktus')->insertGetId([
                        'hari' => $hari,
                        'bulan' => $bulan,
                        'tahun' => $tahun,
                        'created_at' => now(),
                        'updated_at' => now()
                    ], 'waktu_id');
                }

                // 4. CARI/BUAT ID PEMBELI
                if (empty($kotaPembeli)) {
                    throw new \Exception("GAGAL pada Baris {$barisExcel}: Kota Pembeli tidak boleh kosong.");
                }

                $pembeliId = DB::table('pembelis')
                    ->whereRaw('LOWER(kota) = ?', [strtolower($kotaPembeli)])
                    ->whereRaw('LOWER(alamat) = ?', [strtolower($alamatPembeli)])
                    ->value('pembeli_id');

                if (!$pembeliId) {
                    $pembeliId = DB::table('pembelis')->insertGetId([
                        'kota' => ucwords(strtolower($kotaPembeli)),
                        'alamat' => ucwords(strtolower($alamatPembeli)),
                        'created_at' => now(),
                        'updated_at' => now()
                    ], 'pembeli_id');
                }

                // -----------------------------------------------------------
                // 5. PENENTU UTAMA: CEK DUPLIKASI DI TABEL FAKTA
                // -----------------------------------------------------------
                $isDuplicate = DB::table('fact_sales')
                    ->where('barang_id', $barangId)
                    ->where('toko_id', $tokoId)
                    ->where('waktu_id', $waktuId)
                    ->where('pembeli_id', $pembeliId)
                    ->where('jumlah_beli', $jumlahBeli)
                    ->where('total_harga', $totalHarga)
                    ->exists();

                // JIKA SAMA PERSIS DI FACT_SALES, MAKA SKIP BARIS INI SAJA!
                if ($isDuplicate) {
                    $jumlahSkip++;
                    continue;
                }

                // -----------------------------------------------------------
                // 6. SIMPAN KE TABEL FAKTA & POTONG STOK
                // -----------------------------------------------------------
                DB::table('fact_sales')->insert([
                    'barang_id'   => $barangId,
                    'pembeli_id'  => $pembeliId,
                    'toko_id'     => $tokoId,
                    'waktu_id'    => $waktuId,
                    'jumlah_beli' => $jumlahBeli,
                    'total_harga' => $totalHarga,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);

                $stokBaru = $barang->stok_saat_ini - $jumlahBeli;
                DB::table('barangs')
                    ->where('barang_id', $barangId)
                    ->update(['stok_saat_ini' => $stokBaru < 0 ? 0 : $stokBaru]);

                $jumlahBerhasil++;
            }

            // Jika semua baris di Excel ternyata duplikat (tidak ada data baru yang masuk)
            if ($jumlahBerhasil === 0 && $jumlahSkip > 0) {
                throw new \Exception("Proses selesai: Semua data di Excel tersebut sudah pernah di-import sebelumnya (di-skip). Tidak ada data baru yang dimasukkan ke fact_sales.");
            }
        });
    }
}
