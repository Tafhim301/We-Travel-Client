"use client";

import React from "react";
import HowItWorks from "./HowItWorks";
import DestinationsShowcase from "./DestinationsShowcase";
import SubscriptionPlans from "./SubscriptionPlans";
import FAQSection from "./FAQ";

export default function HomeSections() {
    return (
        <div>
            <HowItWorks />
            <DestinationsShowcase />
            <SubscriptionPlans />
            <FAQSection/>
        </div>
    );
}
