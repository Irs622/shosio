import { Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import DaftarBarang from "./components/DaftarBarang";
import FormPengajuan from "./components/FormPengajuan";
import DetailBarang from "./components/DetailBarang";
import KonfirmasiTransaksi from "./components/KonfirmasiTransaksi";
import ReputasiBiner from "./components/ReputasiBiner";
import ProfilPengguna from "./components/ProfilPengguna";
import SOP from "./components/SOP";
import Menyumbangkan from "./components/Menyumbangkan";
import RiwayatDonasi from "./components/RiwayatDonasi";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/daftar-barang" element={<DaftarBarang />} />
      <Route path="/detail-barang/:id" element={<DetailBarang />} />
      <Route path="/form-pengajuan" element={<FormPengajuan />} />
      <Route path="/konfirmasi-transaksi" element={<KonfirmasiTransaksi />} />
      <Route path="/reputasi-biner" element={<ReputasiBiner />} />
      <Route path="/profil" element={<ProfilPengguna />} />
      <Route path="/sop" element={<SOP />} />
      <Route path="/menyumbangkan" element={<Menyumbangkan />} />
      <Route path="/riwayat-donasi" element={<RiwayatDonasi />} />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
