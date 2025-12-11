/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CircleAlert, Star } from "lucide-react";

interface ITravelRequest {
  _id: string;
  status: string;
  message?: string;
  createdAt: string;
  travelPlan: {
    _id: string;
    title: string;
    image: string;
    startDate: string;
    endDate: string;
  };
  host: {
    _id: string;
    name: string;
    profileImage?: { url: string };
  };
}

export default function TravelRequestsTable() {
  const [requests, setRequests] = useState<ITravelRequest[]>([]);
  const [loading, setLoading] = useState(true);


  const [open, setOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<any>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [reviewMessage, setReviewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-requests/`,
        { credentials: "include" }
      );
      const json = await res.json();

      if (json?.success) {
        setRequests(json.data.data);
      }
    } catch (err) {
      console.error("Failed to load travel requests", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <p className="text-muted-foreground">Loading travel requests...</p>
      </div>
    );
  }

  if (!requests.length) {
    return (
      <Card className="p-10 h-10 text-center">
        <p className="text-muted-foreground">No travel requests found.</p>
      </Card>
    );
  }

  const handleOpenReview = (req: ITravelRequest) => {
    setSelectedHost(req.host);
    setSelectedPlanId(req.travelPlan._id);
    setRating(0);
    setReviewMessage("");
    setOpen(true);
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/review/`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            host: selectedHost._id,
            travelPlan: selectedPlanId,
            rating,
            comment: reviewMessage,
          }),
        }
      );

      const json = await res.json();
      if (!res.ok) throw new Error(json.message);

      toast.success("Review submitted successfully!");
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Review submission failed");
    }

    setSubmitting(false);
  };

  const getStatusColor = (status: string, completed: boolean) => {
    if (completed) return "bg-green-600 text-white";

    switch (status) {
      case "PENDING":
        return "bg-accent text-primary-foreground";
      case "ACCEPTED":
        return "bg-primary text-primary-foreground";
      case "REJECTED":
        return "bg-red-500 text-primary-foreground";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <>
      <Card className="w-full shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">My Travel Requests</h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Travel Plan</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Add Review</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {requests.map((req) => {
                  const isCompleted =
                    new Date(req.travelPlan.endDate) < new Date();
                  const canReview =
                    req.status ===  "ACCEPTED" && isCompleted;

                  return (
                    <TableRow key={req._id}>
                  
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Image
                            src={req.travelPlan.image}
                            alt="Travel plan"
                            height={50}
                            width={50}
                            className="rounded-md object-cover h-[50px] w-[50px]"
                          />
                          <p className="font-medium">{req.travelPlan.title}</p>
                        </div>
                      </TableCell>

                      {/* Host */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {req.host?.profileImage?.url && (
                            <Image
                              src={req.host.profileImage.url}
                              alt="Host"
                              height={36}
                              width={36}
                              className="rounded-full object-cover h-9 w-9"
                            />
                          )}
                          <span>{req.host.name}</span>
                        </div>
                      </TableCell>

                      {/* Dates */}
                      <TableCell>
                        <p className="text-sm text-muted-foreground">
                          {new Date(
                            req.travelPlan.startDate
                          ).toLocaleDateString()}{" "}
                          →{" "}
                          {new Date(
                            req.travelPlan.endDate
                          ).toLocaleDateString()}
                        </p>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          className={getStatusColor(req.status, isCompleted)}
                        >
                          {isCompleted ? "COMPLETED" : req.status}
                        </Badge>
                      </TableCell>

                      {/* Message */}
                      <TableCell className="max-w-[220px] truncate">
                        {req.message || "—"}
                      </TableCell>

                      {/* Add Review Button */}
            {/* Add Review Button */}
                      <TableCell>
                        {canReview ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenReview(req)}
                          >
                            Add Review
                          </Button>
                        ) : req.status === "ACCEPTED" && !isCompleted ? (
                          <span className="text-sm text-muted-foreground p-4 flex items-center justify-center rounded-md bg-muted gap-1 italic">
                           <CircleAlert className="w-4 h-4"/> You can review after the trip ends
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
   
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

   
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md dark:bg-slate-900">
          <DialogHeader>
            <DialogTitle>
              Review {selectedHost?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-2 py-3">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-6 w-6 cursor-pointer ${
                  n <= rating ? "text-yellow-400" : "text-gray-400"
                }`}
                onClick={() => setRating(n)}
              />
            ))}
          </div>

          <Textarea
            placeholder="Write your review..."
            value={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
            className="min-h-[100px]"
          />

          <DialogFooter>
            <Button onClick={handleSubmitReview} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
