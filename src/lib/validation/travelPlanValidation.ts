import z from "zod";

export const TRAVEL_TYPES = [
  "SOLO", "FAMILY", "FRIENDS", "COUPLE", 
  "BUSINESS", "ADVENTURE", "LEISURE", "EXCURSION"
] as const;

export const createTravelPlanFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  continent: z.string().min(1, "Continent is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  destination: z.string().min(1, "Specific destination is required"),

 
  travelType: z.enum(TRAVEL_TYPES, {
    errorMap: () => ({ message: "Please select a travel type" }),
  }),

  startDate: z.date({
    required_error: "Start date is required",
    invalid_type_error: "Start date must be a valid date",
  }),
  
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }),

  
  budgetRange: z.object({
    min: z.coerce.number().min(0, "Min budget must be positive"),
    max: z.coerce.number().min(0, "Max budget must be positive"),
  }).refine((data) => data.max >= data.min, {
    message: "Max budget cannot be less than Min budget",
    path: ["max"],
  }),

  itinerary: z.string().min(10, "Itinerary details are required"),

  maxMembers: z.coerce.number({
    invalid_type_error: "Members must be a number",
  }).min(1, "At least 1 member is required"),


  image: z.any()
    .refine((files) => files?.length > 0, "Main image is required"),

  demoImages: z.any().optional(),
});

export type TravelPlanFormValues = z.infer<typeof createTravelPlanFormSchema>;

export const TravelTypes = TRAVEL_TYPES;