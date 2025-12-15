import { supabase } from '../lib/supabaseClient';
import { User } from '@supabase/supabase-js';
import { AuthContext } from './useAuth';
import React, { useState, useEffect, ReactNode, useContext } from 'react';

// --- Definisi Tipe Data ---

// Tipe data untuk AuthContext Value
interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

// Tipe data untuk Props AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// --- Context dan Hook ---

// Hook untuk kemudahan penggunaan AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// --- Provider Component ---

    const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fungsi untuk memuat sesi awal
        const loadSession = async () => {
             // Mengambil sesi saat ini
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setLoading(false);
        };
        
        loadSession();


        // Mendengarkan perubahan state autentikasi (login, logout, token refresh)
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                // Saat ada perubahan, update state user
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        // Cleanup listener saat komponen di-unmount
        return () => {
            if (listener?.subscription) {
                listener.subscription.unsubscribe();
            }
        };
    }, []);

    // Fungsi untuk logout
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error('Error saat logout:', error.message);
        }
    };

    const value: AuthContextType = {
        user,
        loading,
        signOut, 
    };

    return (
        <AuthContext.Provider value={value}>
            {/* Hanya render children setelah loading selesai untuk menghindari flicker */}
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;