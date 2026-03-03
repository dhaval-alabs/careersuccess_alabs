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
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

    if (error) {
        console.error("Failed to fetch audit logs:", error);
    }

    return <AuditLogsClient initialLogs={logs || []} />;
}
