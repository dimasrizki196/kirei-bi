import { useForm, usePage } from "@inertiajs/react";
import {
    Download,
    UploadCloud,
    FileSpreadsheet,
    AlertCircle,
    Loader2,
    CheckCircle2,
} from "lucide-react";
import { useState } from "react";

export default function InputImport() {
    // Ambil pesan flash dari props global
    const { flash } = usePage().props;

    const [fileName, setFileName] = useState(null);
    const formImport = useForm({ file_excel: null });
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);
            formImport.setData("file_excel", file);
            e.dataTransfer.clearData();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            formImport.setData("file_excel", file);
            setFileName(file.name);
        } else {
            formImport.setData("file_excel", null);
            setFileName(null);
        }
    };

    const submitImport = (e) => {
        e.preventDefault();
        formImport.post(route("transaksi.import"), {
            preserveScroll: true,
            onSuccess: (page) => {
                // KUNCI: Hanya reset form jika tidak ada error saat import massal
                if (!page.props.flash.error) {
                    formImport.reset();
                    setFileName(null);
                    document.getElementById("file-upload").value = "";
                }
            },
        });
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* AREA NOTIFIKASI IMPORT */}
            {flash?.message && (
                <div className="mb-6 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start gap-3 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{flash.message}</p>
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-start gap-3 shadow-sm">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 animate-pulse" />
                    <p className="text-sm font-medium">{flash.error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {/* KOLOM KIRI (Instruksi & Template) */}
                <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                        <FileSpreadsheet className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2 text-base sm:text-lg">
                        Import Data Massal
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
                        Format Baris 5 di Excel Anda <b>wajib</b> seperti contoh
                        di bawah agar sistem dapat membacanya:
                    </p>

                    {/* Tabel Contoh Excel */}
                    <div className="border border-gray-200 rounded-lg overflow-x-auto mb-5 sm:mb-6 text-[10px] sm:text-xs font-mono custom-scrollbar">
                        <div className="bg-gray-100 p-2 font-bold flex border-b border-gray-200 min-w-max">
                            <div className="w-16 sm:w-20 border-r border-gray-300">
                                barang_id
                            </div>
                            <div className="w-24 sm:w-32 border-r border-gray-300 pl-2">
                                tanggal
                            </div>
                            <div className="w-14 sm:w-16 border-r border-gray-300 pl-2">
                                toko_id
                            </div>
                            <div className="w-28 sm:w-32 border-r border-gray-300 pl-2">
                                alamat_pembeli
                            </div>
                            <div className="w-24 border-r border-gray-300 pl-2">
                                kota_pembeli
                            </div>
                            <div className="w-16 sm:w-24 border-r border-gray-300 pl-2">
                                qty
                            </div>
                            <div className="w-20 sm:w-24 pl-2">total_harga</div>
                        </div>
                        <div className="p-2 flex text-gray-500 min-w-max bg-white">
                            <div className="w-16 sm:w-20">1</div>
                            <div className="w-24 sm:w-32 pl-2">2026-06-11</div>
                            <div className="w-14 sm:w-16 pl-2">1</div>
                            <div
                                className="w-28 sm:w-32 pl-2 truncate"
                                title="Masaran"
                            >
                                Masaran
                            </div>
                            <div
                                className="w-24 pl-2 truncate"
                                title="Surakarta"
                            >
                                Surakarta
                            </div>
                            <div className="w-16 sm:w-24 pl-2">5</div>
                            <div className="w-20 sm:w-24 pl-2">250000</div>
                        </div>
                    </div>

                    <a
                        href={route("transaksi.template")}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 sm:py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs sm:text-sm border border-slate-200 transition-colors"
                    >
                        <Download size={16} /> Download Template Excel
                    </a>
                </div>

                {/* KOLOM KANAN (Area Drop File) */}
                <div className="md:col-span-2">
                    <form
                        onSubmit={submitImport}
                        className="space-y-4 h-full flex flex-col justify-center"
                    >
                        {/* Area Drag & Drop */}
                        <label
                            htmlFor="file-upload"
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${isDragging ? "border-amber-500 bg-amber-100/50 scale-[1.02]" : fileName ? "border-amber-400 bg-amber-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"}`}
                        >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6 pointer-events-none px-4 text-center">
                                {fileName ? (
                                    <>
                                        <FileSpreadsheet className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 mb-2 sm:mb-3" />
                                        <p className="mb-1 text-xs sm:text-sm font-semibold text-amber-800">
                                            File siap diproses:
                                        </p>
                                        <p className="text-xs sm:text-sm text-amber-600 font-mono bg-amber-100/50 px-3 py-1 rounded-lg truncate max-w-full">
                                            {fileName}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud
                                            className={`w-10 h-10 sm:w-12 sm:h-12 mb-3 sm:mb-4 ${isDragging ? "text-amber-500" : "text-gray-400"}`}
                                        />
                                        <p className="mb-1 text-sm sm:text-base text-gray-700">
                                            <span className="font-bold text-amber-600">
                                                Klik untuk unggah
                                            </span>{" "}
                                            atau seret file
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                                            .XLSX, .XLS, .CSV (Maks 5MB)
                                        </p>
                                    </>
                                )}
                            </div>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </label>

                        {/* Validasi Error dari Laravel (jika file bukan excel atau melebihi size) */}
                        {formImport.errors.file_excel && (
                            <p className="text-red-500 text-xs sm:text-sm flex items-center gap-1.5 p-2 bg-red-50 rounded-lg">
                                <AlertCircle size={14} className="shrink-0" />
                                <span>{formImport.errors.file_excel}</span>
                            </p>
                        )}

                        {/* Tombol Submit */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={
                                    !formImport.data.file_excel ||
                                    formImport.processing
                                }
                                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white py-2.5 sm:py-3 px-6 sm:px-8 rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
                            >
                                {formImport.processing ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />{" "}
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud size={18} /> Import Data
                                        Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
