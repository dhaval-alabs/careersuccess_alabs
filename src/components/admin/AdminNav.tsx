'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Inbox, Settings, LogOut } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export function AdminNav() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const navItems = [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'Pages', href: '/admin/pages', icon: FileText },
        { label: 'Leads', href: '/admin/inbox', icon: Inbox },
        { label: 'Settings', href: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="nav-pill-container shadow-2xl border border-white/10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname?.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`nav-pill ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={16} />
                            <span className="hidden sm:inline">{item.label}</span>
                        </Link>
                    );
                })}

                <div className="w-[1px] h-4 bg-white/20 mx-1" />

                <button
                    onClick={handleSignOut}
                    className="nav-pill hover:bg-red-500/20 hover:text-red-400"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                </button>
            </nav>
        </div>
    );
}
