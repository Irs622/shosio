import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
<<<<<<< HEAD
import { supabase } from '../lib/supabaseClient';
=======
import { supabase } from '../lib/supabaseClient'; // Impor supabase client
>>>>>>> f7ce4ff5f9c80c76f8ceb18f18247396dee86e80

const LoginPengguna = () => {
    console.log('LoginPengguna rendered');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Email dan password harus diisi.');
            return;
        }

<<<<<<< HEAD
        try {
            console.log('Attempt login:', email);

            const { data, error: signInError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            console.log('Login response:', data, signInError);
=======
        // --- Logika Autentikasi dengan Supabase ---
        try {
            const { data, error: signInError } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });
>>>>>>> f7ce4ff5f9c80c76f8ceb18f18247396dee86e80

            if (signInError) {
                throw signInError;
            }

            if (data.user) {
                alert('Login Berhasil! Mengarahkan ke Beranda.');
<<<<<<< HEAD
                navigate('/dashboard');
;
            } else {
                setError('Login gagal. Periksa kembali email dan password Anda.');
            }

        } catch (err: any) {
            console.error('Error saat login:', err);

            const errorMessage = err?.message || '';

            if (errorMessage.includes('Email not confirmed')) {
                setError('Akun belum aktif. Silakan cek email Anda untuk verifikasi.');
            } else if (errorMessage.includes('Invalid login credentials')) {
                setError('Email atau password salah.');
            } else {
                setError('Terjadi kesalahan saat mencoba masuk.');
            }
=======
                navigate('/');
            } else {
                setError('Login gagal. Periksa kembali email dan password Anda.');
            }
            
        } catch (err) {
            console.error('Error saat login:', err);
            
            const errorMessage = err.message || "";
            
            if (errorMessage.includes("Email not confirmed")) {
                setError('Akun belum aktif. Silakan cek email Anda untuk verifikasi.');
            } else if (errorMessage.includes("Invalid login credentials")) {
                setError('Email atau password salah.');
            } else {
                setError('Terjadi kesalahan saat mencoba masuk.');
            }
>>>>>>> f7ce4ff5f9c80c76f8ceb18f18247396dee86e80
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.header}>Masuk ke Kolektif</h2>
                {error && <p style={styles.errorText}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.submitButton}>
                        Masuk
                    </button>
                </form>

                <p style={styles.registerLinkContainer}>
                    Belum punya akun?
                    <Link to="/registrasi" style={styles.link}>
                        Daftar di sini
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPengguna;
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
        maxWidth: '380px',
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
    },
    registerLinkContainer: {
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

