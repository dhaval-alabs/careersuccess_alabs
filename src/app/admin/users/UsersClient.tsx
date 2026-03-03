'use client';

import { useState, useTransition } from 'react';
import { formatTypeLabel } from '@/lib/utils';
import { updateUserRole } from '@/app/actions/users';
import { inviteUser } from '@/app/actions/invites';
import { UserPlus, X, Mail, ShieldAlert } from 'lucide-react';

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState<'editor' | 'publisher' | 'super_admin'>('editor');
    const [isInviting, setIsInviting] = useState(false);

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

    const handleInviteUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        try {
            const result = await inviteUser(inviteEmail, inviteRole, currentUserId);
            if (result.success) {
                setUsers([result.user, ...users]);
                setIsInviteModalOpen(false);
                setInviteEmail('');
                setInviteRole('editor');
                alert("Invitation sent successfully!");
            }
        } catch (error: any) {
            alert(error.message || "Failed to invite user");
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border border-slate-200 rounded-md px-3 py-2 text-sm w-80 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                >
                    <UserPlus className="h-4 w-4 mr-2" /> Invite User
                </button>
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

            {/* Invite Modal Overlay */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-primary" /> Invite Team Member
                            </h3>
                            <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-slate-600 focus:outline-none">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleInviteUser} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="colleague@company.com"
                                        className="pl-10 w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Role</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                                    value={inviteRole}
                                    onChange={(e) => setInviteRole(e.target.value as any)}
                                >
                                    <option value="editor">Editor (Create/Edit Drafts)</option>
                                    <option value="publisher">Publisher (Publish/Restore Versions)</option>
                                    <option value="super_admin">Super Admin (Full Access)</option>
                                </select>
                            </div>

                            {inviteRole === 'super_admin' && (
                                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded flex gap-2 items-start mt-2">
                                    <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                                    <p>Super Admins have full control over the CMS, including managing other users and viewing audit logs. Proceed with caution.</p>
                                </div>
                            )}

                            <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting || !inviteEmail}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isInviting ? (
                                        <>Sending Invite...</>
                                    ) : (
                                        <>Send Invitation</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
