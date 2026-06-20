<?php

namespace App\Exports\Sheets;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Illuminate\Support\Facades\DB;

class BarangSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    public function title(): string
    {
        return 'ID Produk Barang';
    }

    public function headings(): array
    {
        return [
            'ID BARANG (Ketik ini di Tab 1)',
            'NAMA PRODUK',
            'TYPE',
            'SISA STOK SAAT INI',
            'HARGA JUAL'
        ];
    }

    public function collection()
    {
        // Pastikan kolom 'type' memang sudah kamu buat di tabel database ya!
        return DB::table('barangs')->select('barang_id', 'nama_barang', 'type', 'stok_saat_ini', 'harga')->get();
    }

    // -------------------------------------------------------------
    // FITUR MAPPING: Menjamin urutan data masuk ke kolom yang benar
    // -------------------------------------------------------------
    public function map($barang): array
    {
        return [
            $barang->barang_id,
            $barang->nama_barang,
            $barang->type ?? '-', // Jika type kosong/null, tampilkan garis strip '-'
            $barang->stok_saat_ini,
            // Format angka menjadi Rupiah (Misal: 250000 menjadi Rp 250.000)
            $barang->harga ? 'Rp ' . number_format($barang->harga, 0, ',', '.') : 'Rp 0',
        ];
    }

    // -------------------------------------------------------------
    // FITUR STYLING UI: Mengatur Lebar Kolom agar tidak berantakan
    // -------------------------------------------------------------
    public function columnWidths(): array
    {
        return [
            'A' => 35, // Lebar kolom ID BARANG
            'B' => 30, // Lebar kolom NAMA PRODUK
            'C' => 15, // Lebar kolom TYPE
            'D' => 25, // Lebar kolom STOK
            'E' => 20, // Lebar kolom HARGA JUAL
        ];
    }

    // -------------------------------------------------------------
    // FITUR STYLING UI: Mengatur Warna Background dan Huruf Tebal
    // -------------------------------------------------------------
    public function styles(Worksheet $sheet)
    {
        return [
            // Baris 1 (Header Kolom): Dibuat Bold, Teks Putih, Background Amber/Orange
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['argb' => 'FFF59E0B'] // Warna Amber-500 agar beda dengan Tab 1
                ]
            ],
        ];
    }
}
