import React from 'react';

export interface FooterProps {
    year?: number;
    company_name?: string;
    website_url?: string;
    website_label?: string;
    cert_text?: string;
    initiative_text?: string;
}

export function Footer({
    year = new Date().getFullYear(),
    company_name = "AnalytixLabs",
    website_url = "https://www.analytixlabs.co.in",
    website_label = "analytixlabs.co.in",
    cert_text = "A Nasscom-FutureSkills Prime Certified Program",
    initiative_text = "MeitY–NASSCOM Initiative"
}: FooterProps) {
    return (
        <footer className="bg-[var(--navy)] border-t border-[rgba(110,218,253,0.08)] text-[rgba(255,255,255,0.38)] text-center py-8 px-[5%] text-[0.82rem] relative z-10">
            <p>
                © {year} {company_name}. All rights reserved. &nbsp;|&nbsp;
                <a
                    href={website_url}
                    className="text-[rgba(255,255,255,0.5)] no-underline transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-[var(--grad)]"
                >
                    {website_label}
                </a> &nbsp;|&nbsp;
                {cert_text} &nbsp;|&nbsp; {initiative_text}
            </p>
        </footer>
    );
}
