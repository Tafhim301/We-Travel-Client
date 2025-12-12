"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, LogOut, User, UserRound } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "./Logo";
import { useAuth } from "@/lib/context/AuthContext";
import { ModeToggle } from "../ui/ModeToggle";
import { Separator } from "../ui/separator";
import { NavbarSkeleton } from "../skeleton/NavbarSkeleton";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, authenticated, logout, loading } = useAuth();

  console.log(user)

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const baseLinks = [
  { label: "Home", href: "/" },
  { label: "Explore", href: "/explore" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Subscription", href: "/subscriptions" },
  
];

const navLinks = authenticated && user 
  ? user.role === "ADMIN" ? 
  [...baseLinks,
     { label: "View Profile", href: `/profile/${user._id}` },
     { label: "Admin Dashboard", href: "/dashboard/admin/overview" },
  ] :
  [...baseLinks, 
    { label: "My Travel Plan", href: "/dashboard/my-travel-plans" },
    { label: "Dashboard", href: "/dashboard/overview" },

]
  : baseLinks;


  const handleLogout = async () => {
    await logout();
    router.push("/");
  };


  if(loading) return ( <NavbarSkeleton />)


  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm py-3" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">

        <Logo />

        <div className="hidden lg:flex items-center space-x-8">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium hover:text-primary transition",
                pathname === item.href
                  ? "text-primary"
                  : "text-gray-700 dark:text-gray-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ACTIONS (DESKTOP) */}
        <div className="hidden lg:flex items-center space-x-4">
          {!loading && authenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full h-9 w-9 cursor-pointer hover:opacity-80">
                  <Avatar>
                    <AvatarImage src={user.profileImage?.url} alt={user.name} />
                    <AvatarFallback>{<User></User>}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

               <DropdownMenuItem
              
              
                >
                 <UserRound className="h-4 w-4 mr-2" />
                  <Link href={`/profile/${user._id}`}>View Profile</Link>
          
                </DropdownMenuItem>

        

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Sign up</Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>


        <div className="lg:hidden ">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 dark:bg-slate-950">
              <SheetHeader className="p-4 dark:border-slate-800">
                <SheetTitle className="flex items-center justify-around dark:text-white">

                  <Logo />
                  <div className=""><ModeToggle /></div>

                </SheetTitle>
              <Separator className="w-2 text-gray-500"/>
              </SheetHeader>


              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-base px-3 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <hr className="my-3 dark:border-gray-700" />

                {!loading && authenticated && user ? (
                  <>
                    <div className="px-3 py-2 flex items-center gap-3 border dark:border-gray-700 rounded-md mb-3 dark:bg-slate-900">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage?.url} alt={user.name} />
                        <AvatarFallback>{<User className="h-8 bg-accent-foreground w-8 rounded-full"></User>}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      </div>
                    </div>

                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        Log out
                      </button>
                    </SheetClose>
                  </>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/auth/login"
                        className="block px-3 py-2 text-base text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                      >
                        Log in
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 text-base bg-primary text-white rounded-md dark:bg-primary dark:text-white"
                      >
                        Sign up
                      </Link>
                    </SheetClose>
                  </>
                )}
              </div>

            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
