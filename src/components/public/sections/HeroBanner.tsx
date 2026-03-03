import React from 'react';
import { LeadCaptureForm } from '@/components/public/forms/LeadCaptureForm';

export interface HeroBannerProps {
    badge_text?: string;
    headline?: string;
    headline_highlight?: string;
    subheadline?: string;
    cta_primary?: { label: string; url: string };
    cta_secondary?: { label: string; url: string };
    stats?: { value: string; label: string }[];
    form?: {
        submit_label?: string;
        success_message?: string;
    };
}

export function HeroBanner({
    badge_text = "Nasscom FutureSkills Prime Certified · Batch Enrolling Now",
    headline = "The Last Data Course You'll Ever Need —",
    headline_highlight = "With AI Built In.",
    subheadline = "India's job market doesn't just want analysts anymore. It wants people who can build AI systems that think, act, and adapt. This 10.5-month program takes you from spreadsheets to autonomous AI agents — and gets you hired.",
    cta_primary = { label: "Reserve My Seat ↗", url: "#enroll" },
    cta_secondary = { label: "Explore the Curriculum", url: "#curriculum" },
    stats = [
        { value: "10.5mo", label: "Structured program" },
        { value: "38", label: "Live expert sessions" },
        { value: "₹25L", label: "Senior salary potential" }
    ],
    form
}: HeroBannerProps) {
    return (
        <section data-track-section={`hero_banner`} className="min-h-screen pt-[130px] pb-[100px] px-[5%] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-center relative z-10">
            <div className="hero-content">
                {badge_text && (
                    <div className="inline-flex items-center gap-2 bg-[rgba(110,218,253,0.1)] border border-[rgba(0,217,126,0.35)] text-[#1A4A8F] text-[0.73rem] font-bold tracking-[0.1em] uppercase py-1.5 px-4 rounded-full mb-7 fade-up">
                        <div className="w-[7px] h-[7px] bg-[var(--teal)] rounded-full animate-blink"></div>
                        {badge_text}
                    </div>
                )}

                <h1 className="font-sora text-[clamp(2.4rem,4vw,3.6rem)] font-extrabold text-[var(--navy)] leading-[1.15] tracking-tight mb-6 fade-up delay-100">
                    {headline} <span className="text-gradient">{headline_highlight}</span>
                </h1>

                {subheadline && (
                    <p className="text-[var(--muted)] text-[1.08rem] leading-[1.88] max-w-[530px] mb-9 fade-up delay-200">
                        {subheadline}
                    </p>
                )}

                {stats && stats.length > 0 && (
                    <div className="flex gap-11 mb-10 fade-up delay-300">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="stat">
                                <div className="font-sora text-[2.2rem] font-extrabold text-[var(--navy)] leading-[1.1]">{stat.value}</div>
                                <div className="text-[0.8rem] text-[var(--muted-light)] mt-1 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex gap-4 flex-wrap fade-up delay-400">
                    {cta_primary && (
                        <a data-track-click={`hero_primary_desktop`} href={cta_primary.url} className="btn-primary-custom">
                            {cta_primary.label}
                        </a>
                    )}
                    {cta_secondary && (
                        <a data-track-click={`hero_secondary_desktop`} href={cta_secondary.url} className="btn-secondary-custom">
                            {cta_secondary.label}
                        </a>
                    )}
                </div>
            </div>

            <div className="relative fade-up delay-600 z-10 hidden lg:block">
                {/* Form glow effect */}
                <div className="absolute inset-0 bg-[var(--teal)]/20 blur-[100px] rounded-full pointer-events-none"></div>

                <LeadCaptureForm sourceName="hero_banner" buttonText={form?.submit_label || "Apply Now"} />
            </div>
        </section>
    );
}
