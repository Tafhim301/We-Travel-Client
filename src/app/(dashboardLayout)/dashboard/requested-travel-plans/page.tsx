"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


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
    name: string;
    profileImage?: { url: string };
  };
}

export default function TravelRequestsTable() {
  const [requests, setRequests] = useState<ITravelRequest[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-requests/`, {
        credentials: "include",
      });
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const getStatusColor = (status: string) => {
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
              </TableRow>
            </TableHeader>

            <TableBody>
              {requests.map((req) => (
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

                  {/* Host name */}
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
                      {new Date(req.travelPlan.startDate).toLocaleDateString()} →{" "}
                      {new Date(req.travelPlan.endDate).toLocaleDateString()}
                    </p>
                  </TableCell>

                  <TableCell>
                    <Badge className={getStatusColor(req.status)}>{req.status}</Badge>
                  </TableCell>

                  {/* Message */}
                  <TableCell className="max-w-[220px] truncate">
                    {req.message || "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
