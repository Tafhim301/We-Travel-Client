"use client";

import React from "react";

const Shimmer = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 ${className}`} />
);

export function AdminDashboardSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="space-y-2">
                    <Shimmer className="h-8 w-48 rounded" />
                    <Shimmer className="h-4 w-64 rounded" />
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm">
                    <Shimmer className="h-8 w-20 rounded" />
                    <Shimmer className="h-8 w-20 rounded" />
                </div>
            </div>

            <div className="space-y-6">
                {/* Top stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                        >
                            <Shimmer className="h-4 w-24 rounded" />
                            <Shimmer className="h-6 w-28 rounded" />
                            <Shimmer className="h-3 w-20 rounded" />
                        </div>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <Shimmer className="h-5 w-40 rounded" />
                        <Shimmer className="h-4 w-48 rounded" />
                        <Shimmer className="h-72 w-full rounded-lg" />
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <Shimmer className="h-5 w-32 rounded" />
                        <Shimmer className="h-4 w-40 rounded" />
                        <div className="flex items-center justify-center">
                            <Shimmer className="h-48 w-48 rounded-full" />
                        </div>
                    </div>
                </div>

                {/* Tables/cards row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="p-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <Shimmer className="h-5 w-32 rounded" />
                            <Shimmer className="h-4 w-48 mt-2 rounded" />
                        </div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="p-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <div className="space-y-2">
                                    <Shimmer className="h-4 w-32 rounded" />
                                    <Shimmer className="h-3 w-24 rounded" />
                                </div>
                                <Shimmer className="h-6 w-10 rounded" />
                            </div>
                        ))}
                    </div>

                    <div className="lg:col-span-2 p-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                            <Shimmer className="h-5 w-36 rounded" />
                            <Shimmer className="h-4 w-48 mt-2 rounded" />
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Shimmer className="h-8 w-8 rounded-full" />
                                        <div className="space-y-2">
                                            <Shimmer className="h-4 w-28 rounded" />
                                            <Shimmer className="h-3 w-20 rounded" />
                                        </div>
                                    </div>
                                    <Shimmer className="h-4 w-12 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Financial summary row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-xl bg-linear-to-br from-indigo-600 to-violet-700 text-white shadow-sm">
                        <Shimmer className="h-5 w-40 rounded opacity-50" />
                        <Shimmer className="h-4 w-48 rounded opacity-50 mt-2" />
                        <Shimmer className="h-16 w-full rounded-lg mt-4 opacity-60" />
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                        <Shimmer className="h-5 w-32 rounded" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between">
                                    <Shimmer className="h-4 w-24 rounded" />
                                    <Shimmer className="h-4 w-10 rounded" />
                                </div>
                                <Shimmer className="h-2 w-full rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardSkeleton;
