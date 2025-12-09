/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Pencil, Trash2, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RequestsDrawer } from "./RequestDrawer";

export default function MyTravelPlansTable() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/travelPlans/my-plans`,
          { credentials: "include" }
        );
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message);
        setData(json.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to load travel plans");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log(data)

  const handleRestrictedAction = () => {
    toast.warning("You can't modify this plan while members have requested it");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 w-full rounded-md bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Travel Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Budget</TableHead>
            <TableHead>Requests</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((plan, index) => {
            const hasRequests =
              plan.requestedBy && plan.requestedBy.length > 1;

            return (
              <TableRow key={plan._id} >
                <TableCell className="font-medium">
                  {index + 1}
                </TableCell>
                <TableCell className="font-medium w">
                  <Image className="rounded-md" width={50} height={50} src={plan.image} alt="" />
                </TableCell>
                <TableCell className="font-medium">
                  {plan.title}
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{plan.travelType}</Badge>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {new Date(plan.startDate).toLocaleDateString()} –{" "}
                  {new Date(plan.endDate).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Badge variant={"outline"}>{plan.budgetRange?.min}Tk – {plan.budgetRange?.max}Tk</Badge>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                   <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActivePlanId(plan._id);
                          setOpenDrawer(true);
                        }}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {plan.requestedBy?.length || 0}
                    </Button>

                  </div>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {/* View */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        router.push(`/travel-plans/${plan._id}`)
                      }
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    {/* Edit */}
                    <Button
                      size="icon"
                      variant="outline"
                      disabled={hasRequests}
                      onClick={
                        hasRequests
                          ? handleRestrictedAction
                          : () =>
                              router.push(
                                `/dashboard/edit-travel-plan/${plan._id}`
                              )
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {/* Delete */}
                    <Button
                      size="icon"
                      variant="destructive"
                      disabled={hasRequests}
                      onClick={hasRequests ? handleRestrictedAction : () => {}}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {activePlanId && (
  <RequestsDrawer
    open={openDrawer}
    onOpenChange={setOpenDrawer}
    planId={activePlanId}
  />
)}


      {data.length === 0 && (
        <div className="p-6 text-center text-muted-foreground">
          You haven&#39;t created any travel plans yet.
        </div>
      )}
    </div>
  );
}
