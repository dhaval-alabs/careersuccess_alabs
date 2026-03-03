'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FileText, BookOpen, Users, Settings, Inbox } from 'lucide-react';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'compact';
    role?: string;
}

export function Sidebar({ className, role = 'editor' }: SidebarProps) {
    const pathname = usePathname();

    const routes = [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/admin', roles: ['editor', 'publisher', 'super_admin'] },
        { label: 'Pages', icon: FileText, href: '/admin/pages', roles: ['editor', 'publisher', 'super_admin'] },
        { label: 'Leads Inbox', icon: Inbox, href: '/admin/leads', roles: ['editor', 'publisher', 'super_admin'] },
        { label: 'Users', icon: Users, href: '/admin/users', roles: ['super_admin'] },
        { label: 'Audit Logs', icon: Settings, href: '/admin/settings/audit-logs', roles: ['super_admin'] },
    ];

    return (
        <div className={cn('pb-12 min-h-screen', className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        CMS Navigation
                    </h2>
                    <div className="space-y-1">
                        {routes.filter(r => r.roles.includes(role)).map((route) => (
                            <Button
                                key={route.href}
                                variant={pathname === route.href ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href={route.href} className="flex items-center w-full">
                                    <route.icon className="mr-3 h-5 w-5" />
                                    <span className="text-[15px]">{route.label}</span>
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
