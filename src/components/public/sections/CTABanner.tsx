import React from 'react';
import { LeadCaptureForm } from '@/components/public/forms/LeadCaptureForm';

export interface CTABannerProps {
    section_label?: string;
    headline?: string;
    description?: string;
    cta_primary?: { label: string; url: string };
    cta_secondary?: { label: string; url: string };
}

export function CTABanner({
    section_label = "Next Batch Filling Fast",
    headline = "The Best Time to Start Was Yesterday.\nThe Second Best Is Now.",
    description = "Every week you wait is a week a competitor gets ahead. Join the analysts who chose to build skills that compound — and careers that last.",
    cta_primary = { label: "Reserve My Spot ↗", url: "https://www.analytixlabs.co.in" },
    cta_secondary = { label: "Download the Syllabus", url: "https://www.analytixlabs.co.in" }
}: CTABannerProps) {
    return (
        <section data-track-section={`cta_banner`} className="bg-[var(--navy)] relative overflow-hidden py-[100px] px-[5%]" id="enroll">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_700px_500px_at_50%_60%,rgba(0,217,126,0.12)_0%,transparent_65%),radial-gradient(ellipse_400px_300px_at_20%_10%,rgba(110,218,253,0.08)_0%,transparent_65%)]"></div>

            {/* Holo top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--grad)]"></div>

            <div className="relative z-10 w-full max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                {/* Text Content */}
                <div className="flex flex-col text-left">
                    <div className="section-label !text-[var(--teal)] !mr-auto !ml-0">{section_label}</div>
                    <h2 className="section-title !text-[var(--white)] whitespace-pre-line text-left">{headline}</h2>
                    <p className="section-desc !text-[rgba(255,255,255,0.6)] !ml-0 !mb-[2.5rem] text-left">{description}</p>

                    <div className="flex gap-4 flex-wrap relative z-10">
                        {/* We removed the primary CTA button because the form is now right here */}
                        <a data-track-click={`cta_banner_secondary`} href={cta_secondary.url} className="btn-secondary-custom !bg-[rgba(255,255,255,0.07)] !text-[rgba(255,255,255,0.85)] !border-[rgba(255,255,255,0.2)]">
                            {cta_secondary.label}
                        </a>
                    </div>
                </div>

                {/* Form Component */}
                <div className="relative w-full">
                    {/* Form glow effect */}
                    <div className="absolute inset-0 bg-[var(--teal)]/10 blur-[100px] rounded-full pointer-events-none"></div>
                    <LeadCaptureForm sourceName="cta_banner" buttonText="Reserve My Seat" />
                </div>

            </div>
        </section>
    );
}
