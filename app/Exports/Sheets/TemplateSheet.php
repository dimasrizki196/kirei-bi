<?php

namespace App\Exports\Sheets;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TemplateSheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    public function title(): string
    {
        return 'Data Transaksi';
    }

    public function array(): array
    {
        // Kita tidak lagi memanggil file fisik public, murni dari kodingan agar aman
        return [
            ['KIREI SHOP DASHBOARD PENJUALAN'],
            [''],
            [''],
            [''],
            ['barang_id', 'toko_id', 'tanggal_transaksi', 'alamat_pembeli', 'kota_pembeli', 'jumlah_beli', 'total_harga'],
        ];
    }

    // Fungsi untuk mengatur LEBAR KOLOM agar rapi
    public function columnWidths(): array
    {
        return [
            'A' => 12, // barang_id
            'B' => 12, // toko_id
            'C' => 18, // tanggal_transaksi
            'D' => 30, // alamat_pembeli (dibuat lebih lebar)
            'E' => 20, // kota_pembeli
            'F' => 15, // jumlah_beli
            'G' => 20, // total_harga
        ];
    }

    // Fungsi untuk mengatur WARNA dan HURUF TEBAL
    public function styles(Worksheet $sheet)
    {
        return [
            // Baris 1 (Judul): Dibuat Bold dan ukuran huruf 14
            1 => ['font' => ['bold' => true, 'size' => 14]],

            // Baris 5 (Header Kolom): Dibuat Bold, huruf putih, background biru
            5 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['argb' => 'FF0284C7'] // Kode warna biru (mirip sky-600)
                ]
            ],
        ];
    }
}
