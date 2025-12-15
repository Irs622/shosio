import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/useAuth";
import { Badge } from "./ui/badge";
import {
  Calendar,
  TrendingUp,
  Gift,
  Box,
  CheckCircle2,
  Clock,
} from "lucide-react";

// Tipe data sesuai struktur database
type Transaksi = {
  id: number;
  nama_barang: string | null;
  status: string;
  created_at: string;
  sumber?: string | null;
  tipe?: string;
};

type Stats = {
  total: number;
  didonasikan: number;
  diterima: number;
};

type Profile = {
  id: string;
  nama: string;
  email?: string | null;
  bio?: string | null;
  reputasi?: number | null;
  created_at?: string;
};

export default function ProfilPengguna() {
  const { user, loading: authLoading } = useAuth(); // Ambil user yang sedang login
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    didonasikan: 0,
    diterima: 0,
  });
  const [riwayat, setRiwayat] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Cek status login
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    // 2. Jika user ada, load data berdasarkan ID user tersebut
    if (user) {
      loadAll(user.id);
    }
  }, [user, authLoading, navigate]);

  async function loadAll(userId: string) {
    try {
      setLoading(true);

      // --- FETCH PROFILE (Bagian ini sudah benar) ---
      const { data: pData, error: pError } = await supabase
        .from("profiles")
        .select("id, nama, email, bio, reputasi, created_at")
        .eq("id", userId)
        .maybeSingle();

      if (pError) console.warn("Profile warning:", pError.message);

      if (pData) {
        setProfile(pData);
      } else if (user) {
        setProfile({
          id: user.id,
          nama: user.user_metadata?.full_name || user.email || "Pengguna",
          email: user.email,
          created_at: user.created_at,
          bio: "Selamat datang! Silakan lengkapi profil Anda.",
          reputasi: 100,
        });
      }

      // --- FETCH TRANSAKSI (PERBAIKAN DISINI) ---
      // 1. Hapus 'sumber' dari select karena tidak ada di tabel transactions Anda
      const { data: tData, error: tError } = await supabase
        .from("transactions")
        .select(
          "id, nama_barang, status, created_at, peminjam_id, pemilik_id, tipe"
        )
        .or(`peminjam_id.eq.${userId},pemilik_id.eq.${userId}`)
        .order("created_at", { ascending: false });

      if (tError)
        throw new Error(`Gagal mengambil transaksi: ${tError.message}`);

      if (tData) {
        // Hitung Statistik
        setStats({
          total: tData.length,
          didonasikan: tData.filter(
            (t) => t.tipe === "Donasi" && t.pemilik_id === userId
          ).length,
          diterima: tData.filter(
            (t) => t.tipe === "Donasi" && t.peminjam_id === userId
          ).length,
        });

        // 2. Mapping Data: Handle 'sumber' secara manual
        const mapped: Transaksi[] = tData.map((t: any) => ({
          id: t.id,
          nama_barang: t.nama_barang,
          status: t.status,
          created_at: t.created_at,
          sumber:
            t.tipe === "Donasi" ? "Donasi Barang" : "Peminjaman Komunitas",
          tipe: t.tipe,
        }));

        setRiwayat(mapped);
      }
    } catch (error) {
      console.error("Error loading profile:", error.message);
    } finally {
      setLoading(false);
    }
  }

  function formatTanggal(t: string) {
    return new Date(t).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  if (authLoading || loading || !profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-slate-500 text-sm">Memuat profil...</p>
        </div>
      </div>
    );
  }

  const inisial = profile.nama?.charAt(0)?.toUpperCase() || "U";
  const reputasi = profile.reputasi ?? 100;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {/* Kartu cover profil */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-sky-500 to-emerald-500" />
          <div className="px-8 pb-6 flex items-end gap-6 -mt-10">
            {/* Avatar besar */}
            <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center shadow-md border-4 border-white">
              <span className="text-4xl font-semibold text-white">
                {inisial}
              </span>
            </div>

            {/* Info utama */}
            <div className="flex-1 py-4">
              <h1 className="text-2xl font-bold text-slate-900">
                {profile.nama}
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {profile.bio || "Pengguna aktif komunitas berbagi."}
              </p>
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Bergabung{" "}
                    {profile.created_at
                      ? formatTanggal(profile.created_at)
                      : "Baru Saja"}
                  </span>
                </div>
                {profile.email && (
                  <div className="flex items-center gap-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {profile.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Reputasi + Statistik */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Reputasi – span 2 kolom */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:col-span-2">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Reputasi Komitmen
                </h2>
                <p className="text-xs text-slate-500">
                  Tingkat kepercayaan dalam komunitas.
                </p>
              </div>
            </div>

            <div className="flex items-baseline justify-between mb-2">
              <p className="text-4xl font-semibold text-blue-600">
                {reputasi}%
              </p>
              <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                Sangat Baik
              </span>
            </div>

            {/* Bar reputasi */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(reputasi, 100)}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Reputasi dihitung berdasarkan keberhasilan transaksi donasi dan
              peminjaman Anda. Pertahankan reputasi tinggi untuk mendapatkan
              kepercayaan lebih.
            </p>
          </div>

          {/* Statistik */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5">
              Statistik Aktivitas
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                  </div>
                  <span className="text-slate-600 text-xs">
                    Total Transaksi
                  </span>
                </div>
                <span className="font-bold text-slate-800 text-lg">
                  {stats.total}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-slate-600 text-xs">
                    Donasi Diberikan
                  </span>
                </div>
                <span className="font-bold text-slate-800 text-lg">
                  {stats.didonasikan}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                    <Box className="w-4 h-4 text-purple-500" />
                  </div>
                  <span className="text-slate-600 text-xs">
                    Donasi Diterima
                  </span>
                </div>
                <span className="font-bold text-slate-800 text-lg">
                  {stats.diterima}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Riwayat Transaksi */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Riwayat Transaksi Terbaru
            </h2>
            <Badge className="bg-slate-100 text-slate-600 border-slate-200 font-normal">
              {riwayat.length} Transaksi
            </Badge>
          </div>

          {riwayat.length === 0 ? (
            <div className="text-center py-10 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <p className="text-sm text-slate-500">
                Belum ada riwayat transaksi yang tercatat.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {riwayat.map((trx) => {
                const isSelesai = trx.status === "Selesai";
                const isMenunggu = trx.status === "Menunggu";

                return (
                  <div
                    key={trx.id}
                    className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-sm bg-white hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                        <Box className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-slate-800 font-medium">
                          {trx.nama_barang || `Transaksi #${trx.id}`}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-400">
                            {formatTanggal(trx.created_at)}
                          </span>
                          <span className="text-[11px] text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {trx.sumber}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      className={`text-[11px] px-2.5 py-0.5 flex items-center gap-1.5 font-medium ${
                        isSelesai
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isMenunggu
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isSelesai && <CheckCircle2 className="w-3 h-3" />}
                      {isMenunggu && <Clock className="w-3 h-3" />}
                      {trx.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
