import { useState } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link } from "@inertiajs/react";
import { MessageCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPassword() {
    // 1. STATE UNTUK INPUT EMAIL & ERROR
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    // 2. NOMOR WA MANAGER
    const managerPhone = "6283898150042"; // Ganti dengan nomor asli (gunakan 62)

    // 3. FUNGSI HANDLE KLIK TOMBOL WA
    const handleWhatsAppRequest = (e) => {
        e.preventDefault();

        // Validasi jika email kosong
        if (!email.trim()) {
            setError("Silakan masukkan email akun Anda terlebih dahulu.");
            return;
        }

        // Validasi format email sederhana
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Format email tidak valid.");
            return;
        }

        setError(""); // Bersihkan error jika lolos validasi

        // Susun teks pesan WA yang menyertakan email
        const waMessage = `Halo Manager, saya lupa password akun Kirei Shop BI saya.\n\nEmail Akun: *${email}*\n\nMohon bantuannya untuk melakukan reset password akun saya. Terima kasih.`;

        // Buka tab baru ke WhatsApp
        const waLink = `https://wa.me/${managerPhone}?text=${encodeURIComponent(waMessage)}`;
        window.open(waLink, "_blank", "noopener,noreferrer");
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password | Kirei Shop" />

            <div className="text-center mb-6">
                <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 shadow-inner border border-green-100">
                    <MessageCircle size={32} className="text-green-500" />
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Lupa Password?
                </h2>

                <p className="text-sm text-gray-500 leading-relaxed mt-3 px-2">
                    Kirei Shop BI adalah sistem internal tertutup. Silakan
                    masukkan email Anda dan hubungi Manager via WhatsApp untuk
                    meminta reset password.
                </p>
            </div>

            <form
                onSubmit={handleWhatsAppRequest}
                className="flex flex-col gap-4 mt-6"
            >
                {/* Input Email */}
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Email Akun Anda
                    </label>
                    <div className="relative">
                        <Mail
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) setError(""); // Hilangkan error saat user mulai mengetik
                            }}
                            className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm focus:ring-green-500 focus:border-green-500 transition-colors ${
                                error ? "border-red-500" : "border-gray-300"
                            }`}
                            placeholder="admin@kireishop.com"
                            autoFocus
                        />
                    </div>
                    {error && (
                        <p className="mt-1.5 text-xs font-semibold text-red-500">
                            {error}
                        </p>
                    )}
                </div>

                {/* Tombol Menuju WhatsApp */}
                <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg mt-2"
                >
                    <MessageCircle size={20} />
                    Kirim Permintaan via WA
                </button>

                {/* Tombol Kembali ke Login */}
                <Link
                    href={route("login")}
                    className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors border border-gray-200 mt-2"
                >
                    <ArrowLeft size={18} />
                    Kembali ke Halaman Login
                </Link>
            </form>
        </GuestLayout>
    );
}
