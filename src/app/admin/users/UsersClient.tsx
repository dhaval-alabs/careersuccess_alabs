'use client';

import { useState, useTransition } from 'react';
import { formatTypeLabel } from '@/lib/utils';
import { updateUserRole } from '@/app/actions/users';
import { inviteUser } from '@/app/actions/invites';
import { UserPlus, X, Mail, ShieldAlert, Search, User, Calendar, ShieldCheck } from 'lucide-react';

export default function UsersClient({ initialUsers, currentUserId }: { initialUsers: any[], currentUserId: string }) {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

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
            }
        } catch (error: any) {
            alert(error.message || "Failed to invite user");
        } finally {
            setIsInviting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-sora">Team Management</h1>
                    <p className="text-slate-500 mt-1">Manage permissions and invite new administrators.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find team members..."
                            className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-64 focus:outline-none focus:ring-4 focus:ring-slate-100 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
                    >
                        <UserPlus size={18} />
                        <span>Invite User</span>
                    </button>
                </div>
            </div>

            <div className="premium-card overflow-hidden border-none shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/50">
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Team Member</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Joined At</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Access Level</th>
                                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold group-hover:bg-white transition-colors">
                                                    {(u.name || u.email).charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 leading-none">
                                                        {u.name || 'Anonymous User'}
                                                        {u.id === currentUserId && <span className="ml-2 text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">You</span>}
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-1.5">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 font-medium text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="opacity-30" />
                                                <span suppressHydrationWarning>{new Date(u.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${u.role === 'super_admin' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                    u.role === 'publisher' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                        'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>
                                                {formatTypeLabel(u.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <select
                                                disabled={u.id === currentUserId || isPending}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                                                className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:ring-4 focus:ring-slate-50 focus:border-slate-300 outline-none transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                <option value="editor">Set as Editor</option>
                                                <option value="publisher">Set as Publisher</option>
                                                <option value="super_admin">Set as Super Admin</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Invite Modal Redesigned */}
            {isInviteModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-white/20">
                        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 font-sora">Invite Team Member</h3>
                                <p className="text-slate-500 text-sm mt-1">Add a new collaborator to the platform.</p>
                            </div>
                            <button onClick={() => setIsInviteModalOpen(false)} className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-slate-400 hover:text-slate-900 hover:shadow-sm border border-slate-100 transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleInviteUser} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-600 transition-colors" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="colleague@analytixlabs.co.in"
                                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Assign Permissions</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { id: 'editor', title: 'Editor', desc: 'Can manage drafts and content' },
                                        { id: 'publisher', title: 'Publisher', desc: 'Can publish and manage versions' },
                                        { id: 'super_admin', title: 'Super Admin', desc: 'Full administrative control' }
                                    ].map((role) => (
                                        <label
                                            key={role.id}
                                            className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${inviteRole === role.id
                                                    ? 'border-slate-900 bg-slate-900/5 ring-4 ring-slate-50'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                className="hidden"
                                                value={role.id}
                                                checked={inviteRole === role.id}
                                                onChange={(e) => setInviteRole(e.target.value as any)}
                                            />
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${inviteRole === role.id ? 'border-slate-900' : 'border-slate-200'}`}>
                                                {inviteRole === role.id && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-sm">{role.title}</div>
                                                <div className="text-xs text-slate-500">{role.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {inviteRole === 'super_admin' && (
                                <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2">
                                    <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
                                    <p className="text-[11px] font-semibold text-amber-700 leading-relaxed">
                                        Super Admins have full access to system settings and user management. Use this role only for trusted administrators.
                                    </p>
                                </div>
                            )}

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    className="flex-1 px-6 py-3.5 text-sm font-bold text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isInviting || !inviteEmail}
                                    className="flex-[2] px-6 py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-200"
                                >
                                    {isInviting ? 'Sending Invite...' : 'Send Access Link'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

