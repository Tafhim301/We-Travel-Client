"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

const destinations = [
    {
        name: "Bali, Indonesia",
        img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    },
    {
        name: "Eiffel Tower, Paris",
        img: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        name: "Kyoto, Japan",
        img: "https://images.unsplash.com/photo-1549693578-d683be217e58?q=80&w=1200&auto=format&fit=crop",
    },
    {
        name: "Marrakesh, Morocco",
        img: "https://plus.unsplash.com/premium_photo-1697730075333-822144628df6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bWFycmFrZXNofGVufDB8fDB8fHww",
    },
];

export default function DestinationsShowcase() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Explore Destinations</h3>
                <Link href="/explore" className="text-sm text-primary hover:underline">
                    See more
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((d) => (
                    <article
                        key={d.name}
                        className="rounded-lg overflow-hidden bg-white dark:bg-card border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                        <div className="relative h-48 w-full">
                            <Image src={d.img} alt={d.name} fill className="object-cover" />
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{d.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Explore with our experienced teams and curated itineraries.</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
