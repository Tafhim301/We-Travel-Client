/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  BadgeCheck,
  MapPin,
  Plane,
  Star,
  CalendarDays,
  MessageSquareQuote,
  LayoutGrid,
  Globe2,
  UserCheck,
  Pencil
} from "lucide-react";


import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TravelCard } from "@/components/shared/TravelCard";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import { useAuth } from "@/lib/context/AuthContext";
import { EditProfileDialog } from "@/components/modules/Profile/EditProfileDialog";

interface IUserProfile {
  user: any;
  travelPlans: any[];
}


const StatCard = ({ icon: Icon, label, value, subtext }: { icon: any, label: string, value: string | number, subtext?: string }) => (
  <Card className="border-none shadow-sm bg-secondary/30">
    <CardContent className="p-4 flex items-center gap-4">
      <div className="p-3 rounded-full bg-background shadow-sm">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground font-medium mt-1">{label}</p>
        {subtext && <p className="text-xs text-muted-foreground/60">{subtext}</p>}
      </div>
    </CardContent>
  </Card>
);

export default function PublicProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { user: currentUser } = useAuth();

  const fetchProfileData = () => {
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  const { user, travelPlans } = data;
  const isPremium = user?.subscription?.isPremium;
  const isOwner = currentUser?._id === user?._id;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. Hero / Banner Section */}
      <div className="relative h-48 md:h-64 bg-linear-to-r from-primary/60 to-cyan-700 w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/10 pattern-grid-lg opacity-20" /> {/* Optional overlay pattern */}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative -mt-20 md:-mt-24 mb-8 flex flex-col md:flex-row items-start gap-6">

          {/* Profile Image with Ring */}
          <div className="relative shrink-0">
            <div className="relative rounded-full p-1.5 bg-background shadow-xl">
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-2 border-background">
                <AvatarImage src={user.profileImage?.url} className="object-cover" />
                <AvatarFallback className="text-4xl bg-muted">{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            {isPremium && (
              <div className="absolute bottom-4 right-4 bg-primary text-white rounded-full p-1.5 shadow-md border-2 border-background" title="Premium Member">
                <BadgeCheck className="h-6 w-6" />
              </div>
            )}
          </div>

          {/* User Info Block */}
          <div className="pt-2 md:pt-24 flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">{user.name}</h1>
                  {isPremium && (
                    <Badge variant="default" className="bg-blue-600 hover:bg-blue-700">
                      Verified Traveler
                    </Badge>
                  )}
                </div>
                <p className="text-base text-muted-foreground mt-2 max-w-2xl leading-relaxed">
                  {user.bio || "No bio provided."}
                </p>
              </div>

              {/* Edit Profile Button - Only for owner */}
              {isOwner && (
                <Button
                  onClick={() => setEditDialogOpen(true)}
                  size="lg"
                  className="gap-2 shadow-md hover:shadow-lg transition-shadow"
                >
                  <Pencil className="w-4 h-4" />
                  Edit Profile
                </Button>
              )}
            </div>

            {/* Meta Data Row */}
            <div className="flex flex-wrap gap-4 md:gap-8 mt-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500" />
                {user.currentLocation || "Location N/A"}
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-blue-500" />
                Visited {user.visitedCountries.length} countries
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                {user.averageRating ? Number(user.averageRating).toFixed(1) : "New"} Rating
                <span className="text-muted-foreground/60 font-normal">({user.totalReviewsReceived} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-green-500" />
                {user.isActive ? "Active Now" : "Offline"}
              </div>
            </div>

            {/* Interests Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {user.interests?.map((i: any) => (
                <Badge key={i._id} variant="secondary" className="px-3 py-1 bg-secondary/50 hover:bg-secondary">
                  #{i.name}
                </Badge>
              ))}
            </div>

            {/* Visited Countries */}
            {user.visitedCountries && user.visitedCountries.length > 0 && (
              <div className="mt-6 p-4 rounded-lg border bg-muted/30">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-blue-500" />
                  Countries Visited ({user.visitedCountries.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.visitedCountries.map((country: string, idx: number) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="px-3 py-1.5 font-medium bg-background hover:bg-muted transition-colors"
                    >
                      🌍 {country}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-8" />

        {/* 2. Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <StatCard icon={Plane} label="Trips Hosted" value={travelPlans.length} />
          <StatCard icon={MessageSquareQuote} label="Reviews" value={user.totalReviewsReceived} />
          <StatCard icon={Star} label="Avg Rating" value={user.averageRating || "N/A"} />
          <StatCard icon={CalendarDays} label="Joined" value={new Date().getFullYear()} subtext="Member since" />
        </div>

        {/* 3. Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Travel Plans (Takes up 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <LayoutGrid className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Travel Plans</h2>
            </div>

            {travelPlans.length === 0 ? (
              <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                <Plane className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No active travel plans yet.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-6">
                {travelPlans.map(plan => (
                  <TravelCard key={plan._id} plan={plan} currentUser={currentUser} />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Reviews */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <MessageSquareQuote className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">Reviews ({user.reviewsReceived.length})</h2>
            </div>

            {user.reviewsReceived.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No reviews received yet.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {user.reviewsReceived.map((review: any) => (
                  <Card key={review._id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2 flex flex-row items-start gap-3 space-y-0">

                      <Avatar className="w-10 h-10 border">
                        <AvatarImage src={review.reviewer?.profileImage?.url} />
                        <AvatarFallback>{review.reviewer?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-sm">{review.reviewer?.name || "Unknown User"}</h4>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded text-xs text-yellow-700 dark:text-yellow-400 font-bold">
                            <Star className="w-3 h-3 mr-1 fill-current" />
                            {review.rating}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Verified Traveler</p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        &quot;{review.comment}&quot;
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      {isOwner && (
        <EditProfileDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          user={user}
          onSuccess={fetchProfileData}
        />
      )}
    </div>
  );
}