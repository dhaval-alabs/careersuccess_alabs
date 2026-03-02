import React from 'react';

export interface SalaryLevel {
    label: string;
    percentage: number;
    amount: string;
}

export interface StatItem {
    big_text: string;
    small_text: string;
}

export interface SalaryStatsProps {
    section_label?: string;
    headline?: string;
    description?: string;
    salary_levels?: SalaryLevel[];
    stats?: StatItem[];
    cert_title?: string;
    cert_desc?: string;
}

export function SalaryStats({
    section_label = "Earning Potential",
    headline = "Skills That Pay More Than a Promotion Would",
    description = "AI-fluent analysts are commanding salaries that would take most people 5 years of promotions to reach. The premium is real, and it's growing.",
    salary_levels = [
        { label: "Entry Level", percentage: 30, amount: "~₹6 LPA" },
        { label: "Mid-Level", percentage: 70, amount: "~₹20 LPA" },
        { label: "Senior", percentage: 90, amount: "~₹25 LPA" }
    ],
    stats = [
        { big_text: "20–30%", small_text: "Higher salary vs. traditional analyst roles" },
        { big_text: "5+", small_text: "Industry sectors covered in live projects" }
    ],
    cert_title = "Nasscom + AnalytixLabs Dual Certification",
    cert_desc = "Backed by the Government of India's MeitY-NASSCOM initiative — respected by top recruiters nationwide"
}: SalaryStatsProps) {
    return (
        <section className="py-[100px] px-[5%] bg-transparent relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div>
                    <div className="section-label">{section_label}</div>
                    <h2 className="section-title whitespace-pre-line">{headline}</h2>
                    <p className="section-desc">{description}</p>

                    <div className="max-w-[520px]">
                        {salary_levels.map((level, idx) => (
                            <div key={idx} className="flex items-center gap-4 mb-5 group">
                                <div className="w-[90px] shrink-0 text-[0.85rem] font-medium text-[var(--muted)] text-right">
                                    {level.label}
                                </div>
                                <div className="flex-1 bg-[rgba(110,218,253,0.15)] rounded-full h-[10px] overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-[var(--grad)] transform origin-left transition-transform duration-1000 ease-out`}
                                        style={{
                                            width: `${level.percentage}%`
                                            // In a real app we might use intersection observer to trigger animation
                                            // For now relying on Tailwind's arbitrary values or inline styles
                                        }}
                                    ></div>
                                </div>
                                <div className="w-[85px] shrink-0 font-sora font-bold text-[0.95rem] text-[var(--navy)]">
                                    {level.amount}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {stats.map((stat, idx) => (
                        <div key={idx} className="bg-[var(--white)] border border-[var(--border)] rounded-[16px] p-7 text-center shadow-[0_2px_16px_rgba(110,218,253,0.07)] transition-shadow duration-200 hover:shadow-[0_8px_32px_rgba(0,217,126,0.1)]">
                            <div className="font-sora text-[2.1rem] font-extrabold leading-[1.1] mb-2 text-[var(--navy)]">
                                {stat.big_text}
                            </div>
                            <div className="text-[0.85rem] text-[var(--muted)] leading-[1.6]">
                                {stat.small_text}
                            </div>
                        </div>
                    ))}

                    {cert_title && (
                        <div className="col-span-1 sm:col-span-2 bg-[linear-gradient(135deg,var(--navy),var(--navy-mid))] rounded-[16px] p-7 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--grad)]"></div>
                            <h3 className="font-sora text-[1.1rem] font-bold mb-2 text-[var(--sky)]">
                                {cert_title}
                            </h3>
                            <p className="text-[0.875rem] text-[rgba(255,255,255,0.58)] leading-[1.7]">
                                {cert_desc}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
