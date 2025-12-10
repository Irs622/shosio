import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase } from "../lib/supabaseClient";

type Transaksi = {
  id: number;
  post_id: number;
  nama_barang: string | null;
  tipe: string;
  status: string;
  created_at: string;
};

export default function KonfirmasiTransaksi() {
  const [data, setData] = useState<Transaksi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransaksi();
  }, []);

  async function loadTransaksi() {
    setLoading(true);

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("peminjam_id", 1) // user sementara
      .order("created_at", { ascending: false });

    if (error) console.error(error);
    else setData(data as Transaksi[]);

    setLoading(false);
  }

  async function updateStatus(id: number, status: string) {
    const { error } = await supabase
      .from("transactions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Gagal memperbarui status.");
    } else {
      loadTransaksi(); // refresh tampilan
    }
  }

  async function selesaiDanTambahReputasi(id: number) {
    // Tambah reputasi log
    await supabase.from("reputasi_logs").insert({
      transaksi_id: id,
      from_profile_id: 1,
      to_profile_id: 1,
      skor: 95,
      catatan: "Transaksi selesai dengan baik.",
    });

    // Update status transaksi menjadi selesai
    await updateStatus(id, "Selesai");
  }

  const statusStyle = (status: string) => {
    if (status === "Menunggu")
      return "bg-amber-100 text-amber-700 border-amber-200";
    if (status === "Disetujui")
      return "bg-green-100 text-green-700 border-green-200";
    if (status === "Ditolak")
      return "bg-red-100 text-red-700 border-red-200";
    if (status === "Dibatalkan")
      return "bg-gray-200 text-gray-700 border-gray-300";
    if (status === "Selesai")
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Konfirmasi Transaksi
        </h1>
        <p className="text-slate-600">
          Riwayat transaksi 
        </p>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Memuat transaksi...</p>
          ) : data.length === 0 ? (
            <p className="text-sm text-slate-500">Belum ada transaksi.</p>
          ) : (
            data.map((t) => (
              <div
                key={t.id}
                className="border border-slate-200 p-4 rounded-xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{t.nama_barang}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(t.created_at).toLocaleString("id-ID")}
                    </p>
                  </div>

                  <Badge className={`${statusStyle(t.status)} text-xs`}>
                    {t.status}
                  </Badge>
                </div>

                {/* Aksi berdasarkan status */}
                <div className="flex gap-3 flex-wrap">
                  {t.status === "Menunggu" && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => updateStatus(t.id, "Dibatalkan")}
                      >
                        Batalkan
                      </Button>

                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus(t.id, "Disetujui")}
                      >
                        Setujui
                      </Button>

                      <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => updateStatus(t.id, "Ditolak")}
                      >
                        Tolak
                      </Button>
                    </>
                  )}

                  {t.status === "Disetujui" && (
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => selesaiDanTambahReputasi(t.id)}
                    >
                      Tandai Selesai
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
