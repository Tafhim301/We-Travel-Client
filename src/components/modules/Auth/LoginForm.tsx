"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useAuth } from "@/lib/context/AuthContext";


export default function LoginFields() {
    const { login } = useAuth();

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginSchema) => {
        try {
            await login(data.email, data.password);
            toast.success("Logged in successfully");
            // Redirect is handled by AuthContext login function
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || "Login failed");
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