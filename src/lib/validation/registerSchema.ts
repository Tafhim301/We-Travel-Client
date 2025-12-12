import z from "zod";
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name is too short" })
    .max(50, { message: "Name is too long" }),

  email: z.string().email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .refine((val) => /[A-Z]/.test(val), {
      message: "Password must contain at least one uppercase letter",
    })
    .refine((val) => /[^a-zA-Z0-9]/.test(val), {
      message: "Password must contain at least one special character",
    })
    .refine((val) => /\d/.test(val), {
      message: "Password must contain at least one number",
    }),

  bio: z.string().max(200).optional(),

  interests: z.array(z.string()).optional(),

  visitedCountries: z.array(z.string()).optional(),

  currentLocation: z.string().optional(),

  confirmPassword: z.string(),

  image: z
    .any()
    .optional()
    .refine(
      (file) => {
        if (!file) return true; // Allow no file
        if (!(file instanceof File)) return true; // Skip if not a file
        return file.size <= 3 * 1024 * 1024; // 3MB limit
      },
      { message: "Image must be less than 3MB" }
    ),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;