import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { supabase } from '../lib/supabaseClient'; // Impor supabase client

const RegistrasiPengguna = () => {
    // State untuk menyimpan nilai input
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
    const [error, setError] = useState('');
    
    // Hook untuk navigasi
    const navigate = useNavigate();

    // Fungsi untuk menangani proses pendaftaran
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Reset pesan error

        const cleanEmail = email.replace(/[^a-zA-Z0-9@.\-_+]/g, '').toLowerCase();
        const cleanNama = nama.trim();

        if (!cleanNama || !cleanEmail || !password || !konfirmasiPassword) {
            setError('Semua kolom harus diisi.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanEmail)) {
            setError('Format email tidak valid.');
            return;
        }

        if (password !== konfirmasiPassword) {
            setError('Konfirmasi Password tidak cocok dengan Password.');
            return;
        }
        
        if (password.length < 6) {
            setError('Password minimal harus 6 karakter.');
            return;
        }

        // --- Logika Pendaftaran dengan Supabase ---
        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: cleanEmail, 
                password: password,
                options: {
                    data: {
                        full_name: cleanNama,
                    }
                }
            });

            if (signUpError) {
                throw signUpError;
            }

            if (data.user) {
                alert('Pendaftaran Berhasil! Silakan masuk.');
                navigate('/login'); 
            } else {
                setError('Pendaftaran gagal. Silakan coba lagi.');
            }
            
        } catch (err) {
            // Tangani error spesifik dari Supabase
            if (err.message.includes("User already registered")) {
                setError('Email ini sudah terdaftar. Silakan gunakan email lain atau masuk.');
            } else {
                console.error('Error saat pendaftaran:', err);
                setError('Terjadi masalah saat mencoba mendaftar.');
            }
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Daftar Akun Kolektif</h2>
                {error && <p style={styles.errorText}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    {/* Input Nama */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="nama" style={styles.label}>Nama Lengkap:</label>
                        <input
                            type="text"
                            id="nama"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>

                    {/* Input Email */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Masukkan email aktif Anda"
                        />
                    </div>
                    
                    {/* Input Password */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Minimal 6 karakter"
                        />
                    </div>

                    {/* Input Konfirmasi Password */}
                    <div style={styles.inputGroup}>
                        <label htmlFor="konfirmasiPassword" style={styles.label}>Konfirmasi Password:</label>
                        <input
                            type="password"
                            id="konfirmasiPassword"
                            value={konfirmasiPassword}
                            onChange={(e) => setKonfirmasiPassword(e.target.value)}
                            required
                            style={styles.input}
                            placeholder="Ulangi password Anda"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        style={styles.submitButton}
                    >
                        Daftar
                    </button>
                </form>

                <p style={styles.loginLinkContainer}>
                    Sudah punya akun? 
                    <Link to="/login" style={styles.link}>
                        Masuk di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

// Objek Style (Diambil dari LoginPengguna.tsx agar konsisten)
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f8f9fa', 
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '450px', // Sedikit lebih lebar karena inputnya lebih banyak
        textAlign: 'left',
    },
    header: {
        fontSize: '24px',
        marginBottom: '30px',
        color: '#333',
        textAlign: 'center',
        fontWeight: '600',
    },
    inputGroup: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        fontSize: '14px',
        color: '#555',
        fontWeight: '500',
    },
    input: {
        width: '100%',
        padding: '12px',
        border: '1px solid #ced4da',
        borderRadius: '8px',
        boxSizing: 'border-box',
        fontSize: '16px',
        transition: 'border-color 0.3s',
    },
    submitButton: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#007bff', 
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
        marginTop: '10px',
        transition: 'background-color 0.3s',
    },
    loginLinkContainer: {
        marginTop: '25px',
        textAlign: 'center',
        fontSize: '14px',
        color: '#6c757d',
    },
    link: {
        color: '#007bff',
        textDecoration: 'none',
        marginLeft: '5px',
        fontWeight: '500',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginBottom: '15px',
    }
};

export default RegistrasiPengguna;