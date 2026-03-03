'use client';

import { useState } from 'react';
import { CheckCircle2, BarChart3, Binary, Bot, Rocket, ShieldCheck } from 'lucide-react';

export function HeroFeaturesCard() {
    const [activeTab, setActiveTab] = useState<'core' | 'ai'>('core');

    const coreFeatures = [
        {
            icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
            title: "Excel, SQL & Power BI — Actually Mastered",
            desc: "Built, tested, and presented to real business problems.",
            iconBg: "bg-blue-100"
        },
        {
            icon: <Binary className="w-5 h-5 text-emerald-600" />,
            title: "Python That Does Real Work",
            desc: "Clean data, build predictive models, automate workflows.",
            iconBg: "bg-emerald-100"
        },
        {
            icon: <Bot className="w-5 h-5 text-cyan-600" />,
            title: "AI Agents You Actually Deploy",
            desc: "LangChain, CrewAI, AutoGen — systems that work around the clock.",
            iconBg: "bg-cyan-100"
        },
        {
            icon: <Rocket className="w-5 h-5 text-orange-500" />,
            title: "A Portfolio That Gets You Hired",
            desc: "Real capstone projects in banking, retail, healthcare, telecom.",
            iconBg: "bg-orange-100"
        }
    ];

    const aiFeatures = [
        {
            icon: <Bot className="w-5 h-5 text-purple-600" />,
            title: "Advanced LLM Orchestration",
            desc: "Build multi-step reasoning chains with LangChain & LlamaIndex.",
            iconBg: "bg-purple-100"
        },
        {
            icon: <Binary className="w-5 h-5 text-indigo-600" />,
            title: "RAG & Vector Databases",
            desc: "Ground AI models in private enterprise data securely.",
            iconBg: "bg-indigo-100"
        },
        {
            icon: <Rocket className="w-5 h-5 text-pink-600" />,
            title: "Autonomous Agent Swarms",
            desc: "Deploy specialized AI agents that collaborate to solve complex tasks.",
            iconBg: "bg-pink-100"
        },
        {
            icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
            title: "Enterprise AI Security & Ethics",
            desc: "Ensure compliance, prevent bias, and secure AI deployments.",
            iconBg: "bg-teal-100"
        }
    ];

    const currentFeatures = activeTab === 'core' ? coreFeatures : aiFeatures;

    return (
        <div className="bg-white rounded-[24px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-slate-100 p-8 w-full max-w-[540px] relative overflow-hidden">
            {/* Soft background glow matching screenshot aesthetic */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[var(--teal)]/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10 -translate-y-1/2 translate-x-1/2"></div>

            <div className="flex justify-between items-center mb-8">
                <h3 className="font-sora text-xl font-bold text-slate-900">What You'll Walk Away With</h3>
                <div className="bg-[#38E0B5] text-[#0D3B2E] text-sm font-bold px-4 py-1.5 rounded-full">
                    From ₹52,000
                </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-slate-50 p-1 rounded-xl mb-6 border border-slate-100">
                <button
                    onClick={() => setActiveTab('core')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'core' ? 'bg-[#38E0B5] text-[#0D3B2E] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Core Analytics
                </button>
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${activeTab === 'ai' ? 'bg-[#38E0B5] text-[#0D3B2E] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    + AI Track
                </button>
            </div>

            {/* Feature List */}
            <div className="space-y-3 mb-8">
                {currentFeatures.map((feature, idx) => (
                    <div key={idx} className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <div className={`w-10 h-10 rounded-lg ${feature.iconBg} flex items-center justify-center shrink-0`}>
                            {feature.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-[15px] mb-1 leading-snug">{feature.title}</h4>
                            <p className="text-slate-500 text-[13px] leading-relaxed">{feature.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer / CTA area */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <div className="text-slate-600 text-xs font-semibold">Nasscom-FutureSkills</div>
                        <div className="text-slate-500 text-xs">Prime Certified</div>
                    </div>
                </div>

                <a href="#enroll" className="bg-[#38E0B5] hover:bg-[#2BCB9E] text-[#0D3B2E] font-bold px-6 py-2.5 rounded-xl transition-colors text-sm flex items-center gap-1 shadow-sm">
                    Enroll <span>→</span>
                </a>
            </div>
        </div>
    );
}
