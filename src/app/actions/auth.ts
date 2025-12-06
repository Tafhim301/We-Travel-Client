"use server";

import { cookies } from "next/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api/v1";

interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    profileImage?: {
        url: string;
    };
}

interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: AuthUser;
        accessToken?: string;
        refreshToken?: string;
    };
}

/**
 * Server action to handle login
 * Sends credentials to backend, captures Set-Cookie headers, and sets them as cookies
 */
export async function loginAction(email: string, password: string): Promise<AuthResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data: AuthResponse = await response.json();

        if (!response.ok || !data.success) {
            return {
                success: false,
                message: data.message || "Login failed",
            };
        }

        // Extract Set-Cookie headers from response
        const setCookieHeader = response.headers.get("set-cookie");

        if (setCookieHeader) {
            // Parse and set cookies
            const cookiesList = await cookies();

            // Set-Cookie header can contain multiple cookies separated by comma
            // Format: "name=value; Path=/; HttpOnly; Secure; SameSite=Strict"
            const cookieParts = setCookieHeader.split(",").map((cookie) => cookie.trim());

            for (const cookie of cookieParts) {
                // Parse cookie string
                const parts = cookie.split(";").map((part) => part.trim());
                const [nameValue] = parts;

                if (nameValue) {
                    const [name, value] = nameValue.split("=");
                    const options: {
                        httpOnly?: boolean;
                        secure?: boolean;
                        sameSite?: "strict" | "lax" | "none";
                        maxAge?: number;
                        path?: string;
                    } = {
                        httpOnly: cookie.includes("HttpOnly"),
                        secure: cookie.includes("Secure"),
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60, // 7 days default
                    };

                    // Parse Max-Age if present
                    const maxAgeMatch = cookie.match(/Max-Age=(\d+)/i);
                    if (maxAgeMatch) {
                        options.maxAge = parseInt(maxAgeMatch[1]);
                    }

                    // Parse Path if present
                    const pathMatch = cookie.match(/Path=([^;]+)/);
                    if (pathMatch) {
                        options.path = pathMatch[1];
                    }

                    cookiesList.set(name, value, options);
                }
            }
        }

        return {
            success: true,
            message: data.message,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred during login",
        };
    }
}


export async function registerAction(formData: FormData): Promise<AuthResponse> {
    try {
        const response = await fetch(`${BACKEND_URL}/user/register`, {
            method: "POST",
            body: formData,
        });

        const data: AuthResponse = await response.json();

        if (!response.ok || !data.success) {
            return {
                success: false,
                message: data.message || "Registration failed",
            };
        }

        const setCookieHeader = response.headers.get("set-cookie");

        if (setCookieHeader) {

            const cookiesList = await cookies();

            const cookieParts = setCookieHeader.split(",").map((cookie) => cookie.trim());

            for (const cookie of cookieParts) {
      
                const parts = cookie.split(";").map((part) => part.trim());
                const [nameValue] = parts;

                if (nameValue) {
                    const [name, value] = nameValue.split("=");
                    const options: {
                        httpOnly?: boolean;
                        secure?: boolean;
                        sameSite?: "strict" | "lax" | "none";
                        maxAge?: number;
                        path?: string;
                    } = {
                        httpOnly: cookie.includes("HttpOnly"),
                        secure: cookie.includes("Secure"),
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60, 
                    };

           
                    const maxAgeMatch = cookie.match(/Max-Age=(\d+)/i);
                    if (maxAgeMatch) {
                        options.maxAge = parseInt(maxAgeMatch[1]);
                    }

                    const pathMatch = cookie.match(/Path=([^;]+)/);
                    if (pathMatch) {
                        options.path = pathMatch[1];
                    }

                    cookiesList.set(name, value, options);
                }
            }
        }

        return {
            success: true,
            message: data.message,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred during registration",
        };
    }
}


export async function logoutAction(): Promise<{ success: boolean; message: string }> {
    try {
        const cookiesList = await cookies();

        // Clear common authentication cookies
        cookiesList.delete("accessToken");
        cookiesList.delete("refreshToken");
        cookiesList.delete("token");
        cookiesList.delete("auth");

        // Optional: Call backend logout endpoint if needed
        try {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
            });
        } catch {
            // Ignore backend logout errors
        }

        return {
            success: true,
            message: "Logged out successfully",
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred during logout",
        };
    }
}
