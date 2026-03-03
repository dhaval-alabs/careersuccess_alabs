'use client';

import { useState } from 'react';
import { ShieldCheck, HardDrive, FileText, User as UserIcon, RefreshCw, Send, Search } from 'lucide-react';

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAction, setFilterAction] = useState('all');

    // Filter logs
    const filteredLogs = initialLogs.filter(log => {
        const query = searchQuery.toLowerCase();
        const searchMatches =
            (log.action?.toLowerCase() || '').includes(query) ||
            (log.user_id?.toLowerCase() || '').includes(query) ||
            (log.target_id?.toLowerCase() || '').includes(query);

        const actionMatches = filterAction === 'all' || log.action === filterAction;

        return searchMatches && actionMatches;
    });

    const uniqueActions = Array.from(new Set(initialLogs.map(l => l.action).filter(Boolean)));

    const getActionIcon = (action: string) => {
        if (!action) return <HardDrive className="h-4 w-4 text-slate-400" />;
        if (action.includes('publish') || action.includes('schedule')) return <Send className="h-4 w-4 text-green-500" />;
        if (action.includes('restore') || action.includes('version')) return <RefreshCw className="h-4 w-4 text-blue-500" />;
        if (action.includes('create') || action.includes('update') || action.includes('edit')) return <FileText className="h-4 w-4 text-purple-500" />;
        return <HardDrive className="h-4 w-4 text-slate-400" />;
    };

    const getActionLabel = (action: string) => {
        if (!action) return 'Unknown Action';
        return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
            <div className="bg-white border-b px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm shrink-0 rounded-t-lg gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg">
                        <ShieldCheck className="h-6 w-6 text-slate-700" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">System Audit Logs</h1>
                        <p className="text-sm text-slate-500 mt-1">Immutable record of critical administrative actions.</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-row p-4 gap-4 bg-slate-50 border-b shrink-0">
                <div className="relative max-w-sm flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search UUIDs or actions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-white sm:text-sm"
                    />
                </div>

                <select
                    value={filterAction}
                    onChange={(e) => setFilterAction(e.target.value)}
                    className="block w-48 pl-3 pr-8 py-2 border border-slate-200 bg-white rounded-md sm:text-sm"
                >
                    <option value="all">All Actions</option>
                    {uniqueActions.map(a => (
                        <option key={a} value={a}>{getActionLabel(a)}</option>
                    ))}
                </select>
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-b-lg">
                <table className="min-w-full divide-y divide-slate-200 relative">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-[0_1px_0_rgba(0,0,0,0.1)]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target Entity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Metadata</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {filteredLogs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-slate-500 text-sm">
                                    No audit logs found matching criteria.
                                </td>
                            </tr>
                        ) : (
                            filteredLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600" suppressHydrationWarning>
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-slate-900 font-mono">
                                            <UserIcon className="h-3 w-3 mr-2 text-slate-400" />
                                            {log.user_id ? log.user_id.split('-')[0] + '...' : 'System'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
                                            {getActionIcon(log.action)}
                                            {getActionLabel(log.action)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border">
                                            {log.target_type}: {log.target_id ? log.target_id.split('-')[0] + '...' : 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500 font-mono max-w-xs truncate" title={JSON.stringify(log.metadata, null, 2)}>
                                        {JSON.stringify(log.metadata)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
