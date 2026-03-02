import React from 'react';

export interface TrackItem {
    style: "primary" | "secondary";
    label: string;
    title: string;
    description: string;
    price: string;
    price_note: string;
    cta_label: string;
    cta_url: string;
}

export interface TracksFeesProps {
    section_label?: string;
    headline?: string;
    description?: string;
    tracks?: TrackItem[];
    guarantee?: {
        icon: string;
        title: string;
        description: string;
        cta_label: string;
        cta_url: string;
    };
}

export function TracksFees({
    section_label = "Choose Your Path",
    headline = "Pick the Track That Matches Your Ambition",
    description = "Most working professionals go for Track 2. The job market rewards people who bridge analytics and AI — and the salary difference speaks for itself.",
    tracks = [
        {
            style: "primary",
            label: "Track 1",
            title: "Core Data Analytics",
            description: "The complete foundation every analyst needs. Master Excel, SQL, Power BI, Python, and predictive modeling through real industry projects. Perfect if you're new to the field.",
            price: "₹52,000",
            price_note: "+ GST  ·  6 months  ·  38 classes",
            cta_label: "Start with Core →",
            cta_url: "#enroll"
        },
        {
            style: "secondary",
            label: "Track 2 — Most Popular ✦",
            title: "Data Analytics + AI",
            description: "Everything in Core, then further. Add Generative AI, No-Code Agentic workflows, and Python-powered autonomous systems on top of a rock-solid analytics base.",
            price: "₹58,000",
            price_note: "+ GST  ·  10.5 months  ·  Full AI stack",
            cta_label: "Go All-In on AI →",
            cta_url: "#enroll"
        }
    ],
    guarantee = {
        icon: "🛡️",
        title: "We Back It With a Real Guarantee",
        description: "If you complete the program and aren't placed within 6 months, we refund 50% of your fees. No fine print. No runaround. We succeed when you do.",
        cta_label: "Claim Your Seat →",
        cta_url: "#enroll"
    }
}: TracksFeesProps) {
    return (
        <section className="py-[100px] px-[5%] bg-transparent relative z-10" id="tracks">
            <div className="section-label">{section_label}</div>
            <h2 className="section-title whitespace-pre-line">{headline}</h2>
            <p className="section-desc">{description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {tracks.map((track, idx) => {
                    const isPrimary = track.style === "primary";
                    return (
                        <div
                            key={idx}
                            className={`
                rounded-[20px] p-8 transition-all duration-200 relative overflow-hidden hover:-translate-y-1
                ${isPrimary
                                    ? 'bg-[linear-gradient(145deg,var(--navy)_0%,var(--navy-mid)_100%)] border border-[rgba(0,217,126,0.15)] shadow-[0_16px_56px_rgba(11,26,61,0.18)]'
                                    : 'bg-[var(--white)] border-[1.5px] border-[rgba(0,217,126,0.3)] shadow-[0_8px_40px_rgba(0,217,126,0.1)]'}
              `}
                        >
                            {/* Top border holographic strip */}
                            <div className={`absolute top-0 left-0 right-0 h-[2px] ${isPrimary ? 'bg-[var(--grad)]' : 'bg-[var(--grad-r)]'}`}></div>

                            {/* Bottom right glow for primary */}
                            {isPrimary && (
                                <div className="absolute -bottom-[60px] -right-[60px] w-[220px] h-[220px] bg-[radial-gradient(circle,rgba(0,217,126,0.08),transparent_70%)]"></div>
                            )}

                            <div className={`text-[0.7rem] font-bold tracking-[0.1em] uppercase mb-3 ${isPrimary ? 'text-[rgba(255,255,255,0.45)]' : 'text-[#1A5FBF]'}`}>
                                {track.label}
                            </div>

                            <h3 className={`font-sora font-bold text-[1.35rem] mb-[0.85rem] leading-[1.3] ${isPrimary ? 'text-[var(--white)]' : 'text-[var(--navy)]'}`}>
                                {track.title}
                            </h3>

                            <p className={`text-[0.92rem] leading-[1.82] mb-6 ${isPrimary ? 'text-[rgba(255,255,255,0.6)]' : 'text-[var(--muted)]'}`}>
                                {track.description}
                            </p>

                            <div className={`font-sora text-[1.85rem] font-extrabold mb-1 ${isPrimary ? 'text-[var(--white)]' : 'text-[var(--navy)]'}`}>
                                {track.price}
                            </div>

                            <div className={`text-[0.75rem] mb-[1.35rem] ${isPrimary ? 'text-[rgba(255,255,255,0.38)]' : 'text-[var(--muted-light)]'}`}>
                                {track.price_note}
                            </div>

                            <a
                                href={track.cta_url}
                                className={isPrimary ? "btn-secondary-custom !text-[0.875rem] !bg-[rgba(255,255,255,0.08)] !text-white !border-[rgba(255,255,255,0.2)]" : "btn-primary-custom !text-[0.875rem]"}
                            >
                                {track.cta_label}
                            </a>
                        </div>
                    );
                })}
            </div>

            {guarantee && (
                <div className="bg-[var(--white)] border-[1.5px] border-[rgba(0,217,126,0.2)] rounded-[18px] p-6 lg:p-8 flex flex-col md:flex-row gap-7 items-start md:items-center shadow-[0_6px_32px_rgba(0,217,126,0.07)] relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--grad)]"></div>

                    <div className="text-[2.5rem] leading-none shrink-0">{guarantee.icon}</div>

                    <div className="flex-1">
                        <div className="font-sora font-bold text-[var(--navy)] mb-1 text-[1.05rem]">
                            {guarantee.title}
                        </div>
                        <div className="text-[0.9rem] text-[var(--muted)] leading-[1.7]">
                            {guarantee.description}
                        </div>
                    </div>

                    <a href={guarantee.cta_url} className="btn-primary-custom shrink-0">
                        {guarantee.cta_label}
                    </a>
                </div>
            )}
        </section>
    );
}
