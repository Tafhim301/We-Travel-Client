"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { AlertCircle, ShoppingCart, ArrowLeft } from "lucide-react"; 

export default function PaymentCancelled() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background text-foreground">
    
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      {/* Amber/Yellow Gradient for Cancellation */}
      <Card className="relative w-full max-w-2xl p-1 bg-linear-to-b from-amber-500/50 to-amber-500/10 border-none shadow-2xl overflow-hidden">
        <div className="bg-card p-8 md:p-16 rounded-[inherit] flex flex-col items-center text-center">
          
          <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase text-amber-600 bg-amber-500/10 rounded-full mb-6 flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            Cancelled
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/40">
            Aborted.
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
            You cancelled the payment process.
          </h2>

          <p className="max-w-md text-muted-foreground leading-relaxed mb-10 text-pretty">
            No charges were made. Your items are still saved in your cart if you decide to complete the purchase later.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/cart">
              <Button size="lg" className="w-full sm:w-auto gap-2 px-8">
                <ShoppingCart className="w-4 h-4" />
                Return to Cart
              </Button>
            </Link>
            
            <Link href="/">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto gap-2 px-8"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground/60">
        Have questions? <Link href="/contact" className="underline hover:text-primary">Chat with us</Link>.
      </p>
    </div>
  );
}