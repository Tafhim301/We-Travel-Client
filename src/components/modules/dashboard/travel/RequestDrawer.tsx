/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import Link from "next/link";

interface RequestsDrawerProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  planId: string;
}

export function RequestsDrawer({
  open,
  onOpenChange,
  planId,
}: RequestsDrawerProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const fetchRequests = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-requests?travelPlan=${planId}`,
          { credentials: "include" }
        );
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        setRequests(json.data.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [open, planId]);

  const updateStatus = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-requests/${action}/${id}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setRequests((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: json.data.status } : r
        )
      );

      toast.success(`Request ${action}ed`);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Travel Requests</SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-80px)] mt-4 pr-3">
          {loading && (
            <p className="text-muted-foreground text-sm">Loading requests…</p>
          )}

          {!loading && requests.length === 0 && (
            <p className="text-muted-foreground text-sm">
              No one has applied yet.
            </p>
          )}

          <div className="space-y-4 px-5" >
            {requests.map((req) => (
              <div
                key={req._id}
                className="flex gap-3 rounded-xl border p-4 bg-background border-primary"
              >
                <Image
                  src={req.requester.profileImage?.url || "/avatar.png"}
                  alt={req.requester.name}
                  className="rounded-full object-cover w-14 h-14 border-3 mt-5 border-primary"
                  width={48}
                  height={48}
                  />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{req.requester.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {req.requester.bio || "No bio"}
                      </p>
                    </div>
                    <Badge variant="outline">{req.status}</Badge>
                  </div>

                  <div className="flex gap-2 mt-3">
                     <Link href={`/dashboard/profile/${req.requester._id}`}> <Button
                      size="sm"
                      variant="outline"
                   
                    >
                      View Profile
                    </Button>     </Link>

                    {req.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateStatus(req._id, "approve")}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => updateStatus(req._id, "reject")}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
