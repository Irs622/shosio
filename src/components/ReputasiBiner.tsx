import { useEffect, useMemo, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { supabase } from "../lib/supabaseClient";
import { Badge } from "./ui/badge";

type ReputasiLog = {
  id: number;
  skor: number;
  catatan: string | null;
  created_at: string;
};

export default function ReputasiBiner() {
  const [logs, setLogs] = useState<ReputasiLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReputasi();
  }, []);

  async function loadReputasi() {
    setLoading(true);

    const { data, error } = await supabase
      .from("reputasi_logs")
      .select("id, skor, catatan, created_at")
      .eq("to_profile_id", 1) // reputasi untuk user id = 1
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setLogs([]);
    } else {
      setLogs(data as ReputasiLog[]);
    }

    setLoading(false);
  }

  const ringkasan = useMemo(() => {
    if (logs.length === 0) {
      return {
        rata2: 90,
        total: 0,
        label: "Belum ada penilaian",
      };
    }
    const total = logs.length;
    const sum = logs.reduce((acc, l) => acc + l.skor, 0);
    const avg = Math.round(sum / total);
    let label = "Baik";

    if (avg >= 95) label = "Sangat Baik";
    else if (avg >= 85) label = "Baik";
    else if (avg >= 75) label = "Cukup";
    else label = "Perlu Perbaikan";

    return { rata2: avg, total, label };
  }, [logs]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Reputasi & Kepercayaan
          </h1>
          <p className="text-slate-600">
            Ringkasan penilaian dari pengguna lain berdasarkan transaksi yang
            kamu lakukan.
          </p>
        </div>

        {/* Ringkasan reputasi */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/3 flex flex-col items-center justify-center gap-2">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-3xl font-semibold text-white">
              {ringkasan.rata2}%
            </div>
            <p className="text-sm text-slate-600">Reputasi rata-rata</p>
            <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
              {ringkasan.label}
            </Badge>
          </div>
          <div className="md:w-2/3 space-y-2">
            <p className="text-sm text-slate-700">
              Total penilaian:{" "}
              <span className="font-semibold">{ringkasan.total}</span>
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reputasi dihitung dari skor yang diberikan oleh pengguna lain
              setelah transaksi selesai. Skor tinggi menunjukkan bahwa kamu
              dapat dipercaya dalam proses peminjaman, pengembalian, dan
              komunikasi.
            </p>
          </div>
        </div>

        {/* Daftar penilaian */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-800 mb-4">
            Riwayat Penilaian
          </h2>

          {loading ? (
            <div className="text-sm text-slate-500">Memuat data reputasi...</div>
          ) : logs.length === 0 ? (
            <div className="text-sm text-slate-500">
              Belum ada penilaian. Reputasi akan muncul setelah kamu menyelesaikan
              beberapa transaksi.
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between gap-3 border border-slate-100 rounded-xl px-4 py-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm text-slate-800">
                      Skor:{" "}
                      <span className="font-semibold">{log.skor}%</span>
                    </p>
                    {log.catatan && (
                      <p className="text-xs text-slate-600">
                        “{log.catatan}”
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {new Date(log.created_at).toLocaleString("id-ID")}
                  </p>
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
