import React from 'react';

export interface TrustStripProps {
    items?: { icon: string; label: string }[];
}

export function TrustStrip({
    items = [
        { icon: "🎓", label: "Nasscom-FutureSkills Prime Certified" },
        { icon: "🏢", label: "Campuses in Gurgaon, Bangalore & Noida" },
        { icon: "💼", label: "Job Guarantee — or 50% of Your Fee Back" },
        { icon: "🕐", label: "Online · Blended · Bootcamp · Weekend" },
        { icon: "📅", label: "Up to 24 Months LMS Access" }
    ]
}: TrustStripProps) {
    return (
        <div className="bg-[var(--white)] border-y border-[rgba(110,218,253,0.2)] py-[1.15rem] px-[5%] flex items-center justify-center gap-12 flex-wrap shadow-[0_2px_20px_rgba(0,217,126,0.05)] relative z-10">
            {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[0.83rem] font-medium text-[#2A3A52]">
                    <span className="text-[1rem]">{item.icon}</span> {item.label}
                </div>
            ))}
        </div>
    );
}
