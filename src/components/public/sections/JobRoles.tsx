import React from 'react';

export interface RoleItem {
    icon: string;
    title: string;
    description: string;
}

export interface JobRolesProps {
    section_label?: string;
    headline?: string;
    description?: string;
    roles?: RoleItem[];
}

export function JobRoles({
    section_label = "Career Outcomes",
    headline = "The Roles That Are Waiting for You",
    description = "These aren't job titles from five years ago. They're the positions companies are struggling to fill right now — because not enough people have both the analytics foundation and the AI fluency to do them well.",
    roles = [
        { icon: "🤖", title: "AI Data Analyst", description: "You do in an hour what used to take a week. GenAI handles the grunt work; you focus on the insight that moves the needle." },
        { icon: "🕹️", title: "AI Agent Orchestrator", description: "You don't just use AI tools — you design the systems that coordinate them. Think of yourself as the conductor of an AI orchestra." },
        { icon: "📈", title: "Predictive Analytics Specialist", description: "Finance teams, supply chain leads, and marketing directors all want the same thing: to know what's coming before it arrives." },
        { icon: "📊", title: "BI Analyst (AI-Enabled)", description: "Your dashboards don't just show numbers — they tell the story behind them, updated in real time, with AI-generated commentary executives actually read." },
        { icon: "⚙️", title: "Data Automation Engineer", description: "You build the pipelines, RAG systems, and agentic workflows that replace hours of manual work. Every business needs one. Very few exist." }
    ]
}: JobRolesProps) {
    return (
        <section className="bg-[var(--navy)] relative overflow-hidden py-[100px] px-[5%]" id="roles">
            {/* Holographic blobs inside dark section */}
            <div className="absolute inset-0 pointer-events-none before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_500px_400px_at_85%_20%,rgba(0,217,126,0.1)_0%,transparent_70%),radial-gradient(ellipse_400px_400px_at_5%_80%,rgba(110,218,253,0.1)_0%,transparent_70%)]"></div>

            <div className="relative z-10">
                <div className="section-label !text-[var(--teal)]">{section_label}</div>
                <h2 className="section-title !text-[var(--white)] whitespace-pre-line">{headline}</h2>
                <p className="section-desc !text-[rgba(255,255,255,0.55)]">{description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4">
                    {roles.map((role, idx) => (
                        <div
                            key={idx}
                            className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 backdrop-blur-md transition-all duration-200 hover:bg-[rgba(0,217,126,0.07)] hover:border-[rgba(0,217,126,0.3)] hover:-translate-y-1"
                        >
                            <div className="text-[1.6rem] mb-3 leading-none">{role.icon}</div>
                            <h3 className="font-sora font-semibold text-[1rem] text-[var(--white)] mb-2.5">
                                {role.title}
                            </h3>
                            <p className="text-[rgba(255,255,255,0.52)] text-[0.875rem] leading-[1.75]">
                                {role.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
