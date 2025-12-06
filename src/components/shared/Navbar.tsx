"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mountain, LogOut } from "lucide-react";

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

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // mock state
  const pathname = usePathname();


  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore", href: "/explore" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "About", href: "/about" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-300",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        {/* LOGO */}
      <Logo />

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center space-x-8">
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
        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 rounded-full h-9 w-9">
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium leading-none">
                      John Doe
                    </p>
                    <p className="text-xs text-muted-foreground">
                      john@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href="/travel/create">Create Travel Plan</Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setIsLoggedIn(false)}
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
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0">
              <SheetHeader className="p-4">
                <SheetTitle className="flex items-center">
                  <Mountain className="h-5 w-5 mr-2 text-primary" />
                  Travel Buddy
                </SheetTitle>
              </SheetHeader>

              {/* MOBILE LINKS */}
              <div className="px-4 py-4 space-y-2">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="block text-base px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}

                <hr className="my-3" />

                {isLoggedIn ? (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      >
                        Dashboard
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <button
                        onClick={() => setIsLoggedIn(false)}
                        className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
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
                        className="block px-3 py-2 text-base hover:bg-gray-100 rounded-md"
                      >
                        Log in
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/auth/register"
                        className="block px-3 py-2 text-base bg-primary text-white rounded-md"
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
