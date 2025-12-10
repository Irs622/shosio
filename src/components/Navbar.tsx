import { Link } from "react-router-dom";
import { User, FileText } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* Kiri: logo K KOLEKTIF */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">K</span>
          </div>
          <span className="text-sm font-semibold tracking-wide text-slate-800">
            KOLEKTIF
          </span>
        </Link>

        {/* Kanan: menu (Daftar Barang, Profil, SOP) */}
        <div className="flex items-center gap-8 text-sm text-slate-700">
          <Link to="/daftar-barang" className="hover:text-slate-900">
            Daftar Barang
          </Link>

          <Link
            to="/profil"
            className="flex items-center gap-1 hover:text-slate-900"
          >
            <User className="w-4 h-4" />
            <span>Profil</span>
          </Link>

          <Link
            to="/sop"
            className="flex items-center gap-1 hover:text-slate-900"
          >
            <FileText className="w-4 h-4" />
            <span>SOP</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
