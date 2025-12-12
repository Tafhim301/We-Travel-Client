"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { XCircle, RefreshCcw, HelpCircle } from "lucide-react"; 

export default function PaymentFailed() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-background text-foreground">
    
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-slate-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <Card className="relative w-full max-w-2xl p-1 bg-linear-to-b from-red-500/50 to-red-500/10 border-none shadow-2xl overflow-hidden">
        <div className="bg-card p-8 md:p-16 rounded-[inherit] flex flex-col items-center text-center">
          
          <span className="px-3 py-1 text-xs font-semibold tracking-widest uppercase text-red-600 bg-red-500/10 rounded-full mb-6 flex items-center gap-2">
            <XCircle className="w-3 h-3" />
            Payment Failed
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/40">
            Oops!
          </h1>

          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-balance">
            We couldn&lsquo;t process your payment.
          </h2>

          <p className="max-w-md text-muted-foreground leading-relaxed mb-10 text-pretty">
            Your transaction was declined by the bank or payment provider. No funds have been deducted from your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            {/* Logic to retry current payment usually involves reloading or going back to checkout */}
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2 px-8 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-4 h-4" />
              Try Again
            </Button>
            
            <Link href="/contact">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto gap-2 px-8"
              >
                <HelpCircle className="w-4 h-4" />
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-8 text-sm text-muted-foreground/60">
        Error Code: PAY_ERR_502
      </p>
    </div>
  );
}