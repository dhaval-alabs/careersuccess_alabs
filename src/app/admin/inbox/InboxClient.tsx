'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Search, Filter, Calendar } from 'lucide-react';

export default function InboxClient({ initialSubmissions }: { initialSubmissions: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = initialSubmissions.filter((sub) => {
        const text = JSON.stringify(sub).toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const exportCsv = () => {
        if (filtered.length === 0) return;

        const headers = [
            'ID', 'Date', 'Page', 'Course', 'Campaign',
            'Name', 'Email', 'Phone', 'Data JSON',
            'Source', 'Medium', 'UTM Campaign', 'Term', 'Content', 'GCLID', 'Keyword', 'IP Hash'
        ];

        const rows = filtered.map(s => {
            const date = new Date(s.submitted_at).toISOString();
            const pageTitle = s.landing_pages?.title || 'Unknown Page';
            const course = s.landing_pages?.course_name || '';
            const campaign = s.landing_pages?.campaign_tag || '';

            const name = s.data.name || s.data.fullName || s.data.first_name || '';
            const email = s.data.email || s.data.emailAddress || '';
            const phone = s.data.phone || s.data.mobile || s.data.contact || '';
            const rawData = JSON.stringify(s.data).replace(/"/g, '""');

            return [
                s.id, date, `"${pageTitle}"`, `"${course}"`, `"${campaign}"`,
                `"${name}"`, `"${email}"`, `"${phone}"`, `"${rawData}"`,
                s.utm_source || '', s.utm_medium || '', s.utm_campaign || '',
                s.utm_term || '', s.utm_content || '', s.gclid || '', s.source_keyword || '', s.ip_hash || ''
            ].join(',');
        });

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
        const encodedUri = encodeURI(csvContent);

        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `submissions_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-sora">Leads Inbox</h1>
                    <p className="text-slate-500 mt-1">Manage and export all incoming landing page inquiries.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={exportCsv}
                        disabled={filtered.length === 0}
                        className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl px-6 py-2 h-auto"
                    >
                        <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                </div>
            </div>

            <div className="premium-card overflow-hidden border-none shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Prospect</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Page Source</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tracking</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No leads found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((sub) => {
                                    const data = sub.data || {};
                                    const name = data.name || data.fullName || 'Unknown User';
                                    const email = data.email || 'No email provided';
                                    const phone = data.phone || data.mobile || '-';
                                    const isNew = new Date(sub.submitted_at).getTime() > Date.now() - 86400000;

                                    return (
                                        <tr key={sub.id} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white transition-colors">
                                                        {name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-900 leading-none">{name}</div>
                                                        <div className="text-xs text-slate-500 mt-1.5">{email}</div>
                                                        <div className="text-xs text-slate-400">{phone}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="font-semibold text-slate-700 text-sm">{sub.landing_pages?.title || 'Unknown Page'}</div>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-tighter">
                                                        {sub.landing_pages?.campaign_tag || 'Organic'}
                                                    </span>
                                                    {sub.utm_source && (
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-tighter">
                                                            {sub.utm_source}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="space-y-1.5">
                                                    {sub.gclid ? (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] font-black text-slate-300">GCLID</span>
                                                            <span className="text-[10px] text-slate-600 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-100 truncate max-w-[100px]" title={sub.gclid}>{sub.gclid}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-[10px] text-slate-300 italic">No Ad Data</div>
                                                    )}
                                                    {sub.source_keyword && (
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="text-[9px] font-black text-slate-300">KW</span>
                                                            <span className="text-[10px] text-amber-700 font-bold">{sub.source_keyword}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                {isNew ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                        New Lead
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                        Archived
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-slate-500">
                                                    <Calendar size={14} className="opacity-40" />
                                                    <span className="text-xs font-medium">
                                                        {new Date(sub.submitted_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

