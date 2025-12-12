import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import {
  LayoutDashboard,
  Users,
  Globe,


  CalendarPlus,
  CalendarRange,
  CalendarClock,
} from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount)
}


export const AdminSidebarItems = [
  {
    section: "Dashboard",
    icon: LayoutDashboard,
    items: [
      { title: "Overview", url: "/dashboard/admin/overview", icon: LayoutDashboard },
      { title: "Manage Users", url: "/dashboard/admin/users", icon: Users },
    
    ],
  },

  {
    section: "Travel Plan",
    icon: Globe,
    items: [
      {
        title: "All Travel Plans",
        url: "/dashboard/admin/travel-plan",
        icon: CalendarRange,
      },
    ],
  },


];

export const UserSidebarItems = [
  {
    section: "Dashboard",
    icon: LayoutDashboard,
    items: [{ title: "Overview", url: "/dashboard/overview", icon: LayoutDashboard }],
  },

  {
    section: "Travel Plan",
    icon: Globe,
    items: [
      { title: "Create Travel Plan", url: "/dashboard/create-travel-plan", icon: CalendarPlus },
      { title: "My Travel Plans", url: "/dashboard/my-travel-plans", icon: CalendarRange },
      { title: "Requested Plans", url: "/dashboard/requested-travel-plans", icon: CalendarClock },
    ],
  },


];



export const getDashboardItems = (role: "USER" | "ADMIN") =>
  role === "ADMIN" ? AdminSidebarItems : UserSidebarItems;