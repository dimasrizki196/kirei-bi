import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            // TAMBAHKAN PALET WARNA GLOBAL DI SINI
            colors: {
                kirei: {
                    light: '#e0f2fe',   // Biru sangat muda (untuk background halus)
                    DEFAULT: '#0ea5e9', // Biru profesional (Warna tombol/aksi utama)
                    dark: '#0369a1',    // Biru gelap (untuk teks heading atau hover)
                    accent: '#f472b6',  // Pink lembut (Aksen khas toko bayi)
                }
            }
        },
    },

    plugins: [forms],
};