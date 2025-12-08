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
    accessToken: string;  
    refreshToken: string; 
  };
}

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

    console.log(data);


    if (!response.ok || !data.success || !data.data) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }




    const cookieStore = await cookies();

    // 1. Set Access Token
    if (data.data.accessToken) {
      cookieStore.set("accessToken", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: "lax", 
        path: "/",
        maxAge: 30 * 24 * 60 * 60 
      });
    }

    if (data.data.refreshToken) {
      cookieStore.set("refreshToken", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 30 * 24 * 60 * 60, 
      });
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

        if (!response.ok || !data.success || !data.data) {
            return {
                success: false,
                message: data.message || "Registration failed",
            };
        }

        const cookieStore = await cookies();

        if (data.data.accessToken) {
            cookieStore.set("accessToken", data.data.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60, 
            });
        }
        
        if (data.data.refreshToken) {
             cookieStore.set("refreshToken", data.data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 30 * 24 * 60 * 60, 
            });
        }

        return {
            success: true,
            message: data.message,
            data: data.data,
        };
    } catch (error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "An error occurred",
        };
    }
}

export async function logoutAction(): Promise<{ success: boolean; message: string }> {

  const cookieStore = await cookies();
  
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");

  return { success: true, message: "Logged out successfully" };
}