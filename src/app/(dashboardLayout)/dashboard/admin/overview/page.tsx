/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react';
import {
    Users,
    CreditCard,
    Map,
    TrendingUp,
    Star,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    ShieldCheck,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AdminDashboardSkeleton from '@/components/skeleton/AdminDashboardSkeleton';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT',
        maximumFractionDigits: 0,
        currencyDisplay: 'symbol',
    })
        .format(amount)
        .replace('BDT', '৳');
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// --- COMPONENTS ---
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${className}`}>
        {children}
    </div>
);

const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, colorClass }: any) => (
    <Card className="p-6 flex items-start justify-between hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 truncate">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white truncate">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">{subtext}</p>}

            {trend && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    <span className="truncate">{trendValue}</span>
                </div>
            )}
        </div>
        <div className={`p-3 rounded-lg shrink-0 ${colorClass}`}>
            <Icon size={20} className="text-white" />
        </div>
    </Card>
);

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#10b981'];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_URL}/stats/admin/dashboard`);

                const response = await fetch(url.toString(), {
                    method: 'GET',
                    credentials: 'include',
                });
                const result = await response.json();

                if (result.success) {
                    setData(result.data);
                } else {
                    setError(`Failed to load dashboard data ${result.message || ''}`);
                }
            } catch (err) {
                console.error(err);
                setError("Error connecting to server");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <AdminDashboardSkeleton />;
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
                <div className="text-center p-6 w-full max-w-sm mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-red-100 dark:border-red-900/40">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unable to load data</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const plansByTypeRaw = data.travelPlanStats?.plansByType;
    const plansByTypeObj: Record<string, number> = Array.isArray(plansByTypeRaw)
        ? (plansByTypeRaw[0] || {})
        : (plansByTypeRaw || {});

    const pieChartData = Object.entries(plansByTypeObj).map(([name, value]) => ({
        name,
        value: value,
    }));

    return (
        // Responsive Padding: p-4 on mobile, p-8 on desktop
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 font-sans text-slate-800 dark:text-slate-100">

            {/* HEADER */}
            {/* Flex-col for mobile stacking, Flex-row for tablet/desktop */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Executive Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm md:text-base">Real-time insights into We Travel performance.</p>
                </div>
                {/* Optional: Add Date Filter buttons here if needed, styled with w-full md:w-auto */}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
            >

                {/* 1. TOP STATS ROW */}
                {/* Grid: 1 col (mobile), 2 cols (tablet), 4 cols (desktop) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(data.paymentAnalytics?.totalRevenue || 0)}
                        subtext="Gross volume"
                        icon={CreditCard}
                        trend="up"
                        trendValue="Current Period"
                        colorClass="bg-emerald-500"
                    />
                    <StatCard
                        title="Active Users"
                        value={data.userOverview?.activeUsers || 0}
                        subtext={`${data.userOverview?.activePercentage}% of total`}
                        icon={Users}
                        colorClass="bg-indigo-500"
                    />
                    <StatCard
                        title="Travel Plans"
                        value={data.travelPlanStats?.totalPlans || 0}
                        subtext="Avg members: "
                        icon={Map}
                        colorClass="bg-violet-500"
                    />
                    <StatCard
                        title="Premium Subs"
                        value={data.userOverview?.premiumUsers || 0}
                        subtext={`${data.userOverview?.premiumPercentage}% rate`}
                        icon={Star}
                        colorClass="bg-amber-500"
                    />
                </div>

                {/* 2. CHARTS ROW */}
                {/* Stack vertically on mobile/tablet, 3-col grid on large screens */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* User Growth Chart - Spans 2 cols on Large screens */}
                    <Card className="lg:col-span-2 p-4 md:p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Growth</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">New registrations</p>
                            </div>
                            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-200 rounded-lg">
                                <TrendingUp size={20} />
                            </div>
                        </div>
                        <div className="h-[250px] md:h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.userGrowth?.userGrowthTrend || []}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="_id"
                                        tickFormatter={formatDate}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        dy={10}
                                        minTickGap={30} // Helps prevent overlap on small screens
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                        allowDecimals={false}
                                        width={30} // Reduce width for mobile
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        labelFormatter={(label) => formatDate(label)}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="newUsers"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorUsers)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Travel Types Pie Chart */}
                    <Card className="p-4 md:p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Preferences</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Plans by type</p>
                        <div className="h-[250px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieChartData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend 
                                        verticalAlign="bottom" 
                                        height={36} 
                                        iconType="circle" 
                                        wrapperStyle={{ fontSize: '12px' }} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                <span className="text-3xl font-bold text-slate-800 dark:text-white">{data.travelPlanStats?.totalPlans || 0}</span>
                                <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider">Plans</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* 3. BUSINESS INTELLIGENCE ROW */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Top Destinations */}
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Destinations</h3>
                            <Globe size={18} className="text-slate-400" />
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {data.topDestinations && data.topDestinations.length > 0 ? (
                                data.topDestinations.map((dest: any, i: number) => (
                                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <span className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                                {i + 1}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">{dest.destinationCountry}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Avg Budget: {formatCurrency(dest.avgBudgetMin)}</p>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0 ml-2">
                                            <p className="font-bold text-slate-700 dark:text-white">{dest.totalPlans}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500">plans</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">No data yet.</div>
                            )}
                        </div>
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/60 text-center border-t border-slate-100 dark:border-slate-800">
                            <button className="text-xs font-semibold text-indigo-600 dark:text-indigo-300 hover:text-indigo-700">View All</button>
                        </div>
                    </Card>

                    {/* Top Hosts Table */}
                    <Card className="lg:col-span-2 p-0 overflow-hidden">
                        <div className="p-4 md:p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Rated Hosts</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Community leaders</p>
                            </div>
                            <ShieldCheck size={18} className="text-slate-400" />
                        </div>
                        
                        {/* Table Responsive Wrapper */}
                        <div className="overflow-x-auto w-full">
                            {data.topHosts && data.topHosts.length > 0 ? (
                                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-200">
                                    <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs uppercase font-semibold text-slate-500 dark:text-slate-400">
                                        <tr>
                                            {/* whitespace-nowrap keeps headers from breaking awkwardly */}
                                            <th className="px-4 md:px-6 py-3 whitespace-nowrap">Host</th>
                                            <th className="px-4 md:px-6 py-3 whitespace-nowrap">Rating</th>
                                            <th className="px-4 md:px-6 py-3 whitespace-nowrap">Reviews</th>
                                            <th className="px-4 md:px-6 py-3 whitespace-nowrap">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {data.topHosts.map((host: any) => (
                                            <tr key={host._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-colors">
                                                <td className="px-4 md:px-6 py-4 flex items-center gap-3 whitespace-nowrap">
                                                    <div className="h-8 w-8 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs relative overflow-hidden">
                                                        {host.profileImage?.url ?
                                                            <Image src={host.profileImage.url} alt="host" fill className="object-cover" />
                                                            : host.name.charAt(0)}
                                                    </div>
                                                    <span className="font-medium text-slate-900 dark:text-white">{host.name}</span>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                        <Star size={14} fill="currentColor" />
                                                        {host.averageRating.toFixed(1)}
                                                    </div>
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    {host.totalReviewsReceived}
                                                </td>
                                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">Top Rated</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-500 dark:text-slate-400">
                                    <Star className="mb-2 opacity-20" size={40} />
                                    <p>No reviews yet.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* 4. FINANCIAL SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Revenue Card */}
                    <Card className="p-4 md:p-6 bg-linear-to-br from-indigo-600 to-violet-700 text-white border-none">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-semibold opacity-90">Subscription Revenue</h3>
                                <p className="text-sm opacity-75">Monthly vs Yearly</p>
                            </div>
                            <CreditCard className="opacity-75" />
                        </div>
                        {/* Stacked on mobile, Grid on tablet+ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                            <div>
                                <p className="text-sm opacity-75 mb-1">Monthly</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(data.paymentAnalytics?.subscriptionTypeBreakdown?.monthly?.revenue || 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm opacity-75 mb-1">Yearly</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(data.paymentAnalytics?.subscriptionTypeBreakdown?.yearly?.revenue || 0)}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 h-2 bg-black/20 rounded-full overflow-hidden flex">
                            <div className="h-full bg-white/40" style={{ width: '30%' }}></div>
                            <div className="h-full bg-white/90" style={{ width: '70%' }}></div>
                        </div>
                    </Card>

                    {/* Payment Status Card */}
                    <Card className="p-4 md:p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Payment Health</h3>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full font-bold">
                                {data.paymentAnalytics?.paymentStatusPercentage?.pendingPercentage}% Pending
                            </span>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Successful', val: data.paymentAnalytics?.paymentStatusBreakdown?.success || 0, color: 'bg-emerald-500', total: data.paymentAnalytics?.totalPayments },
                                { label: 'Pending', val: data.paymentAnalytics?.paymentStatusBreakdown?.pending || 0, color: 'bg-amber-400', total: data.paymentAnalytics?.totalPayments },
                                { label: 'Failed/Cancel', val: (data.paymentAnalytics?.paymentStatusBreakdown?.failed || 0) + (data.paymentAnalytics?.paymentStatusBreakdown?.cancelled || 0), color: 'bg-rose-500', total: data.paymentAnalytics?.totalPayments },
                            ].map((item, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{item.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color}`}
                                            style={{ width: `${item.total > 0 ? (item.val / item.total) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

            </motion.div>
        </div>
    );
}