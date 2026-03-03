import React from 'react';

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
        <section data-track-section={`hero_banner`} className="min-h-screen pt-[130px] pb-[100px] px-[5%] grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative z-10">
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

            <div className="hero-card-wrap hidden lg:block fade-up delay-300">
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[24px] p-8 backdrop-blur-[24px] shadow-[0_24px_80px_rgba(0,217,126,0.1),inset_0_2px_0_rgba(110,218,253,0.3),inset_0_0_0_1px_rgba(255,255,255,0.8)] relative overflow-hidden">
                    {/* Holographic gloss */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--grad)] rounded-t-[24px]"></div>

                    <div className="flex items-center justify-between mb-6">
                        <div className="font-sora font-bold text-[1rem] text-[var(--navy)]">What You'll Walk Away With</div>
                        <div className="bg-[var(--grad)] text-[var(--navy)] font-sora font-bold text-[0.82rem] py-1.5 px-3.5 rounded-full">From ₹52,000</div>
                    </div>

                    <div className="flex gap-1.5 mb-6">
                        <div className="flex-1 p-[0.55rem] rounded-lg text-[0.78rem] font-semibold text-center cursor-pointer transition-all bg-[var(--grad)] text-[var(--navy)]">Core Analytics</div>
                        <div className="flex-1 p-[0.55rem] rounded-lg text-[0.78rem] font-semibold text-center cursor-pointer transition-all border border-[var(--border)] text-[var(--muted)]">+ AI Track</div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-start gap-3 p-3 bg-[rgba(110,218,253,0.05)] rounded-xl border border-[rgba(110,218,253,0.12)] hover:bg-[rgba(0,217,126,0.07)] hover:border-[rgba(0,217,126,0.2)] transition-all">
                            <div className="w-[34px] h-[34px] bg-[var(--grad-soft)] rounded-md flex items-center justify-center text-[1rem] shrink-0">📊</div>
                            <div className="text-[var(--muted)] text-[0.85rem] leading-[1.6]">
                                <strong className="text-[var(--navy)] block font-semibold text-[0.875rem] mb-[0.1rem]">Excel, SQL & Power BI — Actually Mastered</strong>
                                Built, tested, and presented to real business problems.
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-[rgba(110,218,253,0.05)] rounded-xl border border-[rgba(110,218,253,0.12)] hover:bg-[rgba(0,217,126,0.07)] hover:border-[rgba(0,217,126,0.2)] transition-all">
                            <div className="w-[34px] h-[34px] bg-[var(--grad-soft)] rounded-md flex items-center justify-center text-[1rem] shrink-0">🐍</div>
                            <div className="text-[var(--muted)] text-[0.85rem] leading-[1.6]">
                                <strong className="text-[var(--navy)] block font-semibold text-[0.875rem] mb-[0.1rem]">Python That Does Real Work</strong>
                                Clean data, build predictive models, automate workflows.
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-[rgba(110,218,253,0.05)] rounded-xl border border-[rgba(110,218,253,0.12)] hover:bg-[rgba(0,217,126,0.07)] hover:border-[rgba(0,217,126,0.2)] transition-all">
                            <div className="w-[34px] h-[34px] bg-[var(--grad-soft)] rounded-md flex items-center justify-center text-[1rem] shrink-0">🤖</div>
                            <div className="text-[var(--muted)] text-[0.85rem] leading-[1.6]">
                                <strong className="text-[var(--navy)] block font-semibold text-[0.875rem] mb-[0.1rem]">AI Agents You Actually Deploy</strong>
                                LangChain, CrewAI, AutoGen — systems that work around the clock.
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-[rgba(110,218,253,0.05)] rounded-xl border border-[rgba(110,218,253,0.12)] hover:bg-[rgba(0,217,126,0.07)] hover:border-[rgba(0,217,126,0.2)] transition-all">
                            <div className="w-[34px] h-[34px] bg-[var(--grad-soft)] rounded-md flex items-center justify-center text-[1rem] shrink-0">🚀</div>
                            <div className="text-[var(--muted)] text-[0.85rem] leading-[1.6]">
                                <strong className="text-[var(--navy)] block font-semibold text-[0.875rem] mb-[0.1rem]">A Portfolio That Gets You Hired</strong>
                                Real capstone projects in banking, retail, healthcare, telecom.
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-5 border-t border-[rgba(110,218,253,0.15)] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[var(--muted)] text-[0.73rem]">
                            <div className="w-[28px] h-[28px] bg-[rgba(247,201,72,0.12)] rounded-md flex items-center justify-center text-[0.85rem]">🛡️</div>
                            <div>Nasscom-FutureSkills<br />Prime Certified</div>
                        </div>
                        {form?.submit_label ? (
                            <a data-track-click={`hero_card_enroll`} href="#enroll" className="btn-primary-custom !text-[0.82rem] !py-2.5 !px-[1.1rem]">{form.submit_label}</a>
                        ) : (
                            <a data-track-click={`hero_card_enroll`} href="#enroll" className="btn-primary-custom !text-[0.82rem] !py-2.5 !px-[1.1rem]">Enroll →</a>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
}
