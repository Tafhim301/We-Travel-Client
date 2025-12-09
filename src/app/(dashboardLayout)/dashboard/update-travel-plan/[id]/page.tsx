/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { TravelPlanFormSkeleton } from "@/components/skeleton/TravelPlanFormSkeleton";
import { toast } from "sonner";
import CreateTravelPlanForm from "@/components/modules/dashboard/travel/TravelPlanForm";

export default function UpdateTravelPlanPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/travelPlans/${id}`,
          { credentials: "include" }
        );
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        setInitialData(json.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load plan");
      }
    };

    fetchPlan();
  }, [id]);

  if (!initialData) return <TravelPlanFormSkeleton />;

  return (
    <CreateTravelPlanForm
      mode="UPDATE"
      planId={id as string}
      initialData={initialData}
    />
  );
}
