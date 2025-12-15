import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
// import { Button } from './ui/button'; // Kita matikan dulu agar tidak konflik
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { ArrowRight, Gift, User, LogOut, Sparkles } from 'lucide-react';

export default function WelcomePengguna() {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-slate-50">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 bg-blue-200 rounded-full"></div>
                    <p className="text-lg font-medium text-slate-500">Memuat dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        navigate('/login');
        return null;
    }

    const displayName = user.user_metadata?.full_name || user.email;

    const handleLogout = async () => {
        await signOut();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            
            {/* Dekorasi Background Abstrak */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="w-full max-w-6xl mx-auto z-10 relative">
                
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center justify-center p-2 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
                        <Sparkles className="w-4 h-4 text-amber-500 mr-2" />
                        <span className="text-sm font-medium text-slate-600">Selamat datang kembali</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                        Halo, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{displayName}</span>! 👋
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                        Pusat aktivitas akademikmu ada di sini. Apa yang ingin kamu lakukan hari ini?
                    </p>
                </div>

                {/* Grid of Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Card 1: Jelajahi (Blue Theme) */}
                    <Card className="card-glass group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <ArrowRight className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                                    Jelajahi Barang
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-base">
                                    Temukan buku, catatan, dan alat tulis yang dibagikan oleh teman angkatanmu.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardFooter className="pt-4">
                            <Link to="/daftar-barang" className="w-full">
                                <button className="btn-base btn-dark">
                                    Lihat Semua Barang
                                </button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Card 2: Donasi (Green Theme) */}
                    <Card className="card-glass group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <Gift className="w-7 h-7 text-emerald-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                                    Mulai Donasi
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-base">
                                    Punya barang akademik tak terpakai? Berikan kepada yang membutuhkan.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardFooter className="pt-4">
                            <Link to="/menyumbangkan" className="w-full">
                                <button className="btn-base btn-success">
                                    Buat Donasi Baru
                                </button>
                            </Link>
                        </CardFooter>
                    </Card>

                    {/* Card 3: Profil (Purple Theme) */}
                    <Card className="card-glass group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <User className="w-7 h-7 text-purple-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-bold text-slate-800 mb-2">
                                    Profil Saya
                                </CardTitle>
                                <CardDescription className="text-slate-500 text-base">
                                    Kelola informasi akun, cek riwayat donasi, dan lihat reputasi kamu.
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardFooter className="pt-4">
                            <Link to="/profil" className="w-full">
                                <button className="btn-base btn-outline">
                                    Kelola Akun
                                </button>
                            </Link>
                        </CardFooter>
                    </Card>

                </div>

                {/* Footer / Logout */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-xl transition-all flex items-center justify-center mx-auto font-medium"
                    >
                        <LogOut className="w-5 h-5 mr-2" />
                        Keluar dari Aplikasi
                    </button>
                </div>
                
            </div>
        </div>
    );
}