"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TravelPlan = {
  _id: string;
  title: string;
  description?: string;
  image?: string;
  destination?: {
    destination?: string;
    city?: string;
    country?: string;
  };
  user?: {
    _id: string;
    name: string;
    email: string;
    profileImage?: { url?: string };
  };
  travelType?: string;
  visibility?: boolean;
  startDate?: string;
  endDate?: string;
  budgetRange?: { min?: number; max?: number };
  requestedBy?: string[];
  approvedMembers?: string[];
  maxMembers?: number;
};

type Meta = { page: number; limit: number; total: number; totalPage: number };

type PlansResponse = {
  success: boolean;
  message: string;
  meta: Meta;
  data: TravelPlan[];
};

const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${className}`} />
);

function PlansTableSkeleton() {
  return (
    <Card className="p-0 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Shimmer className="h-6 w-48 rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-9 w-48 rounded" />
          <Shimmer className="h-9 w-28 rounded" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              {Array.from({ length: 9 }).map((_, i) => (
                <th key={i} className="px-6 py-3 text-left">
                  <Shimmer className="h-4 w-20 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 8 }).map((_, r) => (
              <tr key={r}>
                <td className="px-6 py-4"><Shimmer className="h-4 w-8 rounded" /></td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <Shimmer className="h-4 w-32 rounded" />
                    <Shimmer className="h-3 w-48 rounded" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Shimmer className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Shimmer className="h-4 w-28 rounded" />
                      <Shimmer className="h-3 w-32 rounded" />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4"><Shimmer className="h-6 w-20 rounded" /></td>
                <td className="px-6 py-4"><Shimmer className="h-4 w-28 rounded" /></td>
                <td className="px-6 py-4"><Shimmer className="h-4 w-24 rounded" /></td>
                <td className="px-6 py-4"><Shimmer className="h-4 w-24 rounded" /></td>
                <td className="px-6 py-4"><Shimmer className="h-6 w-20 rounded" /></td>
                <td className="px-6 py-4"><Shimmer className="h-8 w-24 rounded" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <Shimmer className="h-9 w-28 rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-9 w-9 rounded" />
          <Shimmer className="h-9 w-9 rounded" />
        </div>
      </div>
    </Card>
  );
}

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-";

const formatCurrency = (value?: number) =>
  typeof value === "number"
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "BDT", maximumFractionDigits: 0 })
      .format(value)
      .replace("BDT", "৳")
    : "-";

const travelTypeBadge = (type?: string) => {
  switch (type) {
    case "FAMILY":
      return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200";
    case "LEISURE":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "ADVENTURE":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200";
    case "SOLO":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200";
    default:
      return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
};

export default function TravelPlansAdminPage() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortKey, setSortKey] = useState<"title" | "startDate" | "createdAt">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [travelType, setTravelType] = useState<string>("");
  const [visibility, setVisibility] = useState<string>("");

  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const url = new URL(`${backend}/travelPlans/all-plans`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("sort", `${sortOrder === "asc" ? "" : "-"}${sortKey}`);
        if (search.trim()) url.searchParams.set("searchTerm", search.trim());
        if (travelType) url.searchParams.set("travelType", travelType);
        if (visibility) url.searchParams.set("visibility", visibility);

        const res = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        const json: PlansResponse = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load travel plans");
        setPlans(json.data);
        setMeta(json.meta);
        setError("");
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Network error";
        setError(message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [backend, page, limit, sortKey, sortOrder, search, travelType, visibility]);

  const totalPages = meta?.totalPage || 1;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Manage Travel Plans</h1>
          <p className="text-slate-500 dark:text-slate-400">Search, sort, and review all published plans.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search plans by title"
            className="w-64"
          />
          <Select
            value={travelType || "all"}
            onValueChange={(val) => setTravelType(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-9 w-44 border border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="FAMILY">Family</SelectItem>
              <SelectItem value="LEISURE">Leisure</SelectItem>
              <SelectItem value="ADVENTURE">Adventure</SelectItem>
              <SelectItem value="SOLO">Solo</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={visibility || "all"}
            onValueChange={(val) => setVisibility(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-9 w-44 border border-slate-200 dark:border-slate-800">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="all">All visibility</SelectItem>
              <SelectItem value="true">Visible</SelectItem>
              <SelectItem value="false">Hidden</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <PlansTableSkeleton />
      ) : (
        <Card className="p-0 ">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => toggleSort("title")} className="gap-2">
                <ArrowUpDown className="h-4 w-4" /> Title
              </Button>
              <Button variant="outline" onClick={() => toggleSort("startDate")} className="gap-2">
                <ArrowUpDown className="h-4 w-4" /> Start Date
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-500 dark:text-slate-400">Rows</label>
              <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                <SelectTrigger className="h-9 w-20 border border-slate-200 dark:border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end">
                  {[10, 20, 50].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400">{error}</div>
          ) : (
            <div className="">
              <Table className="overflow-x-auto">
                <TableHeader className="bg-slate-50 dark:bg-slate-900/60">
                  <TableRow>
                    <TableHead className="px-6">#</TableHead>
                    <TableHead className="px-6">Plan</TableHead>
                    <TableHead className="px-6">Host</TableHead>
                    <TableHead className="px-6">Type</TableHead>
                    <TableHead className="px-6">Dates</TableHead>
                    <TableHead className="px-6">Budget</TableHead>
                    <TableHead className="px-6">Members</TableHead>
                    <TableHead className="px-6">Visibility</TableHead>
                    <TableHead className="px-6">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {plans.map((plan, idx) => (
                    <TableRow key={plan._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800 transition-colors">
                      <TableCell className="px-6 font-medium text-slate-700 dark:text-slate-200">{(page - 1) * limit + idx + 1}</TableCell>
                      <TableCell className="px-6">
                        <div className="space-y-1">
                          <div className="font-semibold text-slate-900 dark:text-white">{plan.title}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {plan.destination?.destination || plan.destination?.city || "Unknown"}
                            {plan.destination?.country ? ` · ${plan.destination.country}` : ""}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={plan.user?.profileImage?.url || ""} alt={plan.user?.name || "Host"} />
                            <AvatarFallback>{plan.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{plan.user?.name || "Unknown"}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{plan.user?.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge className={`${travelTypeBadge(plan.travelType)} capitalize`}>
                          {plan.travelType || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-slate-700 dark:text-slate-200">
                        <div className="space-y-1">
                          <div>{formatDate(plan.startDate)}</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">to {formatDate(plan.endDate)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 text-slate-700 dark:text-slate-200">
                        {formatCurrency(plan.budgetRange?.min)} - {formatCurrency(plan.budgetRange?.max)}
                      </TableCell>
                      <TableCell className="px-6 text-slate-700 dark:text-slate-200">
                        <div className="space-y-1">
                          <div className="font-semibold">{plan.approvedMembers?.length ?? 0} / {plan.maxMembers ?? 0} approved</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Requests: {plan.requestedBy?.length ?? 0}</div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${plan.visibility
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
                          : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                          }`}>
                          {plan.visibility ? "Visible" : "Hidden"}
                        </span>
                      </TableCell>
                      <TableCell className="px-6">
                        <Link href={`/travel-plan/${plan._id}`} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300">
                          <Button className="bg-accent hover:bg-accent/80">
                            <Eye className="h-4 w-4" /> View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {plans.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={9} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">No travel plans found.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="text-sm text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages} • Total {meta?.total ?? plans.length}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
