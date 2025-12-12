"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpDown, ChevronLeft, ChevronRight, Eye, Search } from "lucide-react";
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

// ... Types and Helper functions remain the same as your code ...
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
      <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Shimmer className="h-6 w-48 rounded" />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Shimmer className="h-9 flex-1 sm:w-48 rounded" />
          <Shimmer className="h-9 w-28 rounded" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
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
            {Array.from({ length: 5 }).map((_, r) => (
              <tr key={r}>
                {Array.from({ length: 9 }).map((_, c) => (
                  <td key={c} className="px-6 py-4"><Shimmer className="h-4 w-full rounded" /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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
    case "FAMILY": return "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200";
    case "LEISURE": return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
    case "ADVENTURE": return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200";
    case "SOLO": return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-200";
    default: return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  }
};

export default function TravelPlansAdminPage() {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  
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
      
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message = err instanceof Error ? err.message : "Network error";
        console.error("Error loading travel plans:", message);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [backend, page, limit, sortKey, sortOrder, search, travelType, visibility]);

  const totalPages = meta?.totalPage || 1;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Manage Travel Plans</h1>
          <p className="text-slate-500 dark:text-slate-400">Search, sort, and review all published plans.</p>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex items-center gap-3">
          <div className="relative lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title..."
              className="pl-9 h-10"
            />
          </div>
          <Select
            value={travelType || "all"}
            onValueChange={(val) => setTravelType(val === "all" ? "" : val)}
          >
            <SelectTrigger className="h-10 w-full lg:w-44 bg-white dark:bg-slate-900">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectTrigger className="h-10 w-full lg:w-44 bg-white dark:bg-slate-900">
              <SelectValue placeholder="All visibility" />
            </SelectTrigger>
            <SelectContent>
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
        <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          {/* Table Toolbar */}
          <div className="px-4 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => toggleSort("title")} className="h-8 gap-2">
                <ArrowUpDown className="h-3.5 w-3.5" /> Title
              </Button>
              <Button variant="outline" size="sm" onClick={() => toggleSort("startDate")} className="h-8 gap-2">
                <ArrowUpDown className="h-3.5 w-3.5" /> Start Date
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rows</span>
              <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                <SelectTrigger className="h-8 w-[70px]">
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

          {/* TABLE WRAPPER: This handles the horizontal scroll on small screens */}
          <div className="w-full overflow-x-auto lg:overflow-x-visible">
            {/* MIN-WIDTH: prevents the table from collapsing/wrapping, forcing a scroll on mobile */}
            <div className="min-w-[1100px] lg:min-w-full">
              <Table>
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/80">
                  <TableRow>
                    <TableHead className="w-12 text-center">#</TableHead>
                    <TableHead>Plan Details</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Budget Range</TableHead>
                    <TableHead>Members</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {plans.map((plan, idx) => (
                    <TableRow key={plan._id} className="group hover:bg-slate-50/80 dark:hover:bg-slate-900/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-500">
                        {(page - 1) * limit + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{plan.title}</span>
                          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            {plan.destination?.destination || plan.destination?.city || "Unknown"}
                            {plan.destination?.country && ` • ${plan.destination.country}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 border border-slate-200 dark:border-slate-700">
                            <AvatarImage src={plan.user?.profileImage?.url || ""} />
                            <AvatarFallback className="text-[10px]">{plan.user?.name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium leading-none">{plan.user?.name || "Unknown"}</span>
                            <span className="text-[11px] text-slate-500 mt-1">{plan.user?.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${travelTypeBadge(plan.travelType)} font-medium border-0 px-2 py-0.5`}>
                          {plan.travelType || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-300">
                        <div className="text-xs space-y-0.5">
                          <p className="font-medium text-slate-900 dark:text-slate-200">{formatDate(plan.startDate)}</p>
                          <p className="text-slate-400 text-[10px] uppercase">To {formatDate(plan.endDate)}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium">
                        {formatCurrency(plan.budgetRange?.min)} - {formatCurrency(plan.budgetRange?.max)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold">
                             {plan.approvedMembers?.length ?? 0} <span className="text-slate-400 font-normal">/ {plan.maxMembers ?? 0} joined</span>
                          </span>
                          <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-indigo-500" 
                                style={{ width: `${Math.min(100, ((plan.approvedMembers?.length || 0) / (plan.maxMembers || 1)) * 100)}%` }}
                             />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${plan.visibility
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}>
                          {plan.visibility ? "Public" : "Private"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/travel-plan/${plan._id}`}>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Empty State */}
          {!loading && plans.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No travel plans found matching your criteria.</p>
            </div>
          )}

          {/* Pagination Footer */}
          <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-medium text-slate-500 uppercase tracking-tighter">
              Showing Page {page} of {totalPages} <span className="mx-2 text-slate-300">|</span> Total {meta?.total ?? plans.length} Records
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page <= 1} 
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-3"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(3, totalPages) }).map((_, i) => (
                    <Button 
                        key={i} 
                        variant={page === i + 1 ? "default" : "outline"} 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </Button>
                ))}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={page >= totalPages} 
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-3"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}