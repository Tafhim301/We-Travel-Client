/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TravelCard } from "@/components/shared/TravelCard";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import ProfileStat from "@/components/ui/profileStat";
import { useAuth } from "@/lib/context/AuthContext";

import { BadgeCheck, MapPin, Plane, Star } from "lucide-react";
import { motion } from "framer-motion";

interface IUserProfile {
  user: any;
  travelPlans: any[];
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`)
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  const { user, travelPlans } = data;
  const isPremium = user?.subscription?.isPremium;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-14">
      {/* ============================
            PROFILE HEADER SECTION
          ============================ */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl border bg-card shadow-lg">
        <div className="relative">
          <Image
            src={user.profileImage?.url}
            alt={user.name}
            width={140}
            height={140}
            className="rounded-full object-cover border-4 border-primary/20 shadow-lg w-32 h-32"
          />

          {isPremium && (
            <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1.5 shadow-md">
              <BadgeCheck className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {user.name}
            </h1>

            {isPremium && (
              <Badge className="bg-primary text-primary-foreground">
                Premium Traveler
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground text-base">{user.bio}</p>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground pt-3">
            <span className="flex items-center gap-1">
              <MapPin className="text-red-600 w-4 h-4" /> {user.currentLocation}
            </span>

            <span className="flex items-center gap-1">
              <Plane className="text-blue-600 w-4 h-4" /> Visited{" "}
              {user.visitedCountries.length} countries
            </span>

            <span className="flex items-center gap-1">
              <Star className="text-yellow-400 w-4 h-4" />
              {user.averageRating || "Not Rated"}
            </span>
          </div>
        </div>
      </div>

      {/* ============================
               INTERESTS
          ============================ */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-2">Interests</h2>

        <div className="flex flex-wrap gap-2">
          {user.interests.map((i: { name: string; _id: string }) => (
            <Badge
              key={i._id}
              className="text-sm px-3 py-1 bg-muted hover:bg-muted/80"
            >
              {i.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProfileStat label="Trips" value={travelPlans.length} />
        <ProfileStat label="Reviews" value={user.totalReviewsReceived} />
        <ProfileStat label="Rating" value={user.averageRating ?? "0.0"} />
        <ProfileStat label="Status" value={user.isActive} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Travel Plans by {user.name}
        </h2>

        {travelPlans.length === 0 ? (
          <p className="text-muted-foreground">
            No travel plans yet.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlans.map((plan) => (
              <TravelCard
                key={plan._id}
                plan={plan}
                currentUser={currentUser}
              />
            ))}
          </div>
        )}
      </div>

    
      {user.reviewsReceived.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reviews</h2>

          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-primary/50">
            {user.reviewsReceived.map((review: any, idx: number) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="min-w-[260px] sm:min-w-[300px] p-5 border rounded-xl bg-card shadow-md hover:shadow-lg transition-all"
              >
                {/* Reviewer info */}
                <div className="flex items-center gap-3 mb-3">
                  <Image
                    src={review.reviewer.profileImage?.url || "/default-avatar.png"}
                    alt={review.reviewer.name}
                    width={40}
                    height={40}
                    className="rounded-full w-10 h-10 object-cover"
                  />

                  <div>
                    <p className="font-semibold">{review.reviewer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ⭐ {review.rating}
                    </p>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
