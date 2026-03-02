import React from 'react';

export interface LearningMode {
    icon: string;
    title: string;
    description: string;
}

export interface LearningModesProps {
    section_label?: string;
    headline?: string;
    description?: string;
    modes?: LearningMode[];
}

export function LearningModes({
    section_label = "Flexibility",
    headline = "Your Life Doesn't Pause for Learning. Neither Does Ours.",
    description = "Whether you're a full-time professional, a recent grad, or someone switching careers at 35 — there's a format built for your situation.",
    modes = [
        { icon: "💻", title: "Self-Paced Online", description: "Learn at midnight if that's when you're sharpest. Up to 24 months of LMS access means no deadline panic." },
        { icon: "🎥", title: "Live Online", description: "Real instructors, real questions, real cohort energy — from the comfort of your own desk." },
        { icon: "🏫", title: "Classroom Bootcamp", description: "Prefer face-to-face? Join us in Gurgaon, Bangalore, or Noida for an immersive, high-focus experience." },
        { icon: "📅", title: "Weekend Classes", description: "Keep your job. Build your future. Saturday and Sunday sessions designed around a working professional's week." }
    ]
}: LearningModesProps) {
    return (
        <section className="py-[100px] px-[5%] relative z-10">
            <div className="section-label">{section_label}</div>
            <h2 className="section-title whitespace-pre-line">{headline}</h2>
            <p className="section-desc">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {modes.map((mode, idx) => (
                    <div
                        key={idx}
                        className="p-7 rounded-[16px] bg-[var(--white)] border border-[var(--border)] text-center transition-all duration-200 shadow-[0_2px_16px_rgba(110,218,253,0.06)] hover:shadow-[0_10px_36px_rgba(0,217,126,0.12)] hover:border-[rgba(0,217,126,0.3)] hover:-translate-y-1"
                    >
                        <div className="text-[2rem] mb-[0.9rem] leading-none">{mode.icon}</div>
                        <div className="font-sora font-bold text-[var(--navy)] mb-2 text-[1rem]">
                            {mode.title}
                        </div>
                        <div className="text-[0.875rem] text-[var(--muted)] leading-[1.72]">
                            {mode.description}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
