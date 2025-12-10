import { Skeleton } from "../ui/skeleton";


export default function ProfileSkeleton() {
 return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="flex gap-6 items-center">
        <Skeleton className="h-28 w-28 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      <Skeleton className="h-24 w-full" />

      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    </div>
  );
}
