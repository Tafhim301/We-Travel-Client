"use client";

import React from "react";
import { Globe, Users, Calendar } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            title: "Find or Create Trips",
            desc: "Search curated trips or create your own travel plan with dates, budget and details.",
            icon: Globe,
        },
        {
            title: "Join Trusted Teams",
            desc: "Connect with like-minded travelers and join teams that match your interests.",
            icon: Users,
        },
        {
            title: "Travel Together",
            desc: "Coordinate logistics, chat with teammates, and enjoy planned experiences together.",
            icon: Calendar,
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How We-Travel Works</h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    A simple, community-driven platform to plan trips, join teams, and
                    explore the world with people who share your interests.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {steps.map((s, idx) => {
                    const Icon = s.icon;
                    return (
                        <div
                            key={s.title}
                            className="p-6 rounded-lg bg-white dark:bg-card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                        >
                            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 dark:bg-primary/20 text-primary mb-4">
                                <Icon className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{s.title}</h3>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
