import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    // State untuk mengontrol visibilitas password
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in | Kirei Shop BI" />

            {/* Header Branding responsif (ukuran teks menyesuaikan layar) */}
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-kirei-dark">
                    Kirei Shop <span className="text-kirei-DEFAULT">BI</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Sistem Analitik & Manajemen Inventori 
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                {/* Field Email */}
                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Email"
                        className="text-kirei-dark font-semibold text-sm sm:text-base"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1.5 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-kirei-DEFAULT focus:ring focus:ring-kirei-DEFAULT/20 transition-colors duration-200"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Masukkan email Anda"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Field Password dengan Fitur Toggle Mata */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-kirei-dark font-semibold text-sm sm:text-base"
                    />

                    <div className="relative mt-1.5">
                        <TextInput
                            id="password"
                            // Ubah tipe input berdasarkan state showPassword
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            // Tambahkan pr-12 (padding-right) agar teks tidak tertutup ikon
                            className="block w-full pl-4 pr-12 py-3 rounded-xl border-gray-300 shadow-sm focus:border-kirei-DEFAULT focus:ring focus:ring-kirei-DEFAULT/20 transition-colors duration-200"
                            autoComplete="current-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="••••••••"
                        />

                        {/* Tombol Ikon Mata */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-kirei-DEFAULT focus:outline-none transition-colors duration-200"
                        >
                            {showPassword ? (
                                // Ikon Mata Terbuka (Sembunyikan)
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                                    />
                                </svg>
                            ) : (
                                // Ikon Mata Tertutup (Tampilkan)
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-5 h-5 sm:w-6 sm:h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                {/* Ingat Saya & Lupa Password - Disesuaikan agar rapi di HP */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
                    <label className="flex items-center cursor-pointer">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                            className="text-kirei-DEFAULT focus:ring-kirei-DEFAULT w-5 h-5 rounded border-gray-300"
                        />
                        <span className="ms-2 text-sm text-gray-600 select-none">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm text-kirei-DEFAULT hover:text-kirei-dark underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-kirei-DEFAULT rounded-md transition-colors"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                {/* Tombol Submit dibuat lebar penuh (w-full) agar modern dan mudah diklik di HP */}
                <div className="mt-6 pt-2">
                    <PrimaryButton
                        className="w-full justify-center py-3 text-base bg-kirei-DEFAULT hover:bg-kirei-dark focus:bg-kirei-dark active:bg-kirei-dark rounded-xl shadow-lg shadow-kirei-DEFAULT/30 transition-all duration-300 hover:-translate-y-0.5"
                        disabled={processing}
                    >
                        Masuk ke Dashboard
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
