"use client"

import TravelPlanForm from "@/components/modules/dashboard/travel/TravelPlanForm"

export default function CreateTravelPlan() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Create Travel Plan</h1>
            <TravelPlanForm />
        </div>
    )
}
