<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat Akun Admin (Operasional Kasir)
        User::create([
            'name' => 'Admin',
            'email' => 'admin@kireishop.com',
            'password' => Hash::make('password123'), // Default password
            'role' => 'admin',
        ]);

        // 2. Buat Akun Manager (Business Intelligence)
        User::create([
            'name' => 'Manager',
            'email' => 'manager@kireishop.com',
            'password' => Hash::make('password123'), // Default password
            'role' => 'manager',
        ]);
    }
}
