"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { loginSchema, LoginSchema } from "@/lib/validation/loginSchama";
import Link from "next/link";


export default function LoginFields() {
    const router = useRouter();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginSchema) => {
        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:5000";
            const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                const message = json?.message || json?.error || "Login failed";
                toast.error(message);
                return;
            }

            try {
                if (json?.data?.accessToken) {
                    localStorage.setItem("accessToken", json.data.accessToken);
                }
                if (json?.data?.refreshToken) {
                    localStorage.setItem("refreshToken", json.data.refreshToken);
                }
            } catch {
                // ignore storage errors
            }

            toast.success(json.message || "Logged in successfully");
            router.push("/");
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || "An unexpected error occurred");
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                {/* Email Field */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button
                    className="w-full h-12 text-base font-medium"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
                </Button>
            </form>

            <p className="text-sm text-gray-400 ">Don&apos;t have an account?      <Link href={'/auth/register'}><span className="text-primary font-semibold underline ">register here</span></Link>
            </p>
        </Form>
    );
}