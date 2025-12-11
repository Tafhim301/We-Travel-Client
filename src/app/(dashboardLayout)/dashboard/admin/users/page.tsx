/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, ArrowUpDown, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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

const Shimmer = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${className}`} />
);

function UsersTableSkeleton() {
    return (
        <Card className="p-0 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <Shimmer className="h-6 w-40 rounded" />
                <div className="flex items-center gap-2">
                    <Shimmer className="h-9 w-40 rounded" />
                    <Shimmer className="h-9 w-24 rounded" />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 dark:bg-slate-900/50">
                        <tr>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <th key={i} className="px-6 py-3 text-left">
                                    <Shimmer className="h-4 w-24 rounded" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {Array.from({ length: 8 }).map((_, r) => (
                            <tr key={r}>
                                <td className="px-6 py-4"><Shimmer className="h-4 w-8 rounded" /></td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <Shimmer className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2">
                                            <Shimmer className="h-4 w-32 rounded" />
                                            <Shimmer className="h-3 w-40 rounded" />
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4"><Shimmer className="h-4 w-40 rounded" /></td>
                                <td className="px-6 py-4"><Shimmer className="h-6 w-20 rounded" /></td>
                                <td className="px-6 py-4"><Shimmer className="h-4 w-24 rounded" /></td>
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

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
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
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Manage Users</h1>
                    <p className="text-slate-500 dark:text-slate-400">Admin tools to view and manage community members.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users by name/email"
                        className="w-56"
                    />
                </div>
            </div>

            {loading ? (
                <UsersTableSkeleton />
            ) : (
                <Card className="p-0 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => toggleSort("name")} className="gap-2">
                                <ArrowUpDown className="h-4 w-4" /> Name
                            </Button>
                            <Button variant="outline" onClick={() => toggleSort("email")} className="gap-2">
                                <ArrowUpDown className="h-4 w-4" /> Email
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <label className="text-sm text-slate-500 dark:text-slate-400">Rows</label>
                            <select
                                className="h-9 rounded-md bg-transparent border border-slate-200 dark:border-slate-800 px-2"
                                value={limit}
                                onChange={(e) => setLimit(Number(e.target.value))}
                            >
                                {[10, 20, 50].map((n) => (
                                    <option key={n} value={n}>{n}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {error ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">{error}</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                                    <tr>
                                        <th className="px-6 py-3">#</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {sortedUsers.map((u, idx) => (
                                        <tr key={u._id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700 dark:text-slate-200">{(page - 1) * limit + idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={u.profileImage?.url || ""} alt={u.name} />
                                                        <AvatarFallback>{u.name?.charAt(0) || "U"}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 dark:text-white">{u.name}</div>
                                                        <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-700 dark:text-slate-200">{u.email}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200 text-xs font-semibold">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 text-xs font-semibold">
                                                    {u.isActive || "ACTIVE"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/profile/${u._id}`} className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-300 ">
                                                  <Badge className="hover:shadow-xl" variant={"outline"}>  <Eye className="h-4 w-4" /> View</Badge>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedUsers.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">No users found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-sm text-slate-600 dark:text-slate-400">
                            Page {page} of {totalPages} • Total {meta?.total ?? users.length}
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


