'use client';

import { User } from '@supabase/supabase-js';
import { LogOut, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
/* Note: Sheet, Avatar and Dropdown components disabled to avoid shadcn installation dependencies for now
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
*/
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    user: User;
    role?: string;
}

export function Header({ user, role = 'editor' }: HeaderProps) {
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
        router.refresh();
    };

    const initial = user.email ? user.email.charAt(0).toUpperCase() : 'U';

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <div className="ml-auto w-full flex-1 sm:flex-initial" />
                <div className="flex items-center gap-4">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none capitalize">{role}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="text-red-500 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
