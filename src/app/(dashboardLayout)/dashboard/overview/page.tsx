"use client";;
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";


import {
  CreditCard,
  Map,
  Send,
  Inbox,
  Star,
  CalendarDays,
  ShieldCheck,
  ArrowUpRight,
  Wallet,
  AlertCircle,
} from "lucide-react";

import { DashboardOverviewSkeleton } from "@/components/skeleton/DashboardOverviewSkeleton";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
type DashboardData = {
  user: {
    name: string;
    email: string;
    role: string;
    profileImage: { url: string };
    averageRating: number;
    totalReviewsReceived: number;
    subscription: { isPremium: boolean };
    bio: string;
    interests: string[];
    createdAt: string;
  };

  travelActivity: {
    totalPlans: number;
    sentRequests: number;
    receivedRequests: number;
    totalReviewsGiven: number;
    totalReviewsReceived: number;
  };

  subscription: {
    hasActive: boolean;
    type: string;
    expiresAt?: string;
    daysRemaining?: number;
  };

  recentTravelsByYou: Array<{
    _id: string;
    destination: string;
    startDate: string;
    endDate: string;
    status: "ACTIVE" | "COMPLETED";
  }>;

  recentCommunityTravels: Array<{
    _id: string;
    destination: string;
    authorName: string;
    createdAt: string;
  }>;
};


export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/me/dashboard`,
          { credentials: "include" }
        );
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        setData(json.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <DashboardOverviewSkeleton />;
  }

  if (!data) return null;

  const {
    user,
    travelActivity,
    subscription,
    recentTravelsByYou,
    recentCommunityTravels,
  } = data;



  const isProfileComplete = user.bio && user.interests.length > 0;

  const subProgress = subscription.daysRemaining ? Math.min((subscription?.daysRemaining / 365) * 100, 100) : 100;

  return (
    <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">

      <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-background border border-border p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
              <AvatarImage src={user.profileImage?.url} alt={user.name} className="object-cover" />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user.name}!</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> {user.role}
                </span>
                <Separator orientation="vertical" className="h-3" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                  {user.averageRating > 0 ? user.averageRating : "No ratings"}
                  <span className="text-muted-foreground ml-1">({user.totalReviewsReceived})</span>
                </Badge>
                {!isProfileComplete && (
                  <Badge variant="outline" className="border-orange-500/50 text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20">
                    <AlertCircle className="h-3 w-3 mr-1" /> Complete Profile
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
        <Link href="/dashboard/create-travel-plan"><Button className="w-full md:w-auto shadow-sm">
              Create Plan <ArrowUpRight className="ml-2 h-4 w-4" />
            </Button></Link>
           
          </div>
        </div>

        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* LEFT COLUMN: Stats & Activity (Span 2) */}
        <div className="md:col-span-2 space-y-6">

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Plans"
              value={travelActivity.totalPlans}
              icon={Map}
              description="Active itineraries"
            />
            <StatCard
              title="Sent"
              value={travelActivity.sentRequests}
              icon={Send}
              description="Requests sent"
            />
            <StatCard
              title="Received"
              value={travelActivity.receivedRequests}
              icon={Inbox}
              description="Requests pending"
            />
            <StatCard
              title="Reviews"
              value={travelActivity.totalReviewsGiven}
              icon={Star}
              description="Given by you"
            />
          </div>


          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Recent Travels by You</CardTitle>
              <CardDescription>Your recently created travel plans.</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentTravelsByYou.slice(0, 5).map(travel => (
                    <TableRow key={travel._id}>
                      <TableCell className="font-medium">
                        {travel.destination}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(travel.startDate).toLocaleDateString()} –{" "}
                        {new Date(travel.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={travel.status === "ACTIVE" ? "default" : "secondary"}>
                          {travel.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Recently Added Travels</CardTitle>
              <CardDescription>Latest travel plans from the community.</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>Posted By</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentCommunityTravels.slice(0, 5).map(travel => (
                    <TableRow key={travel._id}>
                      <TableCell>{travel.destination}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {travel.authorName}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(travel.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>


        </div>


        <div className="space-y-6">

          {/* Subscription Card - Highlighted */}
          <Card className="overflow-hidden border-primary/20 shadow-md">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CreditCard className="w-32 h-32 text-primary rotate-12" />
            </div>
            <CardHeader className="bg-linear-to-br from-primary/10 to-transparent pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {subscription.type === 'premium' ? 'Premium Plan' : 'Free Plan'}
                    {user.subscription.isPremium && <Badge className="bg-linear-to-r from-yellow-400 to-orange-500 text-white border-0">PRO</Badge>}
                  </CardTitle>
                  <CardDescription>
                    {subscription.hasActive ? subscription.daysRemaining : "Infinite"} days remaining
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Usage</span>


                    <span>{user.subscription.isPremium ? Math.round(subProgress) : "N/A"}%</span>
                  </div>
                  <Progress value={subProgress} className="h-2" />
                </div>

                <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                  {subscription.hasActive && (
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">Expires on:</span>
                      <span className="font-medium ml-auto">
                        {new Date(subscription.expiresAt!).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Wallet className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">Renewal:</span>
                    <span className="font-medium ml-auto">৳2,999.99</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 p-4">
              <Link href={"/subscriptions"}>  <Button variant="default" className="w-full">Manage Subscription</Button></Link>
            </CardFooter>
          </Card>

          {/* Quick Navigation / Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button variant="outline" className="justify-start h-10">
                <Map className="mr-2 h-4 w-4" /> My Travel Plans
              </Button>
              <Button variant="outline" className="justify-start h-10">
                <Inbox className="mr-2 h-4 w-4" /> Requests ({travelActivity.receivedRequests})
              </Button>
              <Button variant="outline" className="justify-start h-10">
                <ShieldCheck className="mr-2 h-4 w-4" /> Security Settings
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}


function StatCard({
  title,
  value,
  icon: Icon,
  description
}: {
  title: string;
  value: number;
  icon: any;
  description: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <Icon className="h-4 w-4 text-primary/70" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}