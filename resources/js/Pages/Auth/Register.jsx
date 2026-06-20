import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    // State terpisah untuk toggle masing-masing kolom password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register | Kirei Shop BI" />

            {/* Header Branding */}
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-kirei-dark">
                    Buat Akun <span className="text-kirei-DEFAULT">Baru</span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Daftarkan akses Anda ke sistem BI Kirei Shop
                </p>
            </div>

            <form onSubmit={submit} className="space-y-4 sm:space-y-5">
                {/* Field Nama */}
                <div>
                    <InputLabel
                        htmlFor="name"
                        value="Nama Lengkap"
                        className="text-kirei-dark font-semibold text-sm sm:text-base"
                    />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1.5 block w-full px-4 py-3 rounded-xl border-gray-300 shadow-sm focus:border-kirei-DEFAULT focus:ring focus:ring-kirei-DEFAULT/20 transition-colors duration-200"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData("name", e.target.value)}
                        placeholder="Masukkan nama lengkap"
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

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
                        onChange={(e) => setData("email", e.target.value)}
                        placeholder="Masukkan alamat email"
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Field Password */}
                <div>
                    <InputLabel
                        htmlFor="password"
                        value="Password"
                        className="text-kirei-dark font-semibold text-sm sm:text-base"
                    />

                    <div className="relative mt-1.5">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            className="block w-full pl-4 pr-12 py-3 rounded-xl border-gray-300 shadow-sm focus:border-kirei-DEFAULT focus:ring focus:ring-kirei-DEFAULT/20 transition-colors duration-200"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            placeholder="Minimal 8 karakter"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-kirei-DEFAULT focus:outline-none transition-colors duration-200"
                        >
                            {showPassword ? (
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

                {/* Field Konfirmasi Password */}
                <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Konfirmasi Password"
                        className="text-kirei-dark font-semibold text-sm sm:text-base"
                    />

                    <div className="relative mt-1.5">
                        <TextInput
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="block w-full pl-4 pr-12 py-3 rounded-xl border-gray-300 shadow-sm focus:border-kirei-DEFAULT focus:ring focus:ring-kirei-DEFAULT/20 transition-colors duration-200"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData("password_confirmation", e.target.value)
                            }
                            placeholder="Ulangi password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute inset-y-0 right-0 flex items-center pr-3 sm:pr-4 text-gray-400 hover:text-kirei-DEFAULT focus:outline-none transition-colors duration-200"
                        >
                            {showConfirmPassword ? (
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

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                {/* Bagian Bawah: Link Login dan Tombol Register */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-2">
                    <Link
                        href={route("login")}
                        className="text-sm text-center sm:text-left text-kirei-DEFAULT hover:text-kirei-dark underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-kirei-DEFAULT rounded-md transition-colors"
                    >
                        Sudah punya akun?
                    </Link>

                    <PrimaryButton
                        className="w-full sm:w-auto justify-center py-3 px-8 text-base bg-kirei-DEFAULT hover:bg-kirei-dark focus:bg-kirei-dark active:bg-kirei-dark rounded-xl shadow-lg shadow-kirei-DEFAULT/30 transition-all duration-300 hover:-translate-y-0.5"
                        disabled={processing}
                    >
                        Daftar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
