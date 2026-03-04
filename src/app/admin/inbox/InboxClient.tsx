'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export default function InboxClient({ initialSubmissions }: { initialSubmissions: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = initialSubmissions.filter((sub) => {
        const text = JSON.stringify(sub).toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const exportCsv = () => {
        if (filtered.length === 0) return;

        // Build CSV Header
        const headers = [
            'ID', 'Date', 'Page', 'Course', 'Campaign',
            'Name', 'Email', 'Phone', 'Data JSON',
            'Source', 'Medium', 'UTM Campaign', 'Term', 'Content', 'GCLID', 'Keyword', 'IP Hash'
        ];

        // Build CSV Rows
        const rows = filtered.map(s => {
            const date = new Date(s.submitted_at).toISOString();
            const pageTitle = s.landing_pages?.title || 'Unknown Page';
            const course = s.landing_pages?.course_name || '';
            const campaign = s.landing_pages?.campaign_tag || '';

            // Extract common names from arbitrary json data
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
        <div className="bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search submissions..."
                    className="border rounded-md px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0}>
                    <Download className="h-4 w-4 mr-2" /> Export CSV ({filtered.length})
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                        <tr>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Page / Source</th>
                            <th className="px-4 py-3">Prospect Details</th>
                            <th className="px-4 py-3">Raw Data</th>
                            <th className="px-4 py-3">UTMs</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    No submissions found matching criteria.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((sub) => {
                                const data = sub.data || {};
                                const name = data.name || data.fullName || 'Unknown';
                                const email = data.email || 'No email';
                                const phone = data.phone || data.mobile || 'No phone';

                                return (
                                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                                            {new Date(sub.submitted_at).toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{sub.landing_pages?.title || 'Unknown Page'}</div>
                                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{sub.landing_pages?.campaign_tag || 'Organic'}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-slate-900">{name}</div>
                                            <div className="text-xs text-slate-500">{email}</div>
                                            <div className="text-xs text-slate-500">{phone}</div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <pre className="text-[10px] text-slate-500 bg-slate-100 p-2 rounded-md max-w-xs overflow-x-auto">
                                                {JSON.stringify(data, null, 2)}
                                            </pre>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-xs text-slate-600 flex flex-col gap-1">
                                                {sub.utm_source ? (
                                                    <div><span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 mr-1 text-[10px] font-bold">SRC</span>{sub.utm_source}</div>
                                                ) : <span className="opacity-50 italic">No UTMs</span>}
                                                {sub.gclid && (
                                                    <div><span className="bg-[#4285F4]/10 text-[#4285F4] px-1.5 py-0.5 rounded border border-[#4285F4]/20 mr-1 text-[10px] font-bold">GCLID</span><span className="font-mono text-[10px] truncate max-w-[120px] inline-block align-bottom">{sub.gclid}</span></div>
                                                )}
                                                {sub.source_keyword && (
                                                    <div><span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 mr-1 text-[10px] font-bold">KW</span>{sub.source_keyword}</div>
                                                )}
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
    );
}
