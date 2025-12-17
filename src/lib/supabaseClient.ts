// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";



// ⛔ Untuk sekarang: ISI MANUAL dulu pakai URL & anon key dari Supabase
// (ambil dari Project Settings → API)
const supabaseUrl = "https://zizlmkiyegmawiosoofe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppemxta2l5ZWdtYXdpb3Nvb2ZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4ODExMDgsImV4cCI6MjA4MTQ1NzEwOH0.m8jbOaDfPreIaxt3QBSmpKTHV9SnUb4mmcHLivHjDHY"; // anon key kamu di sini

// sementara JANGAN pakai import.meta.env dulu biar gak crash
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log(
  'SUPABASE URL USED:',
  import.meta.env.VITE_SUPABASE_URL
);
