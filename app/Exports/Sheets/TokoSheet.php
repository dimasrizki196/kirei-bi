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

class TokoSheet implements FromCollection, WithTitle, WithHeadings, WithMapping, WithStyles, WithColumnWidths
{
    public function title(): string
    {
        return 'ID Cabang Toko';
    }

    public function headings(): array
    {
        return [
            'ID TOKO (Ketik ini di Tab 1)',
            'NAMA CABANG',
            'KOTA',
            'ALAMAT LENGKAP'
        ];
    }

    public function collection()
    {
        // PERBAIKAN: Menambahkan 'nama_toko' ke dalam select
        // Catatan: Pastikan nama tabelnya 'tokos' atau 'toko' sesuai dengan di database kamu
        $tokos = DB::table('tokos')->select('toko_id', 'kota', 'alamat')->get();
        return new Collection($tokos);
    }

    // -------------------------------------------------------------
    // FITUR MAPPING: Menjamin data masuk ke kolom yang tepat
    // -------------------------------------------------------------
    public function map($toko): array
    {
        return [
            $toko->toko_id,
            $toko->kota,
            $toko->alamat,
        ];
    }

    // -------------------------------------------------------------
    // FITUR STYLING UI: Mengatur Lebar Kolom agar luas dan rapi
    // -------------------------------------------------------------
    public function columnWidths(): array
    {
        return [
            'A' => 30, // Lebar kolom ID TOKO
            'C' => 20, // Lebar kolom KOTA
            'D' => 45, // Lebar kolom ALAMAT LENGKAP
        ];
    }

    // -------------------------------------------------------------
    // FITUR STYLING UI: Mengatur Warna Background dan Huruf Tebal
    // -------------------------------------------------------------
    public function styles(Worksheet $sheet)
    {
        return [
            // Baris 1 (Header Kolom): Dibuat Bold, Teks Putih, Background Emerald/Hijau
            1 => [
                'font' => ['bold' => true, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'color' => ['argb' => 'FF10B981'] // Warna hijau Emerald agar beda dengan Tab 1 dan 3
                ]
            ],
        ];
    }
}
