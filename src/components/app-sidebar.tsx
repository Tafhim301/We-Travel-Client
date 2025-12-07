/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useAuth } from "@/lib/context/AuthContext";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { getDashboardItems } from "@/lib/utils";

import Logo from "./shared/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "./ui/button";
import DashboardSkeleton from "./skeleton/dashboard/dashboardSkeleton";
import { CompassIcon, ForwardIcon, Home } from "lucide-react";
import { useEffect } from "react";
import { Separator } from "./ui/separator";

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  
  useEffect(() => {
  if (!loading && !user) {
    toast.warning("Please login to access the dashboard");
    router.push("/auth/login");
  }
}, [loading, user, router]);
  if (loading) return <DashboardSkeleton />;

  const sidebarData = getDashboardItems(user?.role as "ADMIN" | "USER");

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <Logo />
          <ModeToggle />
        </div>

        <Separator />
     
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        {sidebarData.map((section: any, index: number) => (
          <div key={section.section}>

            {index !== 0 && <div className="border-b my-2 opacity-30" />}

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <section.icon className="h-4 w-4" />
                {section.section}
              </SidebarGroupLabel>

              <SidebarGroupContent>
                <SidebarMenu className="mt-1 space-y-1">
                  {section.items.map((item: any) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className="
                          flex items-center gap-3 px-3 py-2 
                          rounded-md transition 
                         hover:bg-primary hover:text-accent-foreground
                        "
                      >
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          {item.title}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}

        {/* Quick Navigation */}
        <div className="border-b my-2 opacity-30" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sm font-semibold text-muted-foreground">
           <ForwardIcon className="h-4 w-4" />
           Quick Navigation
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 px-3 py-2 hover:bg-primary rounded-md"
                >
                  <Link href="/"><Home className="h-4 w-4" />Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>


              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 px-3 py-2 hover:bg-primary rounded-md"
                >
                  <Link href="/explore"><CompassIcon className="h-4 w-4" />Explore</Link>
                </SidebarMenuButton>

                
              </SidebarMenuItem>

              
              <Separator/>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="flex items-center gap-3 px-3 py-2  rounded-md"
                >
                  <Link href="/">
          <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700" onClick={logout}>
            Logout
          </Button>
      </Link>
                </SidebarMenuButton>


              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

       
        
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
