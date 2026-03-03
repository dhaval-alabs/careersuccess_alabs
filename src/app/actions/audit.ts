'use server';

import { createClient } from '@/utils/supabase/server';

export async function getAuditLogs() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // In a real app, verify `user` is a super_admin. 

    // Fetch audit logs with the user's email if possible
    // Sub-querying auth.users is restricted by default in Supabase, 
    // so we'll fetch the logs and just display the user_id for now, 
    // or rely on a public profiles table if one exists.
    const { data: logs, error } = await supabase
        .from('audit_logs')
        .select(`
            id,
            user_id,
            action,
            target_type,
            target_id,
            metadata,
            created_at
        `)
        .order('created_at', { ascending: false })
        .limit(100);

    if (error) {
        console.error("Error fetching audit logs:", error);
        throw new Error("Failed to fetch audit logs");
    }

    return logs;
}
