import { Transition } from "@headlessui/react";
import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import { KeyRound, Save, CheckCircle2 } from "lucide-react";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const updatePassword = (e) => {
        e.preventDefault();
        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={className}>
            <header className="flex items-center gap-2 border-b border-gray-100 pb-4 mb-5">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                    <KeyRound size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Ubah Password
                    </h2>
                    <p className="text-xs text-gray-500">
                        Gunakan password yang kuat agar akun tetap aman.
                    </p>
                </div>
            </header>

            <form onSubmit={updatePassword} className="space-y-5">
                <div>
                    <label
                        htmlFor="current_password"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Password Saat Ini
                    </label>
                    <input
                        id="current_password"
                        ref={currentPasswordInput}
                        type="password"
                        value={data.current_password}
                        onChange={(e) =>
                            setData("current_password", e.target.value)
                        }
                        autoComplete="current-password"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.current_password ? "border-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                    />
                    {errors.current_password && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.current_password}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Password Baru
                    </label>
                    <input
                        id="password"
                        ref={passwordInput}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        autoComplete="new-password"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.password ? "border-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                    />
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-bold text-gray-700 mb-1.5"
                    >
                        Konfirmasi Password Baru
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        autoComplete="new-password"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.password_confirmation ? "border-red-500" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"}`}
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Save size={16} /> Ubah Password
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
