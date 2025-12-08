/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation"; 

import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { createTravelPlanFormSchema, TravelPlanFormValues, TravelTypes } from '@/lib/validation/travelPlanValidation';
import { toast } from "sonner";
import { TravelPlanFormSkeleton } from "@/components/skeleton/TravelPlanFormSkeleton";
import Image from "next/image";

export default function CreateTravelPlanForm() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  

  const [continents, setContinents] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [destinations, setDestinations] = useState<{ _id: string; destination: string }[]>([]);

  // Image Preview State
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [demoImagesPreview, setDemoImagesPreview] = useState<string[]>([]);

  const router = useRouter();

  const date = new Date() 

  const form = useForm<TravelPlanFormValues>({
    resolver: zodResolver(createTravelPlanFormSchema),
    mode: "onSubmit",
    defaultValues: {
      title: "",
      description: "",
      itinerary: "",
      continent: "",
      country: "",
      city: "",
      destination: "",
      travelType: "FAMILY", 
      startDate: date,
      endDate: new Date(date.getTime() + 1000 * 60 * 60 * 24 * 10), 
      maxMembers: 10,
      budgetRange: { min: 0, max: 0 },
    },
  });


  const fetchLocationData = async (endpoint: string, query: string = "") => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/location${endpoint}${query}`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
      const data = await res.json();
      return data.data || [];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    const loadContinents = async () => {
      setIsLoading(true);
      const data = await fetchLocationData("/continents");
      setContinents(data);
      setIsLoading(false);
    };
    loadContinents();
  }, []);

  const handleContinentChange = async (continent: string) => {
    form.setValue("continent", continent);
    // Clear downstream fields
    form.setValue("country", "");
    form.setValue("city", "");
    form.setValue("destination", "");
    setCountries([]); setCities([]); setDestinations([]);
    const data = await fetchLocationData("/countries", `?continent=${continent}`);
    setCountries(data);
  };

  const handleCountryChange = async (country: string) => {
    form.setValue("country", country);
    form.setValue("city", "");
    form.setValue("destination", "");
    setCities([]); setDestinations([]);
    const data = await fetchLocationData("/cities", `?country=${country}`);
    setCities(data);
  };

  const handleCityChange = async (city: string) => {
    form.setValue("city", city);
    form.setValue("destination", "");
    setDestinations([]);
    const data = await fetchLocationData("/destinations", `?city=${city}`);
    setDestinations(data);
  };
  // --- End Fetch Logic ---

  // Image Handlers
  const handleMainImageChange = (files: FileList | null) => {
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => setMainImagePreview(reader.result as string);
      reader.readAsDataURL(files[0]);
    } else {
      setMainImagePreview(null);
    }
  };

  const handleDemoImagesChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const existingFiles = form.getValues("demoImages");
    const dataTransfer = new DataTransfer();
    if (existingFiles) Array.from(existingFiles as FileList).forEach(file => dataTransfer.items.add(file));
    Array.from(files).forEach(file => dataTransfer.items.add(file));
    form.setValue("demoImages", dataTransfer.files); // No need to trigger validation manually usually

    // Previews
    const readers = Array.from(files).map(file => new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    }));
    Promise.all(readers).then(newPreviews => setDemoImagesPreview(prev => [...prev, ...newPreviews]));
  };

  const removeMainImage = () => {
    setMainImagePreview(null);
    form.setValue("image", undefined); // This will trigger "Required" error on submit
  };

  const removeDemoImage = (index: number) => {
    const currentFiles = form.getValues("demoImages");
    if (currentFiles) {
      const dt = new DataTransfer();
      Array.from(currentFiles as FileList).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      form.setValue("demoImages", dt.files);
      setDemoImagesPreview(prev => prev.filter((_, i) => i !== index));
    }
  };

  // --- SUBMIT HANDLER ---
  const onSubmit = async (values: TravelPlanFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      const dataPayload = {
        body: {
          title: values.title,
          description: values.description,
          destination: values.destination,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          itinerary: values.itinerary,
          travelType: values.travelType,
          maxMembers: Number(values.maxMembers),
          budgetRange: {
            min: Number(values.budgetRange.min),
            max: Number(values.budgetRange.max),
          },
        }
      };

      formData.append("data", JSON.stringify(dataPayload));
      // Safe access to image
      if (values.image && values.image.length > 0) {
        formData.append("image", values.image[0]);
      }
      if (values.demoImages && values.demoImages.length > 0) {
        Array.from(values.demoImages as FileList).forEach((file) => 
          formData.append("demoImages", file)
        );
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/travelPlans/`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      // --- BACKEND ERROR HANDLING ---
      // If the Backend returns that JSON array you saw, we catch it here
      if (!res.ok) {
        // Check if data is the array of errors
        const errors = Array.isArray(data) ? data : data.errorSources || data.issues;
        
        if (errors && Array.isArray(errors)) {
          errors.forEach((err: any) => {
            // Map backend error path (e.g. ["title"]) to form field
            const path = err.path.join("."); 
            form.setError(path as any, { message: err.message });
          });
          toast.error("Please fix the errors in the form.");
          return; 
        }
        throw new Error(data.message || "Failed to create travel plan");
      }

      toast.success("Travel plan created successfully!");
      router.push("/dashboard/my-travel-plans");

    } catch (error: any) {
      console.error("Submission Error:", error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Frontend Validation Failed:", errors);
    toast.error("Please fill in all required fields.");
  };

  if (isLoading) return <TravelPlanFormSkeleton />;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-bold mb-6">Create New Travel Plan</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Summer in Tokyo" {...field} />
                </FormControl>
                <FormMessage className="text-red-600 text-xs font-semibold" />
              </FormItem>
            )}
          />

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-md border border-border">
            <FormField
              control={form.control}
              name="continent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Continent</FormLabel>
                  <Select onValueChange={handleContinentChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Continent" /></SelectTrigger></FormControl>
                    <SelectContent>{continents.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <Select onValueChange={handleCountryChange} value={field.value} disabled={!countries.length}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger></FormControl>
                    <SelectContent>{countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <Select onValueChange={handleCityChange} value={field.value} disabled={!cities.length}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select City" /></SelectTrigger></FormControl>
                    <SelectContent>{cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specific Destination</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!destinations.length}>
                    <FormControl><SelectTrigger><SelectValue placeholder={destinations.length ? "Select Location" : "No locations"} /></SelectTrigger></FormControl>
                    <SelectContent>{destinations.map(d => <SelectItem key={d._id} value={d._id}>{d.destination}</SelectItem>)}</SelectContent>
                  </Select>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* Travel Type & Max Members */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="travelType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Travel Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                    <SelectContent>
                      {TravelTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxMembers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Members</FormLabel>
                  <FormControl>
                    {/* Simplified: Removed manual Number() conversion, let z.coerce handle it */}
                    <Input type="number" {...field} />
                  </FormControl>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date()} initialFocus />
                    </PopoverContent>
                  </Popover>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>End Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues("startDate")} initialFocus />
                    </PopoverContent>
                  </Popover>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* Budget */}
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="budgetRange.min"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Min Budget</FormLabel>
                  <FormControl>
                    {/* Simplified: Removed manual Number() conversion */}
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="budgetRange.max"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Budget</FormLabel>
                  <FormControl>
                    {/* Simplified: Removed manual Number() conversion */}
                    <Input type="number" placeholder="1000" {...field} />
                  </FormControl>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Main Cover Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          onChange(e.target.files);
                          handleMainImageChange(e.target.files);
                        }}
                      />
                      {mainImagePreview && (
                        <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                          <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                          <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2" onClick={removeMainImage}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </FormControl>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="demoImages"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Gallery Images</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <Input type="file" accept="image/*" multiple onChange={(e) => handleDemoImagesChange(e.target.files)} />
                      {/* Grid for demo images... kept same as before */}
                      {demoImagesPreview.length > 0 && (
                         <div className="grid grid-cols-3 gap-4">
                            {demoImagesPreview.map((src, i) => (
                               <div key={i} className="relative aspect-square border rounded"><Image src={src} fill className="object-cover" alt="" /><Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeDemoImage(i)}><X className="h-3 w-3"/></Button></div>
                            ))}
                         </div>
                      )}
                    </div>
                  </FormControl>
                       <FormMessage className="text-red-600 text-xs font-semibold" />
                </FormItem>
              )}
            />
          </div>

          {/* Description & Itinerary */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl><Textarea placeholder="Trip details..." {...field} /></FormControl>
                     <FormMessage className="text-red-600 text-xs font-semibold" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="itinerary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Itinerary</FormLabel>
                <FormControl><Textarea className="h-32" placeholder="Day 1..." {...field} /></FormControl>
                     <FormMessage className="text-red-600 text-xs font-semibold" />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? <><Upload className="mr-2 h-4 w-4 animate-spin"/> Creating...</> : "Create Travel Plan"}
          </Button>

        </form>
      </Form>
    </div>
  );
}