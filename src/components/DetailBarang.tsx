import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { supabase } from "../lib/supabaseClient";
import { Book, Package, Laptop, ArrowLeft, Award } from "lucide-react";

type Barang = {
  id: number;
  nama: string;
  kategori: string;
  status: string;
  donatur: string;
  reputasi: number;
  deskripsi?: string | null;
};

function getIconForKategori(kategori: string) {
  if (kategori === "Buku") return Book;
  if (kategori === "Elektronik") return Laptop;
  if (kategori === "Perlengkapan" || kategori === "Alat") return Package;
  return Package;
}

export default function DetailBarang() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    if (!id) return;
    loadBarang();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadBarang() {
    setLoading(true);

    const { data, error } = await supabase
      .from("posts")
      .select("id, nama, kategori, status, donatur, reputasi, deskripsi")
      .eq("id", Number(id))
      .single();

    if (error) {
      console.error(error);
      setBarang(null);
    } else {
      setBarang(data as Barang);
    }

    setLoading(false);
  }

  async function handleAjukan() {
    if (!barang) return;

    setRequesting(true);

    try {
      // sementara: pakai user id 1 sebagai peminjam & pemilik
      // nanti kalau sudah ada auth, tinggal diganti ke user yang login
      const { error } = await supabase.from("transactions").insert({
        post_id: barang.id,
        pemilik_id: 1,
        peminjam_id: 1,
        tipe:
          barang.status === "Tukar"
            ? "Tukar"
            : barang.status === "Donasi"
            ? "Donasi"
            : "Pinjam",
        status: "Menunggu",
        nama_barang: barang.nama,
      });

      if (error) {
        console.error(error);
        alert("Gagal mengajukan permintaan 😢");
      } else {
        alert("Permintaan berhasil dikirim ✅");
        navigate("/konfirmasi-transaksi");
      }
    } finally {
      setRequesting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10">Memuat data...</div>
        <Footer />
      </div>
    );
  }

  if (!barang) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
          <p className="text-slate-800 text-lg">
            Barang tidak ditemukan atau sudah dihapus.
          </p>
          <Link to="/daftar-barang">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke daftar barang
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = getIconForKategori(barang.kategori);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <Link to="/daftar-barang">
          <Button variant="ghost" className="px-0 gap-2 text-slate-600">
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </Link>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Icon className="w-7 h-7 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                {barang.nama}
              </h1>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs">
                  {barang.kategori}
                </Badge>
                <Badge
                  className={`text-xs ${
                    barang.status === "Donasi"
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {barang.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">
                  {barang.donatur.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-sm text-slate-500">Donatur</p>
                <p className="text-slate-800 font-medium">{barang.donatur}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-slate-600 text-sm">Reputasi donatur:</span>
              <Badge className="text-xs bg-green-100 text-green-700 border border-green-200">
                {barang.reputasi}%
              </Badge>
            </div>
          </div>

          {barang.deskripsi && (
            <div className="border-t border-slate-100 pt-4">
              <h2 className="text-sm font-semibold text-slate-800 mb-1">
                Deskripsi
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {barang.deskripsi}
              </p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleAjukan}
              disabled={requesting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {requesting ? "Mengirim..." : "Ajukan permintaan / tukar"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
