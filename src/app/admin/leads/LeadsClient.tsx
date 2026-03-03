'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Download, Search, Trash2, Eye, User, Clock, MapPin, Pointer, FormInput, History as HistoryIcon } from 'lucide-react';
import { deleteLead, getLeadTimeline } from '@/app/actions/leads';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
    const router = useRouter();
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
        if (filteredLeads.length === 0) return alert("No leads to export.");

        // Define Headers
        const headers = ["Date", "Name", "Email", "Phone", "Source", "Session ID"];

        // Build CSV rows
        const rows = filteredLeads.map(lead => [
            new Date(lead.created_at).toLocaleString(),
            `"${lead.name || ''}"`,
            `"${lead.email || ''}"`,
            `"${lead.phone || ''}"`,
            `"${lead.form_source || 'Unknown'}"`,
            `"${lead.session_id || ''}"`
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.join(","))
        ].join("\n");

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
        if (!confirm(`Are you sure you want to delete the lead for ${name}?`)) return;

        try {
            await deleteLead(id);
            setLeads(leads.filter(l => l.id !== id));
        } catch (error) {
            alert("Failed to delete lead.");
        }
    };

    const handleViewDetails = async (lead: any) => {
        setViewingLead(lead);
        setIsLoadingTimeline(true);
        setTimeline([]);

        try {
            const events = await getLeadTimeline(lead.session_id);
            setTimeline(events);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingTimeline(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
            <div className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm shrink-0 rounded-t-lg gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900">Leads Inbox</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage and export your collected leads ({filteredLeads.length} total)</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button onClick={handleExport} variant="outline" className="bg-white hover:bg-slate-50 border-slate-200">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            <div className="flex flex-row p-4 gap-4 bg-slate-50 border-b">
                {/* Search */}
                <div className="relative max-w-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>

                {/* Source Filter */}
                <select
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="block w-48 pl-3 pr-10 py-2 border border-slate-200 text-slate-700 bg-white rounded-md leading-5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                >
                    <option value="all">All Sources</option>
                    {sources.map(s => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-b-lg">
                <table className="min-w-full divide-y divide-slate-200 relative">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.1)]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contact Info</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Source</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                                    No leads found matching your criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                        {new Date(lead.created_at).toLocaleDateString()}<br />
                                        <span className="text-xs text-slate-400">{new Date(lead.created_at).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs ring-1 ring-primary/20">
                                                {(lead.name || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-slate-900">{lead.name || 'Unknown'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-900">{lead.email || '—'}</div>
                                        <div className="text-sm text-slate-500">{lead.phone || '—'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                            {lead.form_source || 'Unknown'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleViewDetails(lead)}
                                            className="text-primary hover:text-primary/80 mr-4 transition-colors p-1"
                                            title="View Details & Timeline"
                                        >
                                            <Eye className="h-4 w-4 inline" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(lead.id, lead.name)}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Delete Lead"
                                        >
                                            <Trash2 className="h-4 w-4 inline" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* View Details Modal Overlay */}
            {viewingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" /> Lead Details
                            </h3>
                            <button onClick={() => setViewingLead(null)} className="text-slate-400 hover:text-slate-600 focus:outline-none text-2xl leading-none">&times;</button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                            {/* Left: Lead Info */}
                            <div className="w-full md:w-1/3 border-r bg-white p-6 overflow-y-auto shrink-0">
                                <h4 className="font-semibold text-slate-800 mb-4 border-b pb-2">Submitted Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Name</label>
                                        <div className="text-sm font-medium text-slate-900 mt-0.5">{viewingLead.name || '—'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Email</label>
                                        <div className="text-sm font-medium text-slate-900 mt-0.5">{viewingLead.email || '—'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Phone</label>
                                        <div className="text-sm font-medium text-slate-900 mt-0.5">{viewingLead.phone || '—'}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Submission Date</label>
                                        <div className="text-sm font-medium text-slate-900 mt-0.5">{new Date(viewingLead.created_at).toLocaleString()}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Form Source</label>
                                        <div className="mt-1">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                                                {viewingLead.form_source || 'Unknown'}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-slate-500 uppercase">Session ID</label>
                                        <div className="text-xs font-mono text-slate-600 mt-0.5 break-all bg-slate-50 p-2 border rounded">{viewingLead.session_id || '—'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Timeline */}
                            <div className="w-full md:w-2/3 bg-slate-50 p-0 flex flex-col overflow-hidden">
                                <div className="px-6 py-4 border-b bg-white shrink-0 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-500" />
                                    <h4 className="font-semibold text-slate-800">User Journey Timeline</h4>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6">
                                    {isLoadingTimeline ? (
                                        <div className="flex justify-center items-center h-full text-sm text-slate-500">Loading timeline events...</div>
                                    ) : timeline.length === 0 ? (
                                        <div className="flex flex-col justify-center items-center h-full text-slate-400 text-sm bg-white border border-dashed rounded-lg p-8">
                                            <HistoryIcon className="h-8 w-8 mb-2 opacity-30" />
                                            <span>No tracking events found for this session.</span>
                                            <span className="text-xs mt-1 text-slate-400/70">The user may have blocked tracking scripts.</span>
                                        </div>
                                    ) : (
                                        <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 pb-6">
                                            {timeline.map((event, i) => {
                                                const isClick = event.event_type === 'click';
                                                const isSection = event.event_type === 'section_view';

                                                return (
                                                    <div key={event.id} className="relative pl-6">
                                                        {/* Timeline node */}
                                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-sm ${isClick ? 'bg-blue-500' : isSection ? 'bg-purple-500' : 'bg-slate-400'
                                                            }`}></div>

                                                        {/* Event Card */}
                                                        <div className="bg-white p-3 rounded-lg border shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex items-center gap-1.5 font-medium text-sm text-slate-800">
                                                                    {isClick && <Pointer className="h-3.5 w-3.5 text-blue-500" />}
                                                                    {isSection && <Eye className="h-3.5 w-3.5 text-purple-500" />}
                                                                    {isClick ? 'Clicked Element' : isSection ? 'Viewed Section' : event.event_type}
                                                                </div>
                                                                <div className="text-[10px] text-slate-400 font-mono">
                                                                    {new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                                                </div>
                                                            </div>
                                                            <div className="text-sm text-slate-600 font-mono bg-slate-50 px-2 py-1 rounded inline-block w-fit mt-1 border border-slate-100">
                                                                {event.element_id}
                                                            </div>
                                                            {event.page_url && (
                                                                <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                                                    <MapPin className="h-3 w-3" /> {new URL(event.page_url).pathname}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {/* Final submission node */}
                                            <div className="relative pl-6 pt-2">
                                                <div className="absolute -left-[11px] top-4 w-5 h-5 rounded-full border-2 border-white bg-green-500 flex items-center justify-center shadow-sm z-10">
                                                    <FormInput className="h-3 w-3 text-white" />
                                                </div>
                                                <div className="bg-green-50 border-green-200 p-3 rounded-lg border shadow-sm">
                                                    <div className="font-medium text-sm text-green-800">Form Submitted</div>
                                                    <div className="text-xs text-green-600 mt-1">Source: {viewingLead.form_source}</div>
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
