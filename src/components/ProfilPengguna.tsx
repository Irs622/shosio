import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../lib/supabaseClient";
import { Badge } from "./ui/badge";
import {
  Calendar,
  TrendingUp,
  Gift,
  Box,
  CheckCircle2,
  Clock,
} from "lucide-react";

const AKTIF_PROFILE_ID = 1;

type Transaksi = {
  id: number;
  nama_barang: string | null;
  status: string;
  created_at: string;
  sumber?: string | null;
};

type Stats = {
  total: number;
  didonasikan: number;
  diterima: number;
};

type Profile = {
  id: number;
  nama: string;
  email?: string | null;
  bio?: string | null;
  reputasi?: number | null;
};

const MOCK_TRANSAKSI: Transaksi[] = [
  {
    id: 1,
    nama_barang: "Kalkulus dan Geometri Analitik Jilid 1",
    status: "Selesai",
    created_at: "2025-11-15T00:00:00Z",
    sumber: "Diterima dari Ahmad Rizki",
  },
  {
    id: 2,
    nama_barang: "Jas Lab Kimia Ukuran M",
    status: "Selesai",
    created_at: "2025-11-10T00:00:00Z",
    sumber: "Diterima dari Siti Nurhaliza",
  },
  {
    id: 3,
    nama_barang: "Kalkulator Scientific Casio",
    status: "Menunggu",
    created_at: "2025-11-05T00:00:00Z",
    sumber: "Pengajuan ke Rudi Hermawan",
  },
];

export default function ProfilPengguna() {
  const [profile, setProfile] = useState<Profile>({
    id: AKTIF_PROFILE_ID,
    nama: "Lm Irsal ShydiQ",
    email: "email@example.com",
    bio: "Teknik Informatika • Angkatan 2023 • NIM: 1237050136",
    reputasi: 85,
  });

  const [stats, setStats] = useState<Stats>({
    total: 12,
    didonasikan: 5,
    diterima: 7,
  });

  const [riwayat, setRiwayat] = useState<Transaksi[]>(MOCK_TRANSAKSI);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      setLoading(true);

      // 1) Profil dari tabel profiles (kalau ada)
      const { data: pData, error: pError } = await supabase
        .from("profiles")
        .select("id, nama, email, bio, reputasi")
        .eq("id", AKTIF_PROFILE_ID)
        .single();

      if (!pError && pData) {
        setProfile((prev) => ({
          ...prev,
          ...pData,
        }));
      } else if (pError) {
        console.warn("Load profile error:", pError.message);
      }

      // 2) Statistik & riwayat dari tabel transactions (kalau sudah dibuat)
      const { data: tData, error: tError } = await supabase
        .from("transactions")
        .select("id, nama_barang, status, created_at, peminjam_id, pemilik_id, tipe, sumber")
        .or(`peminjam_id.eq.${AKTIF_PROFILE_ID},pemilik_id.eq.${AKTIF_PROFILE_ID}`)
        .order("created_at", { ascending: false });

      if (!tError && tData) {
        const total = tData.length;
        const didonasikan = tData.filter(
          (t: any) => t.tipe === "Donasi" && t.pemilik_id === AKTIF_PROFILE_ID
        ).length;
        const diterima = tData.filter(
          (t: any) => t.tipe === "Donasi" && t.peminjam_id === AKTIF_PROFILE_ID
        ).length;

        setStats({
          total,
          didonasikan,
          diterima,
        });

        const mapped: Transaksi[] = tData.map((t: any) => ({
          id: t.id,
          nama_barang: t.nama_barang,
          status: t.status,
          created_at: t.created_at,
          sumber: t.sumber ?? null,
        }));

        setRiwayat(mapped.length > 0 ? mapped : MOCK_TRANSAKSI);
      } else if (tError) {
        console.warn("Load transactions error:", tError.message);
      }
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

  const inisial = profile.nama?.charAt(0)?.toUpperCase() || "U";
  const reputasi = profile.reputasi ?? 85;

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
              <h1 className="text-lg font-semibold text-slate-900">
                {profile.nama}
              </h1>
              <p className="text-sm text-slate-600">
                {profile.bio ||
                  "Teknik Informatika • Angkatan 2023 • NIM: 1237050136"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <Calendar className="w-4 h-4" />
                <span>Bergabung Januari 2024</span>
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
              <span className="text-xs text-blue-600 font-medium">Baik</span>
            </div>

            {/* Bar reputasi */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mb-3">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${Math.min(reputasi, 100)}%` }}
              />
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Reputasi dihitung berdasarkan komitmen yang dipenuhi dari semua
              transaksi. Tingkatkan reputasi dengan selalu menepati janji dan
              komitmen.
            </p>
          </div>

          {/* Statistik */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">
              Statistik
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">
                    Total Transaksi
                  </span>
                  <span className="font-semibold text-slate-800">
                    {stats.total}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Gift className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">
                    Barang Didonasikan
                  </span>
                  <span className="font-semibold text-slate-800">
                    {stats.disonasikan ?? stats.disonasikan}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center">
                  <Box className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">
                    Barang Diterima
                  </span>
                  <span className="font-semibold text-slate-800">
                    {stats.diterima}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Riwayat Transaksi */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">
            Riwayat Transaksi
          </h2>

          {loading && (
            <p className="text-xs text-slate-400 mb-2">
              Menyinkronkan dengan server...
            </p>
          )}

          {riwayat.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada transaksi yang tercatat.
            </p>
          ) : (
            <div className="space-y-3">
              {riwayat.map((trx) => {
                const isSelesai = trx.status === "Selesai";
                const isMenunggu = trx.status === "Menunggu";

                return (
                  <div
                    key={trx.id}
                    className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-sm bg-slate-50/60"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Box className="w-4 h-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-slate-800">
                          {trx.nama_barang || `Transaksi #${trx.id}`}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {formatTanggal(trx.created_at)} •{" "}
                          {trx.sumber || "Transaksi komunitas"}
                        </p>
                      </div>
                    </div>

                    <Badge
                      className={`text-[11px] px-3 py-1 flex items-center gap-1 ${
                        isSelesai
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isMenunggu
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {isSelesai && (
                        <CheckCircle2 className="w-3 h-3 inline-block" />
                      )}
                      {isMenunggu && <Clock className="w-3 h-3 inline-block" />}
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
