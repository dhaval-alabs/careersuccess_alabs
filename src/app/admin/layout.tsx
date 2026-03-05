import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { AdminNav } from '@/components/admin/AdminNav';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    return (
        <div className="admin-premium-bg">
            <AdminNav />
            <main className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8 pb-12">
                <div className="fade-up">
                    {children}
                </div>
            </main>
        </div>
    );
}

