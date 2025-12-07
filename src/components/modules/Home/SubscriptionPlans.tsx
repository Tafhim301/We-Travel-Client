"use client";
import { ArrowRight, WandSparkles } from "lucide-react";
import Link from "next/link";

export default function SubscriptionCTA() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="bg-gradient-to-r from-primary/20 to-primary/10 dark:from-primary/30 dark:to-primary/15 p-12 sm:p-16 rounded-3xl text-center border border-primary/25 shadow-2xl">
                
                {/* Heading */}
                <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-3">
                    Ready to Unlock Exclusive Travel Perks? <WandSparkles className="text-yellow-400 animate-pulse" />
                </h3>

                {/* Description */}
                <p className="mt-4 text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    Upgrade your experience to <span className="font-semibold text-primary">create unlimited trips</span>, access <span className="font-semibold text-primary">priority support</span>, and join <span className="font-semibold text-primary">exclusive teams</span>. Don&apos;t miss out on premium planning tools designed to make your adventures effortless.
                </p>

                {/* CTA Button */}
                <div className="mt-10">
                    <Link
                        href="/subscriptions"
                        className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full shadow-xl text-white bg-primary hover:bg-primary/95 transition duration-300 ease-in-out transform hover:scale-105"
                        aria-label="View all subscription plans and pricing"
                    >
                        View All Plans & Pricing
                        <ArrowRight className="ml-3 h-6 w-6" />
                    </Link>
                </div>

                {/* Trust/Support Note */}
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                    30-day money-back guarantee. No hassle, cancel anytime.
                </p>
            </div>
        </section>
    );
}
