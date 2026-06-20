import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Search, Shield, Users, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UserIndex({ users, flash }) {
    const currentUser = usePage().props.auth.user;
    const [searchQuery, setSearchQuery] = useState("");

    // State Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'admin'
    });

    // Filter Klien
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const openCreateModal = () => {
        clearErrors();
        reset();
        setData('role', 'admin'); // Default role
        setIsEditing(false);
        setCurrentId(null);
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        clearErrors();
        reset();
        setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '', 
            password_confirmation: ''
        });
        setIsEditing(true);
        setCurrentId(user.id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('users.update', currentId), { onSuccess: () => closeModal() });
        } else {
            post(route('users.store'), { onSuccess: () => closeModal() });
        }
    };

    const handleDelete = (id, name) => {
        if (id === currentUser.id) {
            alert("Anda tidak bisa menghapus akun Anda sendiri!");
            return;
        }
        if (window.confirm(`Yakin ingin mencabut akses dan menghapus user "${name}"?`)) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout header="Manajemen Akses User">
            <Head title="Kelola User | Kirei Shop" />

            <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden pb-12">
                
                {/* Notifikasi */}
                {flash?.message && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 sm:p-4 rounded-xl shadow-sm animate-pulse">
                        <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.message}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-800 p-3 sm:p-4 rounded-xl shadow-sm">
                        <AlertCircle size={20} className="text-red-600 shrink-0" />
                        <p className="text-xs sm:text-sm font-medium">{flash.error}</p>
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    {/* Header Tabel */}
                    <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gray-50/50">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 shrink-0">
                                <Users size={20} />
                            </div>
                            <div>
                                <h2 className="text-base sm:text-lg font-bold text-gray-800">Daftar Pegawai & Akses</h2>
                                <p className="text-[10px] sm:text-xs text-gray-500">Kelola akun Admin dan sesama Manager</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Cari nama / email..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button onClick={openCreateModal} className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0">
                                <Plus size={16} /> <span className="hidden sm:inline">Tambah Akun</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabel Data */}
                    <div className="overflow-x-auto w-full custom-scrollbar">
                        <table className="w-full text-sm text-left whitespace-nowrap">
                            <thead className="bg-white text-gray-400 uppercase text-xs font-bold border-b border-gray-100">
                                <tr>
                                    <th className="px-5 py-4 w-12 text-center">No</th>
                                    <th className="px-5 py-4">Informasi Pengguna</th>
                                    <th className="px-5 py-4">Role / Hak Akses</th>
                                    <th className="px-5 py-4 w-32 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((u, index) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-5 py-4 text-center font-bold text-gray-400">{index + 1}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-500 shrink-0">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-gray-800">{u.name}</span>
                                                        <span className="text-xs text-gray-500">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${
                                                    u.role === 'manager' 
                                                    ? 'bg-purple-50 text-purple-700 border-purple-200' 
                                                    : 'bg-sky-50 text-sky-700 border-sky-200'
                                                }`}>
                                                    <Shield size={12} /> {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 flex items-center justify-end gap-2">
                                                <button onClick={() => openEditModal(u)} className="p-1.5 text-amber-500 hover:bg-amber-50 border border-transparent hover:border-amber-200 rounded-lg transition-colors" title="Edit Akun">
                                                    <Edit2 size={16} />
                                                </button>
                                                {/* Sembunyikan tombol hapus jika itu akunnya sendiri */}
                                                {u.id !== currentUser.id ? (
                                                    <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-lg transition-colors" title="Hapus Akun">
                                                        <Trash2 size={16} />
                                                    </button>
                                                ) : (
                                                    <span className="p-1.5 px-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">Anda</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="text-center py-12 text-gray-400 font-medium italic">Tidak ada pengguna ditemukan.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* MODAL FORM TAMBAH/EDIT */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-full">
                            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-slate-50/50 shrink-0">
                                <h3 className="font-bold text-base sm:text-lg text-gray-800">
                                    {isEditing ? 'Edit Data Pengguna' : 'Tambah Pengguna Baru'}
                                </h3>
                                <button onClick={closeModal} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto custom-scrollbar">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Nama Lengkap <span className="text-red-500">*</span></label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={`w-full px-3 py-2 border rounded-xl text-sm ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} placeholder="Nama Pegawai" required autoFocus />
                                    {errors.name && <p className="mt-1 text-[10px] text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Akses Login <span className="text-red-500">*</span></label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={`w-full px-3 py-2 border rounded-xl text-sm ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} placeholder="admin@kireishop.com" required />
                                    {errors.email && <p className="mt-1 text-[10px] text-red-500">{errors.email}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Hak Akses Sistem <span className="text-red-500">*</span></label>
                                    <select value={data.role} onChange={e => setData('role', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500 font-medium">
                                        <option value="admin">Admin (Operasional Kasir)</option>
                                        <option value="manager">Manager (Business Intelligence)</option>
                                    </select>
                                    {errors.role && <p className="mt-1 text-[10px] text-red-500">{errors.role}</p>}
                                </div>

                                <div className="pt-2 border-t border-gray-100">
                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                        {isEditing ? 'Ubah Password (Kosongkan jika tidak ingin diubah)' : 'Password Baru *'}
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className={`w-full px-3 py-2 mb-2 border rounded-xl text-sm ${errors.password ? 'border-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'}`} placeholder="Minimal 8 karakter" required={!isEditing} />
                                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:border-indigo-500 focus:ring-indigo-500" placeholder="Ulangi Password" required={data.password !== ''} />
                                    {errors.password && <p className="mt-1 text-[10px] text-red-500">{errors.password}</p>}
                                </div>
                                
                                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2 shrink-0">
                                    <button type="button" onClick={closeModal} className="px-4 py-2 text-xs sm:text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2">
                                        {processing && <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>}
                                        Simpan Akun
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}