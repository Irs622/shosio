// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ⛔ Untuk sekarang: ISI MANUAL dulu pakai URL & anon key dari Supabase
// (ambil dari Project Settings → API)
const supabaseUrl = "https://sastccsfxixebeacdpal.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhc3RjY3NmeGl4ZWJlYWNkcGFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyOTE1NTgsImV4cCI6MjA4MDg2NzU1OH0.vg_jxzoVUXdazVxX1nFUkJm0Rk2U_vDPUxzd1sxl5DU"; // anon key kamu di sini

// sementara JANGAN pakai import.meta.env dulu biar gak crash
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
