"use client";

import React from 'react';
import LeadCaptureForm from '@/components/forms/LeadCaptureForm';

export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQAccordionProps {
    section_label?: string;
    headline?: string;
    faqs?: FAQItem[];
    form?: {
        submit_label?: string;
    };
}

export function FAQAccordion({
    section_label = "FAQ",
    headline = "Real Questions, Straight Answers",
    faqs = [
        { question: "I'm not from a tech background. Will I be lost?", answer: "Not at all. In fact, some of our best graduates came from finance, marketing, HR, and even hospitality. We start every cohort with a Foundations module that gets everyone — regardless of background — up to speed. And because our AI modules focus heavily on no-code tools, you'll be building powerful workflows before you write a single line of Python." },
        { question: "How is this different from a YouTube playlist or a Udemy course?", answer: "Free and cheap courses give you information. This program gives you a transformation. The difference is structure, live mentorship, real industry projects with actual feedback, a peer cohort to keep you accountable, and a dedicated placement team working to get you hired. Information is cheap. Outcomes are what you're paying for." },
        { question: "What exactly does the Job Guarantee mean?", answer: "Complete the program, go through our 2-month Placement Readiness phase, and if you haven't landed a role within 6 months of certification — we refund 50% of your fees. No fine print. No runaround. We succeed when you do." },
        { question: "I already know SQL and Excel. Is this course still worth it?", answer: "Absolutely — and you'll move faster through Term 1 and get more out of the AI modules because of your head start. The real value for experienced analysts is Terms 4 through 6: using GenAI to supercharge your existing skills, then building agentic systems that most senior analysts don't know exist yet." },
        { question: "What AI tools will I actually be building with?", answer: "The full modern stack: LangChain and LangGraph for orchestrating LLM workflows, CrewAI and AutoGen for multi-agent systems, Zapier and Make.com for no-code automation, FAISS and Pinecone for vector databases and RAG pipelines, and FastAPI + Streamlit for deploying your AI applications." },
        { question: "Can I juggle this with my current job?", answer: "Yes — and thousands of working professionals already have. Choose weekend classes, live evening sessions, or fully self-paced learning with up to 24 months of LMS access. The program is designed so you don't have to choose between learning and earning." }
    ],
    form
}: FAQAccordionProps) {
    return (
        <section className="py-[100px] px-[5%] relative z-10 bg-[var(--background)]" id="faq">
            <div className="max-w-[1280px] mx-auto">
                <div className="section-label">{section_label}</div>
                <h2 className="section-title whitespace-pre-line mb-12">{headline}</h2>

                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-start">
                    {/* Left: FAQs */}
                    <div className="w-full">
                        {faqs.map((faq, idx) => (
                            <details
                                key={idx}
                                className="group bg-[var(--white)] border border-[var(--border)] rounded-[14px] mb-[0.75rem] overflow-hidden transition-all duration-200 shadow-[0_2px_12px_rgba(110,218,253,0.05)] hover:shadow-[0_6px_28px_rgba(0,217,126,0.1)] hover:border-[rgba(0,217,126,0.3)] marker:hidden [&::-webkit-details-marker]:hidden"
                            >
                                <summary className="p-[1.2rem_1.4rem] flex items-center justify-between gap-4 cursor-pointer font-semibold text-[0.95rem] text-[var(--navy)] leading-[1.5] select-none">
                                    {faq.question}
                                    <span className="font-sora font-light text-[1.4rem] text-[#1A5FBF] transition-transform duration-250 shrink-0 group-open:rotate-45 block">
                                        +
                                    </span>
                                </summary>
                                {/* The answer container */}
                                <div className="px-[1.4rem] pb-[1.2rem] text-[var(--muted)] text-[0.92rem] leading-[1.85] border-t border-[rgba(110,218,253,0.12)] pt-[1.1rem]">
                                    {faq.answer}
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Right: Lead Capture Form */}
                    <div className="w-full relative sticky top-32 z-10" id="enroll">
                        {/* Soft glow behind the form for emphasis */}
                        <div className="absolute inset-0 bg-[#00D97E]/10 blur-[80px] rounded-[30px] pointer-events-none -z-10"></div>
                        <LeadCaptureForm sourceName="Landing Page - FAQ Bottom" buttonText={form?.submit_label || "Get A Callback"} />
                    </div>
                </div>
            </div>
        </section>
    );
}
