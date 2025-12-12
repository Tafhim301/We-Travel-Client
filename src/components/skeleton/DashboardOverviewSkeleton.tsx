import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function DashboardOverviewSkeleton() {
    return (
        <div className="space-y-6 p-4 md:p-8 animate-in fade-in duration-500">
            {/* Header Card Skeleton */}
            <div className="relative overflow-hidden rounded-xl bg-linear-to-r from-primary/10 via-primary/5 to-background border border-border p-6 md:p-8">
                <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-3 flex-1 md:flex-none">
                            <Skeleton className="h-7 w-48" />
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-56" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Skeleton className="h-10 flex-1 md:flex-none w-full md:w-32" />
                        <Skeleton className="h-10 flex-1 md:flex-none w-full md:w-32 hidden md:block" />
                    </div>
                </div>

                <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
            </div>

            {/* Stats and Tables Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* LEFT COLUMN: Stats & Activity (Span 2) */}
                <div className="md:col-span-2 space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <Card key={i} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between space-y-0 pb-2">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                    </div>
                                    <div className="flex flex-col gap-1 mt-3">
                                        <Skeleton className="h-8 w-12" />
                                        <Skeleton className="h-3 w-24 mt-1" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Recent Travels Table Skeleton */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-56 mt-2" />
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Skeleton className="h-4 w-20" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-16" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-16" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-40" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-6 w-16 rounded-full" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Community Travels Table Skeleton */}
                    <Card className="border-border/60 shadow-sm">
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-60 mt-2" />
                        </CardHeader>

                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Skeleton className="h-4 w-24" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-20" />
                                        </TableHead>
                                        <TableHead>
                                            <Skeleton className="h-4 w-16" />
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell>
                                                <Skeleton className="h-4 w-32" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-28" />
                                            </TableCell>
                                            <TableCell>
                                                <Skeleton className="h-4 w-24" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Subscription & Quick Actions (Span 1) */}
                <div className="space-y-6">
                    {/* Subscription Card Skeleton */}
                    <Card className="overflow-hidden border-primary/20 shadow-md">
                        <div className="bg-linear-to-br from-primary/10 to-transparent pb-4 p-6">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 flex-1">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-4 w-40" />
                                </div>
                            </div>
                        </div>

                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>

                            <div className="rounded-lg bg-muted/50 p-3 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-24 flex-1" />
                                    <Skeleton className="h-4 w-28" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4 rounded" />
                                    <Skeleton className="h-4 w-20 flex-1" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                        </CardContent>

                        <div className="border-t bg-muted/20 p-4">
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </Card>

                    {/* Quick Actions Card Skeleton */}
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-10 w-full" />
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
