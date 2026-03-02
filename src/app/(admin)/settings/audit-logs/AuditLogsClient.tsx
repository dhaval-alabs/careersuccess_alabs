'use client';

import { useState } from 'react';
import { formatTypeLabel } from '@/lib/utils';

export default function AuditLogsClient({ initialLogs }: { initialLogs: any[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = initialLogs.filter((log) => {
        const text = `${log.action} ${log.users?.email} ${log.target_type} ${JSON.stringify(log.metadata)}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search logs by action, user, or metadata..."
                    className="border rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="text-sm text-slate-500">
                    Showing {filtered.length} logs
                </div>
            </div>

            <div className="overflow-x-auto max-h-[70vh]">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b sticky top-0 z-10">
                        <tr>
                            <th className="px-4 py-3">Timestamp</th>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Action</th>
                            <th className="px-4 py-3">Target</th>
                            <th className="px-4 py-3">Metadata / Details</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">
                                        {new Date(log.created_at).toLocaleString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{log.users?.email || 'System'}</div>
                                    </td>
                                    <td className="px-4 py-3 text-slate-700 capitalize">
                                        {formatTypeLabel(log.action)}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-xs text-slate-500 font-mono">
                                            {log.target_type}: {log.target_id?.split('-')[0]}...
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="text-[10px] text-slate-500 font-mono break-words w-64 max-h-16 overflow-y-auto">
                                            {Object.keys(log.metadata || {}).length > 0
                                                ? JSON.stringify(log.metadata)
                                                : <span className="italic opacity-50">None</span>
                                            }
                                        </div>
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
