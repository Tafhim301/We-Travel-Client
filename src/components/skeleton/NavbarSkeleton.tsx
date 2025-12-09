"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <nav className="fixed top-0 left-0 z-50 w-full py-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

        {/* LOGO */}
        <Skeleton className="h-8 w-32 rounded-md" />

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center space-x-8">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* DESKTOP ACTIONS */}
        <div className="hidden md:flex items-center space-x-4">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>

      </div>
    </nav>
  );
}
