import { Link, useNavigate } from "react-router-dom";
import { User, FileText, Search, Plus, LogOut } from "lucide-react"; // Menambahkan icon LogOut
import { Button } from './ui/button';
import { useAuth } from "../contexts/useAuth"; // Impor hook useAuth

export default function Navbar() {
  const { user, signOut } = useAuth(); // Ambil status user dan fungsi signOut
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/'); // Arahkan ke homepage setelah logout
  };

  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* Kiri: logo KOLEKTIF */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">K</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-800">
            KOLEKTIF
          </span>
        </Link>

        {/* Tengah: Menu Utama */}
        <div className="flex items-center gap-6 text-sm text-slate-700">
          
          <Link to="/daftar-barang" className="flex items-center gap-1 hover:text-slate-900">
            <Search className="w-4 h-4" />
            <span>Jelajahi</span>
          </Link>

          <Link to="/menyumbangkan" className="flex items-center gap-1 hover:text-slate-900">
            <Plus className="w-4 h-4" />
            <span>Beri Donasi</span>
          </Link>

          <Link to="/sop" className="flex items-center gap-1 hover:text-slate-900">
            <FileText className="w-4 h-4" />
            <span>SOP</span>
          </Link>
          
          {/* Tampilkan menu Profil hanya jika sudah login */}
          {user && (
            <Link to="/profil" className="flex items-center gap-1 hover:text-slate-900">
              <User className="w-4 h-4" />
              <span>Profil</span>
            </Link>
          )}
        </div>
        
        {/* Kanan: Tombol Autentikasi Dinamis */}
        <div className="flex items-center gap-4">
            {user ? (
                // Jika user login, tampilkan tombol Logout
                <Button 
                    onClick={handleLogout}
                    variant="outline" 
                    className="flex items-center gap-1"
                >
                    <LogOut className="w-4 h-4 mr-1" />
                    Keluar
                </Button>
            ) : (
                // Jika tidak login, tampilkan tombol Masuk dan Daftar
                <>
                    <Link to="/login">
                        <Button variant="ghost">Masuk</Button>
                    </Link>
                    <Link to="/registrasi"> 
                        <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-1">
                            <User className="w-4 h-4 mr-1" />
                            Daftar
                        </Button>
                    </Link>
                </>
            )}
        </div>
      </div>
    </nav>
  );
}