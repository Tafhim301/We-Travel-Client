/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  Eye, 
  Search,
  Shield,
  ShieldAlert
} from "lucide-react";
import Link from "next/link";
import UsersTableSkeleton from "@/components/skeleton/UserTableSkeleton";

// --- TYPES ---
type UserItem = {
  _id: string;
  name: string;
  email: string;
  profileImage?: { url?: string };
  role: string;
  isActive?: string;
  averageRating?: number;
};

type UsersResponse = {
  success: boolean;
  message: string;
  meta: { page: number; limit: number; total: number; totalPage: number };
  data: UserItem[];
};





export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  
  // Query States
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortKey, setSortKey] = useState<"name" | "email" | "createdAt">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; totalPage: number } | null>(null);

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
        const url = new URL(`${backend}/user/all-users`);
        url.searchParams.set("page", String(page));
        url.searchParams.set("limit", String(limit));
        url.searchParams.set("sort", `${sortOrder === "asc" ? "" : "-"}${sortKey}`);
        if (search.trim()) url.searchParams.set("searchTerm", search.trim());

        const res = await fetch(url.toString(), {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        
        const json: UsersResponse = await res.json();
        if (!json.success) throw new Error(json.message || "Failed to load users");
        
        setUsers(json.data);
        setMeta(json.meta);
        setError("");
      } catch (err: any) {
        if (err.name !== "AbortError") setError(err.message || "Network error");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [backend, page, limit, sortKey, sortOrder, search]);

  const sortedUsers = useMemo(() => users, [users]);
  const totalPages = meta?.totalPage || 1;

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8 space-y-6 rounded-xl">
    
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Manage Users</h1>
          <p className="text-muted-foreground text-sm">
            View, search, and manage user accounts and permissions.
          </p>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="p-4 md:p-6 pb-2">
          {/* TOOLBAR */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-9 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Filters & Actions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
               <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => toggleSort("name")} className="h-9 whitespace-nowrap">
                    <ArrowUpDown className="mr-2 h-3 w-3" /> Name
                </Button>
                <Button variant="outline" size="sm" onClick={() => toggleSort("email")} className="h-9 whitespace-nowrap">
                    <ArrowUpDown className="mr-2 h-3 w-3" /> Email
                </Button>
               </div>
              
               <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                  <SelectTrigger className="h-9 w-[70px] md:w-20">
                    <SelectValue placeholder={limit} />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map(n => (
                      <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
             <div className="p-4 md:p-6 pt-0">
               <UsersTableSkeleton />
             </div>
          ) : error ? (
            <div className="p-12 text-center text-destructive bg-destructive/10 m-4 rounded-md">
              <ShieldAlert className="h-10 w-10 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* TABLE CONTAINER - Handles Horizontal Scroll */}
              <div className="relative w-full overflow-auto">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="w-[50px] text-center">#</TableHead>
                      <TableHead className="min-w-[200px]">User</TableHead>
                      <TableHead className="min-w-[200px]">Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                          No results found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      sortedUsers.map((u, idx) => (
                        <TableRow key={u._id} className="group">
                          <TableCell className="text-center font-medium text-muted-foreground">
                            {(page - 1) * limit + idx + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-border">
                                <AvatarImage src={u.profileImage?.url} alt={u.name} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {u.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-foreground">{u.name}</span>
                                {/* Mobile-only extra context if columns are hidden (optional) */}
                                {/* <span className="text-xs text-muted-foreground md:hidden">{u.email}</span> */}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{u.email}</TableCell>
                          <TableCell>
                            <Badge 
                                variant="outline" 
                                className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                            >
                              {u.role === 'ADMIN' && <Shield className="w-3 h-3 mr-1" />}
                              {u.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                             <Badge 
                                variant="outline"
                                className={u.isActive === 'INACTIVE' 
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                }
                             >
                               {u.isActive || "ACTIVE"}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                             <Link href={`/profile/${u._id}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </Button>
                             </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between p-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                   Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}