/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { loginAction, registerAction, logoutAction } from "@/app/actions/auth";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: {
        url: string;
    };
    currentLocation?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    authenticated: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (formData: FormData) => Promise<any>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

// ---------------------
const AuthContext = createContext<AuthContextType | null>(null);
// ---------------------

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();

    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);


    const refreshUser = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/user/me`, {
                credentials: "include",
            });

            const json = await res.json();

            if (res.ok && json?.data) {
                setUser(json.data);
                setAuthenticated(true);
            } else {
                setUser(null);
                setAuthenticated(false);
            }
        } catch (err) {
            setUser(null);
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // Call server action to handle login and set cookies
            const result = await loginAction(email, password);

            if (!result.success) {
                return Promise.reject(result.message || "Login failed");
            }

            // Refresh user data after successful login
            await refreshUser();
            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const register = async (formData: FormData) => {
        try {
            // Call server action to handle registration and set cookies
            const result = await registerAction(formData);

            if (!result.success) {
                return Promise.reject(result.message || "Registration failed");
            }

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const logout = async () => {
        try {
            // Call server action to clear cookies
            await logoutAction();
        } catch (error) {
            // Ignore logout errors
        }

        setUser(null);
        setAuthenticated(false);
        router.push("/auth/login");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                authenticated,
                login,
                register,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
