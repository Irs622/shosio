import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Book, Package, Laptop, Award } from "lucide-react";

import { supabase } from "../lib/supabaseClient";

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

export default function DaftarBarang() {
  const [kategoriFilter, setKategoriFilter] = useState<string>("Semua");
  const [dataBarang, setDataBarang] = useState<Barang[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("id, nama, kategori, status, donatur, reputasi, deskripsi")
        .order("id", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
      } else if (data) {
        setDataBarang(data as Barang[]);
      }

      setLoading(false);
    }

    loadData();

    const channel = supabase
      .channel("public:posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        (payload) => {
          setDataBarang((current) => {
            if (payload.eventType === "INSERT") {
              return [payload.new as Barang, ...current];
            }
            if (payload.eventType === "UPDATE") {
              return current.map((item) =>
                item.id === (payload.new as Barang).id
                  ? (payload.new as Barang)
                  : item
              );
            }
            if (payload.eventType === "DELETE") {
              return current.filter(
                (item) => item.id !== (payload.old as Barang).id
              );
            }
            return current;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredData =
    kategoriFilter === "Semua"
      ? dataBarang
      : dataBarang.filter((item) => item.kategori === kategoriFilter);

  const getReputasiBadge = (reputasi: number) => {
    if (reputasi >= 90)
      return "bg-green-100 text-green-700 border-green-200";
    if (reputasi >= 75) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-slate-900 mb-2">Daftar Barang</h1>
          <p className="text-slate-600 text-lg">
            Temukan barang yang kamu butuhkan dari mahasiswa lain
          </p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-slate-700">Filter Kategori:</label>
            <Select value={kategoriFilter} onValueChange={setKategoriFilter}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Semua">Semua Kategori</SelectItem>
                <SelectItem value="Buku">Buku</SelectItem>
                <SelectItem value="Perlengkapan">Perlengkapan</SelectItem>
                <SelectItem value="Elektronik">Elektronik</SelectItem>
                <SelectItem value="Alat">Alat</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-slate-600">
              {loading
                ? "Memuat data..."
                : `${filteredData.length} barang ditemukan`}
            </div>
          </div>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const Icon = getIconForKategori(item.kategori);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 mb-2 line-clamp-2">
                      {item.nama}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.kategori}
                      </Badge>
                      <Badge
                        className={`text-xs ${
                          item.status === "Donasi"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">
                        {item.donatur?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-slate-700 text-sm">
                      {item.donatur}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-slate-600 text-sm">Reputasi:</span>
                    <Badge
                      className={`text-xs ${getReputasiBadge(
                        item.reputasi
                      )}`}
                    >
                      {item.reputasi}%
                    </Badge>
                  </div>
                </div>

                <Link to={`/detail-barang/${item.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Lihat Detail
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
