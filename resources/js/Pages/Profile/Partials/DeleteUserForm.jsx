import { useForm } from "@inertiajs/react";
import { useRef, useState } from "react";
import { AlertTriangle, Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

export default function DeleteUserForm({ className = "" }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();
        destroy(route("profile.destroy"), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section
            className={`flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${className}`}
        >
            <div>
                <h2 className="text-lg font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle size={20} /> Zona Bahaya (Hapus Akun)
                </h2>
                <p className="mt-1 text-sm text-gray-600 max-w-xl">
                    Setelah akun Anda dihapus, semua data dan riwayat yang
                    terkait akan dihapus secara permanen. Pastikan Anda sudah
                    mengunduh data penting sebelum melakukan tindakan ini.
                </p>
            </div>

            <button
                onClick={confirmUserDeletion}
                className="shrink-0 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-sm flex items-center justify-center gap-2 text-sm transition-colors"
            >
                <Trash2 size={18} /> Hapus Akun Permanen
            </button>

            {/* MODAL KONFIRMASI (MENGGUNAKAN PORTAL AGAR MENTOK ATAS/RAPI) */}
            {confirmingUserDeletion &&
                createPortal(
                    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-slate-900/60 backdrop-blur-sm p-4 pt-16 animate-in fade-in duration-200">
                        <div
                            className="fixed inset-0 -z-10"
                            onClick={closeModal}
                        ></div>

                        <div className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in slide-in-from-top-8 duration-300">
                            <form onSubmit={deleteUser} className="p-6">
                                <div className="flex items-center gap-3 text-red-600 mb-4">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Yakin ingin menghapus akun?
                                    </h2>
                                </div>

                                <p className="text-sm text-gray-600 mb-6">
                                    Tindakan ini tidak dapat dibatalkan.
                                    Masukkan password Anda untuk mengonfirmasi
                                    penghapusan akun permanen.
                                </p>

                                <div className="mb-6">
                                    <input
                                        id="password"
                                        type="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`w-full px-4 py-2.5 border rounded-xl text-sm ${errors.password ? "border-red-500" : "border-gray-300 focus:border-red-500 focus:ring-red-500"}`}
                                        placeholder="Masukkan password Anda..."
                                        autoFocus
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {processing && (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        )}
                                        Hapus Sekarang
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>,
                    document.body,
                )}
        </section>
    );
}
