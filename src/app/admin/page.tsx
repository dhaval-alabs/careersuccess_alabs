import { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'
import { FileText, Inbox, Users, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: "Dashboard - CMS",
    description: "Overview of your application",
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch core stats
    const [{ count: pagesCount }, { count: leadsCount }, { count: usersCount }, { data: recentLeads }] = await Promise.all([
        supabase.from('landing_pages').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    // Fetch lead trends for the last 14 days
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const { data: trendData } = await supabase
        .from('leads')
        .select('created_at')
        .gte('created_at', fourteenDaysAgo.toISOString());

    // Group leads by day
    const dayCounts: Record<string, number> = {};
    for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dayCounts[date.toISOString().split('T')[0]] = 0;
    }

    trendData?.forEach(lead => {
        const day = lead.created_at.split('T')[0];
        if (dayCounts[day] !== undefined) {
            dayCounts[day]++;
        }
    });

    const chartData = Object.entries(dayCounts)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({
            label: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            value: count
        }));

    const maxVal = Math.max(...chartData.map(d => d.value), 5);

    return (
        <div className="space-y-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-sora">
                        Hello, Admin!
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Welcome back. Here's what's happening with your platform today.
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100">
                    <Calendar size={18} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">
                        {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid gap-6 md:grid-cols-4">
                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Leads</span>
                        <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600">
                            <Inbox size={18} />
                        </div>
                    </div>
                    <div className="metric-value text-3xl text-slate-900">{leadsCount || 0}</div>
                    <div className="mt-2 text-xs font-medium text-emerald-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>+12% from last week</span>
                    </div>
                </div>

                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Pages</span>
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <FileText size={18} />
                        </div>
                    </div>
                    <div className="metric-value text-3xl text-slate-900">{pagesCount || 0}</div>
                    <div className="mt-2 text-xs font-medium text-slate-400">Active campaigns</div>
                </div>

                <div className="premium-card p-6">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Conversion Rate</span>
                        <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                            <TrendingUp size={18} />
                        </div>
                    </div>
                    <div className="metric-value text-3xl text-slate-900">4.2%</div>
                    <div className="mt-2 text-xs font-medium text-purple-600 flex items-center gap-1">
                        <TrendingUp size={12} />
                        <span>Optimal Performance</span>
                    </div>
                </div>

                <div className="premium-card p-6 bg-slate-900 text-white border-none">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">User Growth</span>
                        <div className="p-2 bg-white/10 rounded-xl text-white">
                            <Users size={18} />
                        </div>
                    </div>
                    <div className="metric-value text-3xl">{usersCount || 0}</div>
                    <div className="mt-2 text-xs font-medium text-slate-400">System administrators</div>
                </div>
            </div>

            {/* Charts & Activity Section */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Lead Trends Chart */}
                <div className="lg:col-span-2 premium-card p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 font-sora">Lead Inflow</h3>
                            <p className="text-sm text-slate-500">Daily submissions for the last 14 days</p>
                        </div>
                    </div>

                    <div className="relative h-64 w-full flex items-end justify-between gap-2 px-2">
                        {chartData.map((day, i) => {
                            const height = (day.value / maxVal) * 100;
                            const isToday = i === chartData.length - 1;

                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full flex items-end justify-center h-full">
                                        <div
                                            className={`w-full max-w-[32px] rounded-t-lg transition-all duration-700 chart-bar ${isToday ? 'bg-slate-900' : 'bg-slate-100 group-hover:bg-slate-200'}`}
                                            style={{ height: `${Math.max(height, 4)}%` }}
                                        >
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                                                {day.value} leads
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        {day.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="premium-card p-8">
                    <h3 className="text-xl font-bold text-slate-900 font-sora mb-6">Recent Leads</h3>
                    <div className="space-y-6">
                        {recentLeads?.map((lead, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                    {lead.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{lead.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{lead.city}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">
                                        {new Date(lead.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link
                        href="/admin/leads"
                        className="mt-8 w-full block text-center py-3 text-sm font-bold text-slate-600 hover:text-slate-900 border-t border-slate-50 transition-colors"
                    >
                        View All Leads →
                    </Link>
                </div>
            </div>

            {/* Journey Tracking Placeholder */}
            <div className="premium-card p-12 border-dashed border-2 flex flex-col items-center justify-center text-center bg-slate-50/30">
                <div className="w-16 h-16 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-4">
                    <TrendingUp className="text-slate-400" size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 font-sora">Journey Path Analytics</h4>
                <p className="text-slate-500 max-w-md mt-2">
                    Advanced session recording and user journey paths are currently handled via GA4 and HubSpot integrations.
                </p>
                <div className="mt-6 flex gap-4">
                    <div className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">GA4 Connected</div>
                    <div className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">Pixel Active</div>
                </div>
            </div>
        </div>
    )
}

