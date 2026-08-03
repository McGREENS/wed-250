"use client";

import { ExploreIcon, PlanIcon, MatchIcon, ManageIcon } from "./animated-icons";

const steps = [
    {
        Icon: ExploreIcon,
        title: "Explore",
        desc: "Discover Rwanda's finest venues and elite vendors.",
        color: "text-blue-600",
        bg: "bg-blue-50",
    },
    {
        Icon: PlanIcon,
        title: "Build Plan",
        desc: "Set your budget, dates, and guest list in minutes.",
        color: "text-purple-600",
        bg: "bg-purple-50",
    },
    {
        Icon: MatchIcon,
        title: "Get Matched",
        desc: "AI-powered recommendations tailored to your style.",
        color: "text-amber-600",
        bg: "bg-amber-50",
    },
    {
        Icon: ManageIcon,
        title: "Manage",
        desc: "Track tasks, payments, and bookings in one dashboard.",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
    },
];

export default function AnimatedIconsSection() {
    return (
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-[60px] left-0 w-full h-[2px] bg-gray-100 -z-10" />

            {steps.map((step, idx) => {
                const { Icon } = step;
                return (
                    <div
                        key={idx}
                        className="group relative bg-white p-8 rounded-2xl border border-gray-200 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300"
                    >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-burgundy/0 to-gold/0 group-hover:from-burgundy/5 group-hover:to-gold/5 transition-all duration-500 pointer-events-none" />

                        <div className="absolute top-4 right-4 text-6xl font-serif text-gray-50 opacity-0 group-hover:opacity-100 group-hover:text-gray-100 transition-all duration-500 select-none pointer-events-none translate-y-4 group-hover:translate-y-0">
                            0{idx + 1}
                        </div>

                        <div className={`w-20 h-20 ${step.bg} rounded-2xl flex items-center justify-center mb-8 mx-auto relative overflow-hidden group-hover:rotate-3 transition-transform duration-500`}>
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-current ${step.color}`} />
                            <Icon className={`w-12 h-12 ${step.color} relative z-10 transition-transform duration-500 group-hover:scale-110`} />
                        </div>

                        <div className="text-center relative z-10">
                            <h3 className="text-2xl font-serif text-charcoal mb-4 group-hover:text-burgundy transition-colors duration-300">
                                {step.title}
                            </h3>
                            <p className="text-gray-500 font-light leading-relaxed group-hover:text-gray-600">
                                {step.desc}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
