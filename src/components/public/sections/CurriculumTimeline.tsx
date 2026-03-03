import React from 'react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

export interface CurriculumTermTool {
    label: string;
    is_ai_tag?: boolean;
}

export interface CurriculumTerm {
    name: string;
    duration: string;
    tools: CurriculumTermTool[];
    description: string;
}

export interface CurriculumTimelineProps {
    section_label?: string;
    headline?: string;
    description?: string;
    terms?: CurriculumTerm[];
}

export function CurriculumTimeline({
    section_label = "Curriculum",
    headline = "10.5 Months. Six Phases. One Career Transformation.",
    description = "Every module is sequenced so your skills compound. By the time you graduate, you won't just know the tools — you'll know exactly when and why to use each one.",
    terms = [
        {
            name: "Foundations — Get Everyone on the Same Page",
            duration: "0.5 Month",
            tools: [{ label: "MS Excel", is_ai_tag: false }, { label: "Basic Statistics", is_ai_tag: false }],
            description: "No background? No problem. We start by making sure everyone can read data, spot a trend, and ask the right business question — before we touch a single line of code."
        },
        {
            name: "Term 1 — The Analyst's Core Toolkit",
            duration: "3 Months",
            tools: [{ label: "Excel" }, { label: "SQL" }, { label: "Power BI" }, { label: "MS SQL Server" }],
            description: "This is where most analytics careers begin — and where most courses stop. You'll go deep on advanced SQL, build dynamic Power BI dashboards with DAX, and learn to tell a data story that actually changes minds in a boardroom."
        },
        {
            name: "Term 2 — Python for People Who Mean Business",
            duration: "2 Months",
            tools: [{ label: "Python" }, { label: "NumPy" }, { label: "Pandas" }, { label: "Matplotlib" }, { label: "Seaborn" }],
            description: "Forget toy exercises. You'll use Python to wrangle real, messy datasets — the kind with missing values, inconsistent formats, and surprises buried in row 47,000."
        },
        {
            name: "Term 3 — Make Predictions, Not Just Observations",
            duration: "1 Month",
            tools: [{ label: "Linear Regression" }, { label: "Logistic Regression" }, { label: "Hypothesis Testing" }],
            description: "Statistics isn't about formulas — it's about confidence. Capstone: build a real \"Probability of Default\" model for a banking dataset."
        },
        {
            name: "Term 4 — Let AI Do the Boring Parts",
            duration: "1 Month",
            tools: [{ label: "GenAI Tools", is_ai_tag: true }, { label: "Prompt Engineering", is_ai_tag: true }, { label: "AI Extensions", is_ai_tag: true }],
            description: "Traditional analysts spend 80% of their time on tasks that AI can now handle in seconds. Use GenAI to write SQL, clean data, build Power BI narratives, and debug Python."
        },
        {
            name: "Term 5 — Build AI Agents That Work While You Don't",
            duration: "1.5 Months",
            tools: [{ label: "GPT / Claude LLMs", is_ai_tag: true }, { label: "Zapier", is_ai_tag: true }, { label: "Make.com", is_ai_tag: true }, { label: "n8n", is_ai_tag: true }],
            description: "No-code doesn't mean low-power. Build AI agents that monitor live data, trigger automated reports, handle customer queries — all without writing a backend from scratch."
        },
        {
            name: "Term 6 — Become the Person Who Builds the Systems",
            duration: "3 Months",
            tools: [{ label: "LangChain", is_ai_tag: true }, { label: "LangGraph", is_ai_tag: true }, { label: "CrewAI", is_ai_tag: true }, { label: "AutoGen", is_ai_tag: true }, { label: "FAISS / Pinecone", is_ai_tag: true }, { label: "FastAPI", is_ai_tag: true }, { label: "Streamlit", is_ai_tag: true }],
            description: "Build multi-agent AI systems that reason, delegate tasks, search knowledge bases, and generate reports autonomously. Capstone: a fully deployed \"Digital Analyst\" — on its own."
        }
    ]
}: CurriculumTimelineProps) {
    return (
        <section className="py-[100px] px-[5%] relative z-10" id="curriculum">
            <div className="section-label">{section_label}</div>
            <h2 className="section-title whitespace-pre-line">{headline}</h2>
            <p className="section-desc !text-slate-600 font-medium max-w-2xl">{description}</p>

            <div className="max-w-[1280px] mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-12 xl:gap-20 items-start mt-12">

                {/* Left side: Timeline Container */}
                <div className="relative pl-[2.5rem] w-full before:absolute before:left-[10px] before:top-[14px] before:bottom-[14px] before:w-[2px] before:bg-[linear-gradient(to_bottom,var(--teal),var(--sky),var(--teal))] before:rounded-[2px] before:opacity-60 timeline-container">
                    {terms.map((term, idx) => (
                        <div key={idx} className="relative mb-[2.25rem] pl-[2rem] transition-all duration-500 ease-in-out hover:-translate-y-1 group fade-up timeline-item">
                            {/* Timeline Dot */}
                            <div className="absolute -left-[2rem] top-[10px] w-[20px] h-[20px] bg-[var(--grad)] border-3 border-[var(--white)] rounded-full shadow-[0_0_0_3px_rgba(0,217,126,0.25),0_4px_16px_rgba(0,217,126,0.3)] transition-transform duration-200 group-hover:scale-125"></div>

                            <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                                <div className="font-sora font-bold text-[1.05rem] text-[var(--navy)]">{term.name}</div>
                                <div className="bg-[rgba(110,218,253,0.1)] border border-[rgba(110,218,253,0.3)] text-[#1A4A8F] text-[0.73rem] font-semibold py-1 px-3 rounded-full whitespace-nowrap">
                                    {term.duration}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 mb-[0.6rem]">
                                {term.tools.map((tool, tIdx) => (
                                    <span key={tIdx} className={`
                                        text-[0.72rem] font-semibold py-[0.2rem] px-[0.65rem] rounded-[5px] border
                                        ${tool.is_ai_tag
                                            ? 'bg-[rgba(0,217,126,0.1)] text-[#0F5C42] border-[rgba(0,217,126,0.25)]'
                                            : 'bg-[rgba(110,218,253,0.12)] text-[#1A4A8F] border-[rgba(110,218,253,0.25)]'}
                                    `}>
                                        {tool.label}
                                    </span>
                                ))}
                            </div>

                            <div className="text-slate-600 text-[0.95rem] leading-[1.85] font-medium mt-2">
                                {term.description}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right side: Lead Capture Form */}
                <div className="w-full relative sticky top-32 z-10" id="enroll">
                    {/* Soft glow behind the form for emphasis */}
                    <div className="absolute inset-0 bg-[#00D97E]/10 blur-[80px] rounded-[30px] pointer-events-none -z-10"></div>
                    <LeadCaptureForm sourceName="Landing Page - Curriculum Section" buttonText="Apply Now" />
                </div>

            </div>
        </section>
    );
}
