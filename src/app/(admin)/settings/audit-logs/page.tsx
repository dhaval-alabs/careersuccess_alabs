import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AuditLogsClient from './AuditLogsClient';

export default async function AuditLogsPage() {
    const supabase = await createClient();

    // Quick auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Also check if user is super_admin if we had a role hook, for now just fetch
    // (In a complete implementation, we'd verify user.role === 'super_admin' here)

    // Fetch the latest 500 audit logs
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select(`
            *,
            users:user_id(email, name)
        `)
        .order('created_at', { ascending: false })
        .limit(500);

    if (error) {
        console.error("Failed to fetch audit logs:", error);
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Audit Logs</h1>
                <p className="text-muted-foreground mt-2">
                    Review recent system actions. Limited to the last 500 records.
                </p>
            </div>

            <AuditLogsClient initialLogs={logs || []} />
        </div>
    );
}
