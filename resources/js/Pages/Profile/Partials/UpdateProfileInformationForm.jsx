import { Transition } from "@headlessui/react";
import { Link, useForm, usePage } from "@inertiajs/react";
import { User, Mail, Save, CheckCircle2 } from "lucide-react";

export default function UpdateProfileInformationForm({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                    <User size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Informasi Pribadi
                    </h2>
                    <p className="text-xs text-gray-500">
                        Perbarui nama tampilan dan alamat email Anda.
                    </p>
                </div>
            </header>

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        autoComplete="name"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.name ? "border-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                    />
                    {errors.name && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Email Akses
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.email ? "border-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                    />
                    {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="bg-amber-50 text-amber-800 p-3 rounded-xl border border-amber-200 text-sm">
                        <p>
                            Alamat email Anda belum diverifikasi.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="ml-1 underline font-bold hover:text-amber-900"
                            >
                                Klik di sini untuk mengirim ulang email
                                verifikasi.
                            </Link>
                        </p>
                        {status === "verification-link-sent" && (
                            <div className="mt-2 text-xs font-bold text-green-600">
                                Link verifikasi baru telah dikirim ke email
                                Anda.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} /> Simpan Perubahan
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0 scale-95"
                    >
                        <p className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={16} /> Tersimpan.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
