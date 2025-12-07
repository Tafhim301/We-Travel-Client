"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { MoveLeft, Home } from "lucide-react"; 

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background text-foreground transition-colors duration-500">
      {/* Decorative background element for elegance */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <Card className="relative w-full max-w-2xl p-1 bg-linear-to-b from-border/50 to-border/10 border-none shadow-2xl overflow-hidden">
        <div className="bg-card p-8 md:p-16 rounded-[inherit] flex flex-col items-center text-center">
          
          {/* Subtle rich text badge */}
          <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase text-primary bg-primary/10 rounded-full mb-6">
            Error 404
          </span>

          <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/40">
            Lost?
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
            This page has drifted into the void.
          </h2>

          <p className="max-w-md text-muted-foreground leading-relaxed mb-10 text-pretty">
            We couldn&#39;t find the page you&#39;re looking for. It might have been moved, 
            deleted, or never existed in the first place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8">
                <Home className="w-4 h-4" />
                Return to Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto gap-2 px-8"
              onClick={() => window.history.back()}
            >
              <MoveLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>
        </div>
      </Card>

      {/* Footer support text */}
      <p className="mt-8 text-sm text-muted-foreground/60">
        If you think this is a mistake, please <Link href="/contact" className="underline hover:text-primary">contact support</Link>.
      </p>
    </div>
  );
}