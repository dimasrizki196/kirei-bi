import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";

export default function GuestLayout({ children }) {
    return (
        // Penambahan px-4 (padding horizontal) dan py-8 (padding vertikal) agar di HP tidak menempel ke ujung layar.
        // justify-center diaktifkan secara default agar selalu di tengah.
        <div className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-kirei-light via-white to-pink-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Ornamen Latar: Ukuran diperkecil di mobile (w-48), dan membesar normal di layar sm ke atas (w-72) */}
            <div className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-kirei-DEFAULT opacity-10 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-80 sm:h-80 bg-kirei-accent opacity-10 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

            {/* Bagian Logo: Ukuran lingkaran dan logo lebih mungil di HP (h-20), membesar di layar sm (h-24) */}
            <div className="relative z-10 mb-6 sm:mb-8 text-center">
                <Link href="/" className="inline-block">
                    <div className="flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-white shadow-lg shadow-kirei-light/50 transition-transform duration-300 hover:scale-105">
                        <ApplicationLogo className="h-10 w-10 sm:h-12 sm:w-12 fill-current text-kirei-DEFAULT" />
                    </div>
                </Link>
            </div>

            {/* Kontainer Utama Form: 
                - Di HP: Lebar maksimal max-w-sm, sudut rounded-2xl, dan padding px-6 py-8.
                - Di Desktop: Lebar membesar jadi max-w-md, sudut rounded-3xl, dan padding lebih lega px-8 py-10. 
            */}
            <div className="relative z-10 w-full max-w-sm sm:max-w-md overflow-hidden bg-white/80 backdrop-blur-md px-6 py-8 sm:px-8 sm:py-10 shadow-2xl shadow-kirei-dark/5 rounded-2xl sm:rounded-3xl border border-white/60">
                {children}
            </div>
        </div>
    );
}
