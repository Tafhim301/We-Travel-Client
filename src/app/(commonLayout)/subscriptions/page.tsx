/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Check, Zap, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";


type SubscriptionType = "monthly" | "yearly";

interface PricingTier {
  title: string;
  price: string;
  description: string;
  features: string[];
  type?: SubscriptionType;
  highlighted?: boolean;
  buttonText: string;
  icon: React.ReactNode;
}



export default function Subscriptions() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const {user} = useAuth();

  const handleSubscription = async (type: SubscriptionType) => {
    if (!user) {
      toast.error("You must be logged in to subscribe!");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payment/init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ subscriptionType: type }),
        }
      );

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message || "Payment init failed");

      const data = json.data; 

      if (data?.paymentUrl) {
       
        router.push(data.paymentUrl);
      }
    } catch (error: any) {
      console.error("Subscription Init Failed:", error);
      toast.error(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const plans: PricingTier[] = [
    {
      title: "Explorer",
      price: "Free",
      description: "Perfect for planning your first adventure.",
      icon: <MapPin className="w-6 h-6 text-slate-500" />,
      buttonText: "Current Plan",
      features: [
        "Create basic travel plans",
        "View public profiles",
        "Basic search filters",
        "Limited daily matches",
      ],
    },
    {
      title: "Nomad Premium",
      price: "৳499.99",
      description: "For active travelers seeking companions.",
      type: "monthly",
      highlighted: true,
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      buttonText: "Subscribe Monthly",
      features: [
        "Everything in Free",
        "Verified Blue Badge",
        "Unlimited Matches",
        "Priority Search Listing",
        "Ad-free Experience",
      ],
    },
    {
      title: "Global Legend",
      price: "৳2499.99",
      description: "Best value for year-round adventurers.",
      type: "yearly",
      highlighted: true,
      icon: <Globe className="w-6 h-6 text-indigo-400" />,
      buttonText: "Subscribe Yearly",
      features: [
        "All Premium Features",
        "Save ৳3,500/year (Best Value)",
        "Early Access to Events",
        "Premium Profile Themes",
        "VIP Support",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <Badge variant="outline" className="px-4 py-1 text-sm border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 mb-4">
          Upgrade your Journey
        </Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Travel Better, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Connect Faster</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Unlock the full potential of Travel Buddy. Get verified, find companions instantly, and travel without limits.
        </p>
      </div>

      {/* Subscription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl w-full">
        {plans.map((plan, index) => (
          <div key={index} className="relative group">
            {plan.highlighted && (
              <div className="absolute -inset-0.5 bg-linear-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
            )}
            <Card className={cn(
              "relative h-full flex flex-col border-slate-200 dark:border-slate-800 transition-all duration-300",
              plan.highlighted
                ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-xl scale-100 md:scale-105 z-10"
                : "bg-white dark:bg-slate-900 shadow-sm hover:shadow-md"
            )}>
              <CardHeader>
                <div className="flex justify-between items-center mb-4">
                  <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800">{plan.icon}</div>
                  {plan.type === "yearly" && (
                    <Badge className="bg-gradient-to-r from-orange-400 to-pink-500 border-0">Best Value</Badge>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.title}</CardTitle>
                <CardDescription className="mt-2 text-slate-500 dark:text-slate-400">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  {plan.price !== "Free" && <span className="text-slate-500 ml-2">/{plan.type === "monthly" ? "mo" : "yr"}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={cn(
                    "w-full h-12 text-md font-medium transition-all duration-300",
                    plan.highlighted
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                  )}
                  disabled={!plan.type || loading}
                  onClick={() => plan.type && handleSubscription(plan.type)}
                >
                  {loading && plan.highlighted ? "Processing..." : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
