// src/components/Footer.tsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Kolom 1: Logo + deskripsi singkat */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">K</span>
              </div>
              <span className="text-sm font-semibold tracking-wide text-slate-800">
                KOLEKTIF
              </span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Platform kolektif mahasiswa FST untuk berbagi dan donasi
              sumber daya akademik.
            </p>
          </div>

          {/* Kolom 2: Menu */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Menu</h3>
            <div className="flex flex-col gap-2 text-sm text-slate-600">
              <Link to="/daftar-barang" className="hover:text-slate-900">
                Daftar Barang
              </Link>
              <Link to="/profil" className="hover:text-slate-900">
                Profil
              </Link>
              <Link to="/sop" className="hover:text-slate-900">
                SOP &amp; Etika
              </Link>
            </div>
          </div>

          {/* Kolom 3: Tentang */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Tentang</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Platform berbasis komunitas yang mengutamakan kepercayaan
              dan komitmen mahasiswa.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-4 text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} KOLEKTIF
        </div>
      </div>
    </footer>
  );
}
