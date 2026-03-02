'use client';

import { useState, useTransition } from 'react';
import { formatTypeLabel } from '@/lib/utils';
import { updateUserRole } from '@/app/actions/users';

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const filtered = users.filter((u) => {
        const text = `${u.email} ${u.name} ${u.role}`.toLowerCase();
        return text.includes(searchTerm.toLowerCase());
    });

    const handleRoleChange = (userId: string, newRole: 'editor' | 'publisher' | 'super_admin') => {
        if (userId === currentUserId && newRole !== 'super_admin') {
            alert("You cannot demote your own account.");
            return;
        }

        startTransition(async () => {
            try {
                await updateUserRole(userId, newRole);
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
            } catch (error: any) {
                alert(error.message || "Failed to update user role");
            }
        });
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Joined Date</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="font-medium text-slate-900">{u.name || 'No Name'} {u.id === currentUserId && <span className="text-xs font-normal text-slate-400 ml-2">(You)</span>}</div>
                                        <div className="text-xs text-slate-500">{u.email}</div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-slate-500 text-xs">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${u.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                                                u.role === 'publisher' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-slate-100 text-slate-800'
                                            }`}>
                                            {formatTypeLabel(u.role)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            disabled={u.id === currentUserId || isPending}
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                                            className="bg-white border text-sm rounded-md focus:ring-primary focus:border-primary block p-2"
                                        >
                                            <option value="editor">Editor</option>
                                            <option value="publisher">Publisher</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
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
