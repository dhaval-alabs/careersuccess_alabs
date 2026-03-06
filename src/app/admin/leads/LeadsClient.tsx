'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Search, Trash2, Eye, User, Clock, MapPin, MousePointer2, FileCheck, History, Calendar, Filter, X } from 'lucide-react';
import { deleteLead, getLeadTimeline } from '@/app/actions/leads';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
    console.log("LeadsClient initialized with", initialLeads.length, "leads");
    const [leads, setLeads] = useState(initialLeads);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSource, setSelectedSource] = useState('all');

    // Modal state
    const [viewingLead, setViewingLead] = useState<any | null>(null);
    const [timeline, setTimeline] = useState<any[]>([]);
    const [isLoadingTimeline, setIsLoadingTimeline] = useState(false);

    // Filter leads
    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            (lead.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (lead.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
            (lead.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase());

        const matchesSource = selectedSource === 'all' || lead.form_source === selectedSource;

        return matchesSearch && matchesSource;
    });

    // Extract unique sources for the filter dropdown
    const sources = Array.from(new Set(leads.map(l => l.form_source).filter(Boolean)));

    const handleExport = () => {
        const headers = ["Date", "Name", "Email", "Phone", "Source", "Session ID"];
        const rows = filteredLeads.map(lead => [
            new Date(lead.created_at).toLocaleString(),
            `"${lead.name || ''}"`,
            `"${lead.email || ''}"`,
            `"${lead.phone || ''}"`,
            `"${lead.form_source || 'Unknown'}"`,
            `"${lead.session_id || ''}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete lead for ${name}?`)) return;
        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l.id !== id));
        } catch (error) { alert("Failed to delete lead."); }
    };

    const handleViewDetails = async (lead: any) => {
        setViewingLead(lead);
        setIsLoadingTimeline(true);
        setTimeline([]);
        try {
            const events = await getLeadTimeline(lead.session_id);
            setTimeline(events);
        } catch (error) { console.error(error); } finally { setIsLoadingTimeline(false); }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-sora">Lead Intelligence {leads.length > 0 && `(${leads.length})`}</h1>
                    <p className="text-slate-500 mt-1">Detailed journey tracking and export controls.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm"
                    >
                        <Download size={18} className="text-slate-400" />
                        <span>Export CSV</span>
                    </button>
                    <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block" />
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="premium-card overflow-hidden border-none shadow-xl">
                <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                        <Filter size={14} />
                        <span>Quick Filters</span>
                    </div>
                    <div className="flex gap-2">
                        {['all', ...sources].map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedSource(s)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all border ${selectedSource === s
                                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                {s === 'all' ? 'All Channels' : s}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Inquiry Date</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Lead Profile</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Marketing Intel</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Channel</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        {leads.length === 0
                                            ? "No leads have been captured yet."
                                            : "No leads found matching your search or filters."}
                                    </td>
                                </tr>
                            ) : (
                                filteredLeads.map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-900">
                                                    {new Date(lead.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                                </span>
                                                <span className="text-[10px] font-medium text-slate-400 uppercase mt-0.5">
                                                    {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white transition-colors border border-transparent group-hover:border-slate-100">
                                                    {(lead.name || '?')[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-none">{lead.name || 'Anonymous'}</div>
                                                    <div className="text-[10px] text-slate-400 mt-1 font-medium">{lead.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter w-10">GCLID</span>
                                                    <span className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${lead.gclid ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-300'}`}>
                                                        {lead.gclid ? (lead.gclid.length > 12 ? lead.gclid.slice(0, 12) + '...' : lead.gclid) : '—'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-tighter w-10">KEYW</span>
                                                    <span className={`text-[11px] font-medium ${lead.source_keyword ? 'text-slate-700' : 'text-slate-300 italic'}`}>
                                                        {lead.source_keyword || 'not captured'}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="bg-slate-50 text-slate-500 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-slate-100 uppercase tracking-wide">
                                                {lead.form_source || 'Unknown'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewDetails(lead)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all"
                                                    title="View Journey"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(lead.id, lead.name)}
                                                    className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Journey Modal */}
            {viewingLead && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">

                        <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50 shrink-0">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-3xl bg-slate-900 flex items-center justify-center text-white text-xl font-bold shadow-xl shadow-slate-200">
                                    {(viewingLead.name || '?')[0].toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 font-sora">{viewingLead.name || 'Anonymous Intelligence'}</h3>
                                    <div className="flex items-center gap-3 text-slate-500 text-sm mt-1">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(viewingLead.created_at).toLocaleDateString()}</span>
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                                        <span className="flex items-center gap-1.5"><MousePointer2 size={14} /> SID: {viewingLead.session_id?.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setViewingLead(null)} className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all hover:shadow-sm">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            {/* Left Side: Static Data */}
                            <div className="w-full md:w-80 bg-slate-50/50 p-10 overflow-y-auto border-r border-slate-50">
                                <div className="space-y-8">
                                    <section>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Core Identity</label>
                                        <div className="space-y-5">
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 mb-1">Email Address</div>
                                                <div className="text-sm font-bold text-slate-900 break-all">{viewingLead.email || '—'}</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-bold text-slate-400 mb-1">Direct Phone</div>
                                                <div className="text-sm font-bold text-slate-900">{viewingLead.phone || '—'}</div>
                                            </div>
                                        </div>
                                    </section>

                                    <section>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Source Attribution</label>
                                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                            <div className="text-[10px] font-bold text-slate-400 mb-1">Channel</div>
                                            <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">{viewingLead.form_source || 'Direct Traffic'}</div>
                                        </div>
                                    </section>

                                    <section>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 block">Session Metadata</label>
                                        <div className="text-[10px] font-mono text-slate-500 bg-slate-100/50 p-4 rounded-2xl border border-slate-100 break-all uppercase leading-relaxed">
                                            {viewingLead.session_id || 'NOT_CAPTURED'}
                                        </div>
                                    </section>
                                </div>
                            </div>

                            {/* Right Side: Timeline */}
                            <div className="flex-1 bg-white flex flex-col overflow-hidden">
                                <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between shrink-0">
                                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                        <History className="text-slate-400" size={18} />
                                        <span>User Interaction Timeline</span>
                                    </h4>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{timeline.length} Events Recorded</div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/20">
                                    {isLoadingTimeline ? (
                                        <div className="flex flex-col items-center justify-center h-full gap-4">
                                            <div className="w-10 h-10 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin" />
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reconstructing Journey...</span>
                                        </div>
                                    ) : timeline.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center">
                                            <div className="w-20 h-20 rounded-[32px] bg-white border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 mb-6">
                                                <History size={40} />
                                            </div>
                                            <h5 className="font-bold text-slate-900 font-sora">No Path Recorded</h5>
                                            <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">This lead may have interacted with the site before tracking was enabled or used an ad-blocker.</p>
                                        </div>
                                    ) : (
                                        <div className="relative pl-8">
                                            <div className="absolute left-[3px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-slate-200 via-slate-200 to-transparent" />
                                            <div className="space-y-10">
                                                {timeline.map((event, idx) => {
                                                    const isClick = event.event_type === 'click';
                                                    return (
                                                        <div key={event.id} className="relative group/item">
                                                            <div className={`absolute -left-[33px] top-1.5 w-6 h-6 rounded-xl border-4 border-slate-50 flex items-center justify-center z-10 transition-all shadow-sm ${isClick ? 'bg-blue-500' : 'bg-purple-500'
                                                                }`}>
                                                                {isClick ? <MousePointer2 size={10} className="text-white" /> : <Eye size={10} className="text-white" />}
                                                            </div>
                                                            <div className="flex gap-6 items-start">
                                                                <div className="text-[10px] font-black text-slate-300 font-mono mt-2 tabular-nums group-hover/item:text-slate-900 transition-colors">
                                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                </div>
                                                                <div className="flex-1 bg-white p-5 rounded-3xl border border-slate-100 shadow-sm group-hover/item:shadow-md transition-all group-hover/item:border-slate-200 ring-4 ring-transparent group-hover/item:ring-slate-50">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest ${isClick ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                                                            }`}>
                                                                            {isClick ? 'Interaction' : 'Vision'}
                                                                        </span>
                                                                        <span className="text-xs font-bold text-slate-900">{isClick ? 'Clicked Component' : 'Viewed Section'}</span>
                                                                    </div>
                                                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded-xl mb-3 border border-slate-100/50">
                                                                        {event.element_id}
                                                                    </div>
                                                                    {event.page_url && (
                                                                        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                                                                            <MapPin size={12} className="text-slate-300" />
                                                                            <span className="truncate">{new URL(event.page_url, "https://example.com").pathname}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}

                                                {/* Conversion Node */}
                                                <div className="relative pt-4">
                                                    <div className="absolute -left-[35px] top-6 w-8 h-8 rounded-2xl bg-emerald-500 border-4 border-white flex items-center justify-center shadow-xl z-20">
                                                        <FileCheck size={16} className="text-white" />
                                                    </div>
                                                    <div className="ml-14 bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 shadow-lg shadow-emerald-50">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-white/50 px-2 py-1 rounded">Conversion Point</div>
                                                            <div className="text-[10px] font-mono font-bold text-emerald-400">{new Date(viewingLead.created_at).toLocaleTimeString()}</div>
                                                        </div>
                                                        <h6 className="text-lg font-bold text-emerald-900 font-sora">Lead Secured</h6>
                                                        <p className="text-sm text-emerald-700 mt-1">Form submitted from the Curriculumn section.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

