import { AlertTriangle, X, Loader2 } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDeleteModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Konfirmasi Hapus",
    message = "Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.",
    processing = false,
}) {
    // Mencegah background scroll saat modal terbuka
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            {/* Overlay Gelap */}
            <div
                className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
                onClick={!processing ? onClose : undefined}
            />

            {/* Kotak Modal */}
            <div className="relative z-10 w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-2xl transition-all animate-in zoom-in-95 duration-200 sm:w-full">
                {/* Tombol Silang (Close) */}
                <div className="absolute right-4 top-4">
                    <button
                        onClick={onClose}
                        disabled={processing}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none disabled:opacity-50 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="sm:flex sm:items-start mt-2">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="mt-4 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <h3 className="text-lg font-bold text-gray-900">
                            {title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                            {message}
                        </p>
                    </div>
                </div>

                {/* Tombol Aksi */}
                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="inline-flex w-full justify-center rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 sm:w-auto disabled:opacity-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-transparent bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto disabled:opacity-70 transition-colors"
                    >
                        {processing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />{" "}
                                Menghapus...
                            </>
                        ) : (
                            "Ya, Hapus Data"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}