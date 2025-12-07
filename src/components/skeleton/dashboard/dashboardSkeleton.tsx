"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32 rounded-md" />
        <Skeleton className="h-8 w-10 rounded-full" />
      </div>

      {/* Search Bar */}
      <Skeleton className="h-10 w-full rounded-lg" />

      {/* Sidebar Sections */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40 rounded-md" />

        <div className="space-y-3 pl-4">
          <Skeleton className="h-5 w-32 rounded-sm" />
          <Skeleton className="h-5 w-28 rounded-sm" />
          <Skeleton className="h-5 w-36 rounded-sm" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-36 rounded-md" />

        <div className="space-y-3 pl-4">
          <Skeleton className="h-5 w-40 rounded-sm" />
          <Skeleton className="h-5 w-32 rounded-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    </div>
  );
}
