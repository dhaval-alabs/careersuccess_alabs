import React from 'react';

export interface ComparisonTableRow {
    scenario: string;
    traditional: string;
    graduate: string;
}

export interface ComparisonTableProps {
    section_label?: string;
    headline?: string;
    description?: string;
    col_header_scenario?: string;
    col_header_traditional?: string;
    col_header_graduate?: string;
    rows?: ComparisonTableRow[];
}

export function ComparisonTable({
    section_label = "Why This Course",
    headline = "Your Colleagues Are Still Copy-Pasting from Excel.\nYou Won't Be.",
    description = "The gap between an AI-enabled analyst and a traditional one isn't closing — it's widening every quarter. Here's what that looks like day to day.",
    col_header_scenario = "Everyday Scenario",
    col_header_traditional = "The Traditional Analyst",
    col_header_graduate = "The AnalytixLabs Graduate ✦",
    rows = [
        {
            scenario: "Prepping data for a presentation",
            traditional: "Half a day of manual cleaning, formatting, and praying the VLOOKUP doesn't break",
            graduate: "GenAI scripts validate, clean and restructure the data in minutes — every time, without errors"
        },
        {
            scenario: "Writing a complex SQL query",
            traditional: "Stack Overflow tabs, trial and error, a 45-minute debugging spiral",
            graduate: "Describe the problem in plain English. Get production-ready SQL — optimised and explained — instantly"
        },
        {
            scenario: "Sending the monthly report",
            traditional: "Rebuild the same dashboard manually, update the numbers, email it by EOD Friday",
            graduate: "An AI agent pulls live data, writes the narrative, generates visuals and sends the report — without being asked"
        },
        {
            scenario: "Something breaks in the pipeline",
            traditional: "A panicked Slack message at 11pm after someone noticed wrong numbers in the board deck",
            graduate: "Self-healing systems catch the anomaly, trace the source and suggest a fix — before anyone even notices"
        },
        {
            scenario: "Forecasting next quarter",
            traditional: "Extend a trend line in Excel and add a caveat: \"subject to change\"",
            graduate: "A Python-powered predictive model trained on your actual business data, continuously updated and always on"
        },
        {
            scenario: "Your position in 3 years",
            traditional: "Increasingly vulnerable as AI replaces the repetitive parts of the analyst's job",
            graduate: "You're the architect of the AI — the person companies can't afford to lose"
        }
    ]
}: ComparisonTableProps) {
    return (
        <section className="py-[100px] px-[5%] bg-transparent relative z-10" id="why">
            <div className="section-label">{section_label}</div>
            {/* Whitespace pre-line handles \n in the headline */}
            <h2 className="section-title whitespace-pre-line">{headline}</h2>
            <p className="section-desc">{description}</p>

            <div className="overflow-x-auto rounded-[20px]">
                <table className="w-full border-collapse bg-[var(--white)] rounded-[20px] overflow-hidden shadow-[0_8px_48px_rgba(0,217,126,0.1),0_0_0_1px_rgba(110,218,253,0.15)] text-[0.88rem]">
                    <thead>
                        <tr className="bg-[var(--navy)]">
                            <th className="p-[1.25rem_1.4rem] text-left text-[var(--white)] font-sora text-[0.83rem] font-semibold tracking-[0.02em]">{col_header_scenario}</th>
                            <th className="p-[1.25rem_1.4rem] text-left text-[var(--white)] font-sora text-[0.83rem] font-semibold tracking-[0.02em]">{col_header_traditional}</th>
                            <th className="p-[1.25rem_1.4rem] text-left text-[var(--white)] font-sora text-[0.83rem] font-semibold tracking-[0.02em] bg-[linear-gradient(135deg,var(--teal-dark),var(--sky-dark))]">{col_header_graduate}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-[rgba(110,218,253,0.03)] group transition-colors">
                                <td className="p-[1.1rem_1.4rem] border-b border-[rgba(110,218,253,0.1)] text-[var(--navy)] font-semibold align-top text-[0.9rem] leading-[1.75] group-last:border-b-0">
                                    {row.scenario}
                                </td>
                                <td className="p-[1.1rem_1.4rem] border-b border-[rgba(110,218,253,0.1)] text-[#4A5568] align-top text-[0.9rem] leading-[1.75] group-last:border-b-0">
                                    {row.traditional}
                                </td>
                                <td className="p-[1.1rem_1.4rem] border-b border-[rgba(110,218,253,0.1)] align-top text-[0.9rem] leading-[1.75] bg-[rgba(0,217,126,0.03)] border-l-2 border-l-[rgba(0,217,126,0.3)] text-[var(--navy-mid)] group-hover:bg-[rgba(0,217,126,0.06)] group-last:border-b-0">
                                    {row.graduate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
