"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { toast } from "sonner";

type DashboardData = {
  user: any;
  travelActivity: any;
  subscription: any;
  recentPayments: any[];
};

export default function Overview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/me/dashboard`,
          {
            credentials: "include", // ✅ browser sends cookies
          }
        );

        const json = await res.json();

        if (!res.ok || !json.success) {
          throw new Error(json.message || "Failed to load dashboard");
        }

        setData(json.data);
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="text-muted-foreground">Loading dashboard...</p>;
  }

  if (!data) return null;

  const { user, travelActivity, subscription, recentPayments } = data;

  return (
    <div className="space-y-8">
      {/* USER INFO */}
      <Card>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
          <Image
            src={user.profileImage?.url || "/avatar-placeholder.png"}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full object-cover border"
          />

          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>

            <div className="flex gap-2 mt-3">
              <Badge variant="secondary">{user.role}</Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {user.averageRating} ({user.totalReviewsReceived} reviews)
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Travel Plans" value={travelActivity.totalPlans} />
        <StatCard label="Requests Sent" value={travelActivity.sentRequests} />
        <StatCard label="Requests Received" value={travelActivity.receivedRequests} />
        <StatCard label="Reviews Given" value={travelActivity.totalReviewsGiven} />
      </div>

      {/* SUBSCRIPTION */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription</CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <p className="text-lg font-medium capitalize">{subscription.type}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Expires</p>
            <p className="text-lg font-medium">
              {new Date(subscription.expiresAt).toLocaleDateString()}
            </p>
          </div>

          <Badge className="h-fit w-fit px-4 py-1">
            {subscription.daysRemaining} days left
          </Badge>
        </CardContent>
      </Card>

      {/* PAYMENTS */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {recentPayments.slice(0, 5).map((payment) => (
            <div key={payment._id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{payment.transactionId}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(payment.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">৳{payment.amount}</p>
                  <Badge
                    variant={payment.paymentStatus === "PAID" ? "default" : "destructive"}
                  >
                    {payment.paymentStatus}
                  </Badge>
                </div>
              </div>

              <Separator className="mt-4" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardContent className="p-6">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}
