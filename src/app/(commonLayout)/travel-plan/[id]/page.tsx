"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import {
  MapPin,

  Users,
  Star,

  CheckCircle2,
  Clock,
  ShieldCheck,
  Plane
} from "lucide-react";

// UI Components
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";



type TravelPlan = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  demoImages?: string[];
  user?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: { url?: string };
    averageRating?: number;
    totalReviewsReceived?: number;
    bio?: string;
    subscription?: { isPremium?: boolean };
  };
  destination?: string | { destination?: string; city?: string; country?: string };
  travelType?: string;
  visibility?: boolean;
  startDate?: string;
  endDate?: string;
  budgetRange?: { min?: number; max?: number };
  requestedBy?: string[];
  approvedMembers?: string[];
  maxMembers?: number;
  itinerary?: string;
};


const PlanSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
    <div className="h-8 w-32 bg-slate-200 dark:bg-slate-800 rounded mb-6" />
    <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-4" />
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 h-[400px]">
      <div className="md:col-span-2 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="hidden md:block bg-slate-200 dark:bg-slate-800 rounded-xl" />
      <div className="hidden md:block bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
      </div>
      <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  </div>
);

export default function TravelPlanDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [plan, setPlan] = useState<TravelPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    async function fetchPlan() {
      setLoading(true);
      try {
        const res = await fetch(`${backend}/travelPlans/${id}`, {
          method: "GET",
          credentials: "include",
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to fetch plan");
        setPlan(json.data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Network error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchPlan();
  }, [id, backend]);

  if (loading) return <PlanSkeleton />;
  if (error || !plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Plan not found</h1>
          <p className="text-muted-foreground">{error}</p>
          <Link href="/travel-plans"><Button>Return Home</Button></Link>
        </div>
      </div>
    );
  }

  // Derived Data
  const destObj = typeof plan.destination === "object" ? plan.destination : {};
  const formattedStart = plan.startDate ? format(new Date(plan.startDate), "MMM dd") : "TBD";
  const formattedEnd = plan.endDate ? format(new Date(plan.endDate), "MMM dd, yyyy") : "TBD";
  const daysDuration = plan.startDate && plan.endDate 
    ? Math.ceil((new Date(plan.endDate).getTime() - new Date(plan.startDate).getTime()) / (1000 * 3600 * 24)) 
    : 0;
  
  const images = [plan.image, ...(plan.demoImages || [])].filter(Boolean) as string[];
  const currentMembers = plan.approvedMembers?.length ?? 0;
  const maxMembers = plan.maxMembers ?? 10;
  const percentFull = (currentMembers / maxMembers) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 pt-10">
      {/* --- Header Actions --- */}
   

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- Title Section --- */}
        <div className="mb-6 space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{plan.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span className="font-medium text-foreground">
                {destObj.city}, {destObj.country || "Unknown Location"}
              </span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-medium text-foreground">{plan.user?.averageRating?.toFixed(1) || "New"}</span>
              <span>({plan.user?.totalReviewsReceived || 0} reviews)</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="rounded-full px-3 font-normal">
                {plan.travelType || "Adventure"}
              </Badge>
            </div>
          </div>
        </div>

        {/* --- Image Masonry --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 h-[300px] md:h-[450px] rounded-2xl overflow-hidden mb-10">
          <div className="md:col-span-2 h-full relative group">
            <Image 
              src={images[0] || "/placeholder.jpg"} 
              alt="Main" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </div>
          <div className="hidden md:flex flex-col gap-2 md:gap-4 h-full">
            <div className="relative flex-1 group overflow-hidden">
               <Image 
                 src={images[1] || images[0] || "/placeholder.jpg"} 
                 alt="Gallery 2" 
                 fill 
                 className="object-cover transition-transform duration-700 group-hover:scale-105" 
               />
            </div>
            <div className="relative flex-1 group overflow-hidden">
               <Image 
                 src={images[2] || images[0] || "/placeholder.jpg"} 
                 alt="Gallery 3" 
                 fill 
                 className="object-cover transition-transform duration-700 group-hover:scale-105" 
               />
            </div>
          </div>
          <div className="hidden md:block h-full relative group">
            <Image 
              src={images[3] || images[0] || "/placeholder.jpg"} 
              alt="Gallery 4" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-105" 
            />
            {images.length > 4 && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                 <span className="text-white font-semibold text-lg flex items-center gap-2">
                   Show all photos <span className="bg-white/20 px-2 py-0.5 rounded text-sm">{images.length}</span>
                 </span>
              </div>
            )}
          </div>
        </div>

        {/* --- Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT COLUMN: Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Host Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">Hosted by {plan.user?.name}</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{daysDuration} days</span>
                  <span>•</span>
                  <span>{destObj.city}</span>
                  {plan.user?.subscription?.isPremium && (
                     <Badge variant="default" className="ml-2 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 border-0 text-white">
                       Premium Host
                     </Badge>
                  )}
                </div>
              </div>
              <Link href={`/profile/${plan.user?._id}`}>
                <Avatar className="h-16 w-16 border-2 border-background shadow-sm cursor-pointer">
                  <AvatarImage src={plan.user?.profileImage?.url} />
                  <AvatarFallback className="text-lg">{plan.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Link>
            </div>

            <Separator />

            {/* Quick Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="flex gap-4">
                 <ShieldCheck className="h-6 w-6 text-primary mt-1" />
                 <div>
                   <h3 className="font-semibold">Verified Itinerary</h3>
                   <p className="text-sm text-muted-foreground">This plan has been reviewed for safety and accuracy.</p>
                 </div>
               </div>
               <div className="flex gap-4">
                 <Users className="h-6 w-6 text-primary mt-1" />
                 <div>
                   <h3 className="font-semibold">Small Group</h3>
                   <p className="text-sm text-muted-foreground">Limited to {maxMembers} travelers for a better experience.</p>
                 </div>
               </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">About this trip</h3>
              <p className="leading-relaxed text-muted-foreground whitespace-pre-line">
                {plan.description}
              </p>
            </div>

            {/* Itinerary */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Itinerary</h3>
              <Card className="bg-muted/50 border-none">
                <CardContent className="p-6">
                   {plan.itinerary ? (
                     <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                       {plan.itinerary}
                     </div>
                   ) : (
                     <div className="text-center py-8 text-muted-foreground italic flex flex-col items-center gap-2">
                       <Clock className="h-8 w-8 opacity-50" />
                       Itinerary details coming soon.
                     </div>
                   )}
                </CardContent>
              </Card>
            </div>

            {/* Host Bio Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Meet your host</h3>
              <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex flex-col items-center gap-2 min-w-[120px]">
                     <Avatar className="h-24 w-24">
                        <AvatarImage src={plan.user?.profileImage?.url} />
                        <AvatarFallback>{plan.user?.name?.charAt(0)}</AvatarFallback>
                     </Avatar>
                     <div className="flex items-center gap-1 text-sm font-medium">
                        <Star className="h-3 w-3 fill-foreground" />
                        {plan.user?.totalReviewsReceived} Reviews
                     </div>
                  </div>
                  <div className="space-y-3">
                     <p className="text-muted-foreground text-sm italic">
                       &ldquo;{plan.user?.bio || `Hi! I'm ${plan.user?.name}, and I love organizing trips.`}&#34;
                     </p>
                     <Button variant="outline" size="sm">Contact Host</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* RIGHT COLUMN: Sticky Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24">
                <Card className="shadow-lg border-muted/60 overflow-hidden">
                   <CardHeader className="bg-muted/30 pb-4">
                      <div className="flex items-baseline justify-between">
                         <div className="space-y-1">
                            <span className="text-sm text-muted-foreground">Estimated Budget</span>
                            <div className="text-2xl font-bold">
                              ৳{plan.budgetRange?.min?.toLocaleString()} 
                              <span className="text-sm font-normal text-muted-foreground"> - </span> 
                              ৳{plan.budgetRange?.max?.toLocaleString()}
                            </div>
                         </div>
                      </div>
                   </CardHeader>

                   <CardContent className="p-6 space-y-6">
                      {/* Dates Grid */}
                      <div className="grid grid-cols-2 gap-0 border rounded-lg overflow-hidden">
                         <div className="p-3 border-r border-b sm:border-b-0 bg-background hover:bg-muted/20 transition-colors">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Check-in</div>
                            <div className="text-sm font-medium">{formattedStart}</div>
                         </div>
                         <div className="p-3 bg-background hover:bg-muted/20 transition-colors">
                            <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Check-out</div>
                            <div className="text-sm font-medium">{formattedEnd}</div>
                         </div>
                      </div>

                      {/* Members Progress */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="font-medium text-muted-foreground">Group Size</span>
                           <span className="font-semibold">{currentMembers} / {maxMembers} joined</span>
                        </div>
                        <Progress value={percentFull} className="h-2" />
                        {maxMembers - currentMembers <= 3 && maxMembers - currentMembers > 0 && (
                           <p className="text-xs text-amber-600 dark:text-amber-400 font-medium pt-1">
                             Almost full! Only {maxMembers - currentMembers} spots left.
                           </p>
                        )}
                        {currentMembers >= maxMembers && (
                            <p className="text-xs text-red-600 font-medium pt-1">
                                Fully Booked
                            </p>
                        )}
                      </div>
                      
                     
                      <div className="space-y-3 pt-2">
                         <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Plane className="h-4 w-4" />
                            <span>Travel type: {plan.travelType}</span>
                         </div>
                         <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Flexible itinerary</span>
                         </div>
                      </div>
                   </CardContent>

                   <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                      <Button 
                        size="lg" 
                        className="w-full text-lg font-semibold shadow-md"
                        disabled={currentMembers >= maxMembers}
                      >
                         {currentMembers >= maxMembers ? "Join Waitlist" : "Request to Join"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                         You won&rsquo;t be charged yet
                      </p>
                   </CardFooter>
                </Card>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}