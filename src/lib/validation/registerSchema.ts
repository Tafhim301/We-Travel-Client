import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(5, "Name must be at least 5 characters"),

  email: z.string().email("Invalid email address"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  bio: z.string().max(300).optional(),

  interests: z.array(z.string()).optional(),

  visitedCountries: z.array(z.string()).optional(),

  currentLocation: z.string().optional(),

  confirmPassword: z.string(),    

  image: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type RegisterSchema = z.infer<typeof registerSchema>;
