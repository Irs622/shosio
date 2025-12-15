import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/useAuth"; 

export default function Menyumbangkan() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [nama, setNama] = useState("");
  const [kategori, setKategori] = useState("Buku");
  const [donatur, setDonatur] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && user.user_metadata?.full_name) {
      setDonatur(user.user_metadata.full_name);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      alert("Anda harus login untuk melakukan donasi.");
      navigate("/login");
      return;
    }

    const namaTrim = nama.trim();
    const donaturTrim = donatur.trim();
    const deskripsiTrim = deskripsi.trim();

    if (!namaTrim || !donaturTrim) {
      alert("Nama barang dan nama donatur wajib diisi.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("posts").insert({
        nama: namaTrim,
        kategori,
        status: "Donasi",
        donatur: donaturTrim,
        deskripsi: deskripsiTrim || null,
        reputasi: 90,
        owner_id: user.id,
      });

      if (error) {
        console.error(error);
        alert(`Gagal menyimpan donasi: ${error.message}`);
      } else {
        alert("Terima kasih! Donasi kamu sudah tercatat ✅");
        setNama("");
        setDonatur("");
        setDeskripsi("");
        setKategori("Buku");
        navigate("/daftar-barang");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  // Tampilkan loading state jika auth belum siap
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat data pengguna...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Menyumbangkan Barang
          </h1>
          <p className="text-slate-600 text-sm">
            Bantu teman-teman mahasiswa lain dengan menyumbangkan buku, alat,
            atau perlengkapan yang masih layak pakai.
          </p>
          <ul className="mt-3 text-xs text-slate-500 list-disc list-inside">
            <li>Pastikan kondisi barang masih layak digunakan.</li>
            <li>Tuliskan deskripsi sejujur mungkin.</li>
            <li>Barang donasi akan muncul di halaman daftar barang.</li>
          </ul>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5"
        >
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Nama Barang
            </label>
            <Input
              placeholder="Contoh: Kalkulus dan Geometri Analitik Jilid 1"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Kategori
            </label>
            <Select value={kategori} onValueChange={setKategori}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Buku">Buku</SelectItem>
                <SelectItem value="Perlengkapan">Perlengkapan</SelectItem>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
                <SelectItem value="Alat">Alat</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Nama Donatur
            </label>
            <Input
              placeholder="Contoh: Ahmad Rizki"
              value={donatur}
              onChange={(e) => setDonatur(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Deskripsi Barang
            </label>
            <Textarea
              rows={3}
              placeholder="Contoh: Kondisi 90%, ada sedikit coretan..."
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {loading ? "Menyimpan..." : "Simpan Donasi"}
          </Button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
