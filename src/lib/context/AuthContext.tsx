/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    loginAction,
    registerAction,
    logoutAction,
} from "@/app/actions/auth";

interface User {
    _id: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN";
    profileImage?: { url: string };
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
    const searchParams = useSearchParams();

    const redirectUrl = searchParams.get("redirect");

    const [user, setUser] = useState<User | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const sanitizeRedirect = (url: string | null) => {
        if (!url) return null;

        // Prevent external redirects for security
        if (url.startsWith("/") && !url.startsWith("//")) {
            return url;
        }
        return null;
    };

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
            const result = await loginAction(email, password);

            if (!result.success) {
                return Promise.reject(result.message || "Login failed");
            }

            await refreshUser();

            const safeRedirect = sanitizeRedirect(redirectUrl);

            router.push(safeRedirect || "/dashboard");

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const register = async (formData: FormData) => {
        try {
            const result = await registerAction(formData);

            if (!result.success) {
                return Promise.reject(result.message || "Registration failed");
            }

            // After registration → redirect to login with redirect param preserved
            const safeRedirect = sanitizeRedirect(redirectUrl);

            if (safeRedirect) {
                router.push(`/login?redirect=${safeRedirect}`);
            } else {
                router.push("/login");
            }

            return result;
        } catch (error) {
            return Promise.reject(error);
        }
    };

    const logout = async () => {
        try {
            await logoutAction();
        } catch (error) {}

        setUser(null);
        setAuthenticated(false);
        router.push("/");
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
