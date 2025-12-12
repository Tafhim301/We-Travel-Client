"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Image as ImageIcon, X } from "lucide-react";
import Image from "next/image";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    currentLocation: z.string().optional(),
    bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
    interests: z.array(z.string()).optional(),
    visitedCountries: z.array(z.string()).optional(),
    image: z.instanceof(File).optional(),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

interface EditProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: {
        _id: string;
        name: string;
        currentLocation?: string;
        bio?: string;
        interests?: Array<{ _id: string; name: string }>;
        visitedCountries?: string[];
        profileImage?: { url: string };
    };
    onSuccess: () => void;
}

export function EditProfileDialog({
    open,
    onOpenChange,
    user,
    onSuccess,
}: EditProfileDialogProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fetchedInterests, setFetchedInterests] = useState<
        Array<{ _id: string; name: string }>
    >([]);
    const [loadingInterests, setLoadingInterests] = useState(true);
    const [showAllInterests, setShowAllInterests] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countriesInput, setCountriesInput] = useState<string>(
        user?.visitedCountries?.join(", ") || ""
    );

    const form = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        defaultValues: {
            name: user?.name || "",
            currentLocation: user?.currentLocation || "",
            bio: user?.bio || "",
            interests: user?.interests?.map((i) => i._id) || [],
            visitedCountries: user?.visitedCountries || [],
            image: undefined,
        },
    });

    // Fetch interests from backend
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/interests/`);
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

    const interestsToShow = showAllInterests
        ? fetchedInterests
        : fetchedInterests.slice(0, 8);

    const onSubmit = async (data: UpdateProfileSchema) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();

            const payload = {
                body: {
                    name: data.name,
                    bio: data.bio || "",
                    interests: data.interests || [],
                    visitedCountries: data.visitedCountries || [],
                    currentLocation: data.currentLocation || "",
                },
            };

            formData.append("data", JSON.stringify(payload));

            if (data.image instanceof File) {
                formData.append("profileImage", data.image);
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const json = await res.json();

            if (!res.ok || !json.success) {
                toast.error(json?.message || "Update failed");
                return;
            }

            toast.success(json.message || "Profile updated successfully");
            onOpenChange(false);
            onSuccess();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            toast.error(message || "Unexpected error occurred");
        } finally {
            setIsSubmitting(false);
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

    const handleRemoveImage = (onChange: (file: File | undefined) => void) => {
        setPreview(null);
        onChange(undefined);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[92vh] p-0 gap-0">
                <DialogHeader className="px-8 pt-8 pb-6 space-y-3 border-b bg-muted/30">
                    <DialogTitle className="text-3xl font-bold tracking-tight">Edit Profile</DialogTitle>
                    <DialogDescription className="text-base">
                        Update your profile information and travel preferences
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[calc(92vh-180px)] px-8 py-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 py-6">
                            {/* Profile Image */}
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem className="space-y-4">
                                        <FormLabel className="text-base font-semibold">Profile Picture</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-xl border-2 border-dashed bg-muted/20 hover:bg-muted/40 transition-colors">
                                                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-background shadow-lg ring-2 ring-primary/10">
                                                    {preview ? (
                                                        <Image
                                                            src={preview}
                                                            alt="Preview"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : user?.profileImage?.url ? (
                                                        <Image
                                                            src={user.profileImage.url}
                                                            alt="Current"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
                                                            <ImageIcon className="w-10 h-10 text-muted-foreground/60" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex-1 space-y-3 w-full">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="cursor-pointer file:mr-4 file:py-2.5 file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:transition-colors"
                                                        onChange={(e) => handleImageChange(e, onChange)}
                                                        {...field}
                                                        value={undefined}
                                                    />
                                                    {(preview || user?.profileImage?.url) && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleRemoveImage(onChange)}
                                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                        >
                                                            <X className="w-4 h-4 mr-2" />
                                                            Remove Image
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Name & Location Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">
                                                Full Name<span className="text-destructive ml-1">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="John Doe"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="currentLocation"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-semibold">Current Location</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Dhaka, Bangladesh"
                                                    className="h-11"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Bio */}
                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">About You</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell us about yourself, your travel experiences, and what kind of adventures you're looking for..."
                                                className="resize-none min-h-[120px] leading-relaxed"
                                                {...field}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            {field.value?.length || 0} / 500 characters
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Interests */}
                            <FormField
                                control={form.control}
                                name="interests"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel className="text-base font-semibold">Travel Interests</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Select your interests to connect with like-minded travelers
                                            </p>
                                        </div>
                                        <FormControl>
                                            <div className="space-y-4">
                                                {loadingInterests ? (
                                                    <div className="flex items-center justify-center gap-3 text-muted-foreground py-8">
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        <span className="text-sm">Loading interests...</span>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex flex-wrap gap-2.5 p-4 rounded-lg border bg-muted/30">
                                                            {interestsToShow.map((interest) => {
                                                                const isSelected = field.value?.includes(interest._id);
                                                                return (
                                                                    <Badge
                                                                        key={interest._id}
                                                                        variant={isSelected ? "default" : "outline"}
                                                                        className="cursor-pointer hover:scale-105 transition-all px-4 py-2 text-sm font-medium"
                                                                        onClick={() => {
                                                                            const current = field.value || [];
                                                                            if (isSelected) {
                                                                                field.onChange(
                                                                                    current.filter((id) => id !== interest._id)
                                                                                );
                                                                            } else {
                                                                                field.onChange([...current, interest._id]);
                                                                            }
                                                                        }}
                                                                    >
                                                                        {interest.name}
                                                                    </Badge>
                                                                );
                                                            })}
                                                        </div>
                                                        {fetchedInterests.length > 8 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => setShowAllInterests(!showAllInterests)}
                                                                className="w-full"
                                                            >
                                                                {showAllInterests ? "Show Less ↑" : `Show All (${fetchedInterests.length - 8} more) ↓`}
                                                            </Button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Visited Countries */}
                            <FormField
                                control={form.control}
                                name="visitedCountries"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="space-y-2">
                                            <FormLabel className="text-base font-semibold">Countries Visited</FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                Enter countries separated by commas (e.g., Japan, Thailand, France)
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Japan, Thailand, France, Italy, Spain..."
                                                className="min-h-[100px] leading-relaxed"
                                                value={countriesInput}
                                                onChange={(e) => {
                                                    const inputValue = e.target.value;
                                                    setCountriesInput(inputValue);

                                                    // Only update the form field value with parsed array
                                                    const countries = inputValue
                                                        .split(",")
                                                        .map((c) => c.trim())
                                                        .filter(Boolean);
                                                    field.onChange(countries);
                                                }}
                                                onBlur={() => {
                                                    // Clean up on blur
                                                    const countries = countriesInput
                                                        .split(",")
                                                        .map((c) => c.trim())
                                                        .filter(Boolean);
                                                    field.onChange(countries);
                                                    setCountriesInput(countries.join(", "));
                                                }}
                                            />
                                        </FormControl>
                                        {field.value && field.value.length > 0 && (
                                            <p className="text-xs text-muted-foreground">
                                                {field.value.length} {field.value.length === 1 ? 'country' : 'countries'} added
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                    className="h-11 px-8"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-11 px-8"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        "Save Changes"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
