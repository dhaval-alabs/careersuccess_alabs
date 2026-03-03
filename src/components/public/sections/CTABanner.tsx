
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
    cta_secondary = { label: "Download the Syllabus", url: "https://www.analytixlabs.co.in" }
}: CTABannerProps) {
    return (
        <section data-track-section={`cta_banner`} className="bg-[var(--navy)] relative overflow-hidden py-[100px] px-[5%]" id="enroll">
            {/* Background blobs */}
            <div className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_700px_500px_at_50%_60%,rgba(0,217,126,0.12)_0%,transparent_65%),radial-gradient(ellipse_400px_300px_at_20%_10%,rgba(110,218,253,0.08)_0%,transparent_65%)]"></div>

            {/* Holo top border */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--grad)]"></div>

            <div className="relative z-10 w-full max-w-[800px] mx-auto text-center">

                {/* Text Content */}
                <div className="flex flex-col items-center">
                    <div className="section-label !text-[var(--teal)]">{section_label}</div>
                    <h2 className="section-title !text-[var(--white)] whitespace-pre-line text-center">{headline}</h2>
                    <p className="section-desc !text-[rgba(255,255,255,0.6)] !mx-auto !mb-[2.5rem] text-center">{description}</p>

                    <div className="flex gap-4 flex-wrap relative z-10 justify-center">
                        <a data-track-click={`cta_banner_secondary`} href={cta_secondary.url} className="btn-secondary-custom !bg-[rgba(255,255,255,0.07)] !text-[rgba(255,255,255,0.85)] !border-[rgba(255,255,255,0.2)]">
                            {cta_secondary.label}
                        </a>
                        <a href="#enroll" className="btn-primary-custom">
                            Enquire Now ↗
                        </a>
                    </div>
                </div>

            </div>
        </section>
    );
}
