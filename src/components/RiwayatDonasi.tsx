import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../lib/supabaseClient";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AKTIF_PROFILE_ID = 1;

type DonasiDiberikan = {
  id: number;
  nama: string;
  status: string;
  created_at: string;
};

type DonasiDiterima = {
  id: number;
  nama_barang: string | null;
  status: string;
  created_at: string;
};

export default function RiwayatDonasi() {
  const [tab, setTab] = useState<"diberikan" | "diterima">("diberikan");
  const [donasiDiberikan, setDonasiDiberikan] = useState<DonasiDiberikan[]>([]);
  const [donasiDiterima, setDonasiDiterima] = useState<DonasiDiterima[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("Semua");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Donasi yang DIBERIKAN (barang yang user posting sebagai Donasi)
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("id, nama, status, created_at")
      .eq("owner_id", AKTIF_PROFILE_ID)
      .eq("status", "Donasi")
      .order("created_at", { ascending: false });

    if (postsError) {
      console.error(postsError);
      setDonasiDiberikan([]);
    } else {
      setDonasiDiberikan(postsData as DonasiDiberikan[]);
    }

    // Donasi yang DITERIMA (transaksi tipe Donasi di mana user sebagai peminjam)
    const { data: trxData, error: trxError } = await supabase
      .from("transactions")
      .select("id, nama_barang, status, created_at, tipe")
      .eq("peminjam_id", AKTIF_PROFILE_ID)
      .eq("tipe", "Donasi")
      .order("created_at", { ascending: false });

    if (trxError) {
      console.error(trxError);
      setDonasiDiterima([]);
    } else {
      setDonasiDiterima(trxData as DonasiDiterima[]);
    }

    setLoading(false);
  }

  function formatTanggal(tanggal: string) {
    return new Date(tanggal).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const filteredDiterima =
    statusFilter === "Semua"
      ? donasiDiterima
      : donasiDiterima.filter((d) => d.status === statusFilter);

  const statusBadge = (status: string) => {
    if (status === "Menunggu")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "Disetujui")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "Ditolak")
      return "bg-red-100 text-red-700 border-red-200";
    if (status === "Selesai")
      return "bg-blue-100 text-blue-700 border-blue-200";
    if (status === "Dibatalkan")
      return "bg-slate-100 text-slate-700 border-slate-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Riwayat Donasi
            </h1>
            <p className="text-slate-600 text-sm">
              Lihat apa saja yang sudah kamu donasikan dan donasi apa saja yang
              pernah kamu terima.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            className="text-xs"
          >
            Refresh
          </Button>
        </div>

        {/* Tab */}
        <div className="flex gap-2 bg-slate-100 rounded-full p-1 w-fit">
          <button
            onClick={() => setTab("diberikan")}
            className={`px-4 py-1 text-xs rounded-full ${
              tab === "diberikan"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500"
            }`}
          >
            Donasi yang diberikan
          </button>
          <button
            onClick={() => setTab("diterima")}
            className={`px-4 py-1 text-xs rounded-full ${
              tab === "diterima"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500"
            }`}
          >
            Donasi yang diterima
          </button>
        </div>

        {/* Filter status untuk donasi diterima */}
        {tab === "diterima" && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Filter status:</span>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val)}
            >
              <SelectTrigger className="w-40 h-8 text-xs">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua</SelectItem>
                <SelectItem value="Menunggu">Menunggu</SelectItem>
                <SelectItem value="Disetujui">Disetujui</SelectItem>
                <SelectItem value="Ditolak">Ditolak</SelectItem>
                <SelectItem value="Selesai">Selesai</SelectItem>
                <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Isi list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {loading ? (
            <p className="text-sm text-slate-500">Memuat riwayat donasi...</p>
          ) : tab === "diberikan" ? (
            donasiDiberikan.length === 0 ? (
              <p className="text-sm text-slate-500">
                Belum ada barang yang kamu donasikan.
              </p>
            ) : (
              <div className="space-y-3">
                {donasiDiberikan.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="text-slate-800">{item.nama}</p>
                      <p className="text-[11px] text-slate-400">
                        {formatTanggal(item.created_at)}
                      </p>
                    </div>
                    <Badge className="text-[11px] bg-green-100 text-green-700 border border-green-200">
                      {item.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )
          ) : filteredDiterima.length === 0 ? (
            <p className="text-sm text-slate-500">
              Belum ada donasi yang kamu terima dengan filter ini.
            </p>
          ) : (
            <div className="space-y-3">
              {filteredDiterima.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-slate-800">
                      {item.nama_barang || `Transaksi #${item.id}`}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatTanggal(item.created_at)}
                    </p>
                  </div>
                  <Badge className={`text-[11px] ${statusBadge(item.status)}`}>
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
