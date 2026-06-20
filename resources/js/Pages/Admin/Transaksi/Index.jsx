import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react"; // <-- Import usePage
import { useState } from "react";
import InputManual from "./InputManual";
import InputImport from "./InputImport";
import DataTransaksi from "./DataTransaksi";

export default function TransaksiIndex({
    barangs,
    tokos,
    pembelis,
    transaksis,
}) {
    // 1. Ambil Role User
    const userRole = usePage().props.auth.user.role;

    // (State tab jika kamu menggunakan tab)
    const [activeTab, setActiveTab] = useState("data");

    return (
        <AuthenticatedLayout header="Manajemen Transaksi">
            <Head title="Transaksi | Kirei Shop" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* JIKA ROLE ADMIN, TAMPILKAN TOMBOL/TAB INPUT */}
                {userRole === "admin" && (
                    <div className="flex gap-4 border-b border-gray-200 pb-4">
                        <button
                            onClick={() => setActiveTab("data")}
                            className={
                                activeTab === "data"
                                    ? "font-bold text-sky-600"
                                    : "text-gray-500"
                            }
                        >
                            Riwayat Data
                        </button>
                        <button
                            onClick={() => setActiveTab("manual")}
                            className={
                                activeTab === "manual"
                                    ? "font-bold text-sky-600"
                                    : "text-gray-500"
                            }
                        >
                            Input Manual
                        </button>
                        <button
                            onClick={() => setActiveTab("import")}
                            className={
                                activeTab === "import"
                                    ? "font-bold text-sky-600"
                                    : "text-gray-500"
                            }
                        >
                            Import Massal
                        </button>
                    </div>
                )}

                {/* TAMPILAN KONTEN BERDASARKAN TAB & ROLE */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    {/* Data Riwayat: Bisa dilihat Admin & Manager */}
                    {(activeTab === "data" || userRole === "manager") && (
                        <DataTransaksi transaksis={transaksis} />
                    )}

                    {/* Form Manual: HANYA untuk Admin */}
                    {activeTab === "manual" && userRole === "admin" && (
                        <InputManual
                            barangs={barangs}
                            tokos={tokos}
                            pembelis={pembelis}
                        />
                    )}

                    {/* Form Import: HANYA untuk Admin */}
                    {activeTab === "import" && userRole === "admin" && (
                        <InputImport />
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
