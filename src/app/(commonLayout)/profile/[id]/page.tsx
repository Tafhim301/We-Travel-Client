/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BadgeCheck, MapPin, Plane, Star } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TravelCard } from "@/components/shared/TravelCard";
import ProfileSkeleton from "@/components/skeleton/ProfileSkeleton";
import ProfileStat from "@/components/ui/profileStat";

interface IUserProfile {
  user: any;
  travelPlans: any[];
}

export default function PublicProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<IUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  console.log(data)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`)
      .then(res => res.json())
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProfileSkeleton />;
  if (!data) return null;

  const { user, travelPlans } = data;
  const isPremium = user?.subscription?.isPremium;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10 mt-30">
     
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="relative">
          <Image
            src={user.profileImage?.url}
            alt={user.name}
            width={120}
            height={120}
            className="rounded-full object-cover border w-24 h-24"
          />

          {isPremium && (
            <div className="absolute bottom-1 right-1 bg-primary rounded-full p-1">
              <BadgeCheck className="h-5 w-5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {isPremium && (
              <Badge className="bg-primary text-primary-foreground">
                Verified
              </Badge>
            )}
          </div>

          <p className="text-muted-foreground mt-1">{user.bio}</p>

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
            <div><div><span className="flex flex-row gap-1 items-center"> <MapPin className="text-red-600"></MapPin> {user.currentLocation}</span></div></div>
            <div><div><span className="flex flex-row gap-1 items-center"><Plane className="text-blue-600" /> Visited {user.visitedCountries.length} countries</span></div></div>
            <div><div><span className="flex flex-row gap-1 items-center"><Star className="text-yellow-400"></Star> {!user.averageRating ? "Not Rated Yet" : user.averageRating || 0} </span></div></div>
          </div>
        </div>
         
      </div>
          <div>
        <h2 className="text-lg font-semibold mb-3">Interests</h2>
        <div className="flex flex-wrap gap-2">
          {user.interests.map((i: { name: string , _id : string}) => (
            <Badge key={i._id} variant="secondary">
              {i.name}
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

   
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ProfileStat label="Trips" value={travelPlans.length} />
        <ProfileStat label="Reviews" value={user.totalReviewsReceived} />
        <ProfileStat label="Rating" value={user.averageRating || "0.0"} />
        <ProfileStat label="Status" value={user.isActive} />
      </div>

     
  

      <div>
        <h2 className="text-lg font-semibold mb-4">
          Travel Plans by {user.name}
        </h2>

        {travelPlans.length === 0 ? (
          <p className="text-muted-foreground">No travel plans yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelPlans.map(plan => (
              <TravelCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </div>



    {user.reviewsReceived.length > 0 &&
     <div>
        <h2 className="text-lg font-semibold mb-4">Reviews</h2>

        {user.reviewsReceived.length === 0 ? (
          <p className="text-muted-foreground">
            No reviews yet.
          </p>
        ) : (
          <div className="space-y-4">
            {user.reviewsReceived.map((review: any) => (
              <div
                key={review._id}
                className="p-4 border rounded-xl bg-card"
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">{review.reviewer.name}</p>
                  <span className="text-sm text-muted-foreground">
                    ⭐ {review.rating}
                  </span>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>}
    </div>
  );
}







