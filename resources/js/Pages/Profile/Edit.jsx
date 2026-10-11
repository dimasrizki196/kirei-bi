import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { UserCircle } from "lucide-react";

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout header="Pengaturan Profil Akun">
            <Head title="Profil | Kirei Shop" />

            <div className="pb-12 pt-2 h-full">
                {/* Menggunakan Grid Layout 2 Kolom agar bersebelahan dan tidak perlu scroll */}
                <div className="mx-auto max-w-7xl space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                    {/* Kotak Kiri: Informasi Profil */}
                    <div className="bg-white p-6 sm:p-8 border border-gray-200 shadow-sm rounded-2xl h-fit">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                        />
                    </div>

                    {/* Kotak Kanan: Ubah Password */}
                    <div className="bg-white p-6 sm:p-8 border border-gray-200 shadow-sm rounded-2xl h-fit">
                        <UpdatePasswordForm />
                    </div>

                    {/* Kotak Bawah (Penuh / 2 Kolom): Hapus Akun */}
                    <div className="bg-red-50/50 p-6 sm:p-8 border border-red-100 shadow-sm rounded-2xl lg:col-span-2 h-fit">
                        <DeleteUserForm />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
