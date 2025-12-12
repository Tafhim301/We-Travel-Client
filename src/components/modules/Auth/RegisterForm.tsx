"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    registerSchema,
    RegisterSchema,
} from "@/lib/validation/registerSchema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";

import { Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterForm() {
    const router = useRouter();
    const [preview, setPreview] = useState<string | null>(null);
    const [fetchedInterests, setFetchedInterests] = useState<
        Array<{ _id: string; name: string }>
    >([]);
    const [loadingInterests, setLoadingInterests] = useState(true);
    const [showAll, setShowAll] = useState(false);

    // Toggle Password Views
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Fetch interests from backend
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
                const res = await fetch(`${BACKEND_URL}/interests/`);
                const json = await res.json();
                if (json?.data) {
                    setFetchedInterests(json.data);
                }
            } catch (error) {
                console.error("Failed to fetch interests:", error);
            } finally {
                setLoadingInterests(false);
            }
        };

        fetchInterests();
    }, []);

    const interestsToShow = showAll
        ? fetchedInterests
        : fetchedInterests.slice(0, 5);

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            currentLocation: "",
            bio: "",
            interests: [],
            visitedCountries: [],
            image: undefined,
        },
    });


    const onSubmit = async (data: RegisterSchema) => {
        try {
            const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

            const formData = new FormData();

            const payload = {
                body: {
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    bio: data.bio || "",
                    interests: data.interests || [],
                    visitedCountries: data.visitedCountries || [],
                    currentLocation: data.currentLocation,
                },
            };

            formData.append("data", JSON.stringify(payload));

            if (data.image instanceof File) {
                formData.append("profileImage", data.image);
            }

            const res = await fetch(`${BACKEND_URL}/user/register`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                toast.error(json?.message || "Registration failed");
                return;
            }

            toast.success(json.message || "Account created successfully");
            router.push("/");
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : String(error);
            toast.error(message || "Unexpected error occurred");
        }
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        onChange: (file: File | undefined) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            onChange(file);
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Name */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Full Name<span className="text-red-800 right-2">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Email */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email<span className="text-red-800">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="you@example.com"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Password */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Password<span className="text-red-800">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-gray-500"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Confirm Password */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Confirm Password<span className="text-red-800">*</span>
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showConfirm ? "text" : "password"}
                                        placeholder="Re-enter password"
                                        {...field}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-gray-500"
                                        onClick={() => setShowConfirm((prev) => !prev)}
                                    >
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </FormControl>
                            <FormMessage className="text-red-600  font-semibold text-xs" />
                        </FormItem>
                    )}
                />

                {/* Current Location */}
                <FormField
                    control={form.control}
                    name="currentLocation"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Current Location</FormLabel>
                            <FormControl>
                                <Input placeholder="Dhaka, Bangladesh" {...field} />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Bio */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Short Bio</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell others about yourself..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Interests */}
                <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    {!loadingInterests && fetchedInterests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {interestsToShow.map((interest) => (
                                                <label
                                                    key={interest._id}
                                                    className="flex items-center gap-2 px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4"
                                                        checked={(field.value ?? []).includes(interest._id)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const updated = checked
                                                                ? [...(field.value ?? []), interest._id]
                                                                : (field.value ?? []).filter(
                                                                    (id) => id !== interest._id
                                                                );
                                                            field.onChange(updated);
                                                        }}
                                                    />
                                                    <span className="text-sm">{interest.name}</span>
                                                </label>
                                            ))}

                                            {fetchedInterests.length > 5 && (
                                                <button
                                                    type="button"
                                                    className="text-primary underline text-sm font-medium"
                                                    onClick={() => setShowAll((v) => !v)}
                                                >
                                                    {showAll ? "Show less..." : "Show more..."}
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {loadingInterests
                                                ? "Loading interests..."
                                                : "No interests available"}
                                        </p>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>Select one or more interests.</FormDescription>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Visited Countries */}
                <FormField
                    control={form.control}
                    name="visitedCountries"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Visited Countries</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Japan, Turkey, Indonesia..."
                                    value={field.value?.join(", ") ?? ""}
                                    onChange={(e) => {
                                        const arr = e.target.value
                                            .split(",")
                                            .map((v) => v.trim())
                                            .filter(Boolean);
                                        field.onChange(arr);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                Separate countries with commas.
                            </FormDescription>
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* File Upload */}
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field: { onChange } }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <input
                                        id="file-input"
                                        type="file"
                                        className="hidden"
                                        onChange={(e) => handleImageChange(e, onChange)}
                                    />

                                    <label
                                        htmlFor="file-input"
                                        className="w-full flex items-center justify-center gap-2 h-14 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 transition text-gray-600 font-medium"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        Upload Image
                                    </label>
                                </div>
                            </FormControl>

                            {preview && (
                                <div className="mt-4">
                                    <Image
                                        src={preview}
                                        alt="Preview"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 mx-auto rounded-full object-cover border"
                                    />
                                </div>
                            )}
                            <FormMessage className="text-red-600 text-xs font-semibold" />
                        </FormItem>
                    )}
                />

                {/* Submit */}
                <Button
                    type="submit"
                    className="w-full h-12 text-lg font-medium mt-4"
                    disabled={form.formState.isSubmitting}
                >
                    {form.formState.isSubmitting ? "Creating..." : "Create Account"}
                </Button>
            </form>

            <p className="text-sm text-gray-500 mt-5">
                Already have an account?{" "}
                <Link
                    href={"/auth/login"}
                    className="text-primary underline font-medium"
                >
                    Login here
                </Link>
            </p>
        </Form>
    );
}
