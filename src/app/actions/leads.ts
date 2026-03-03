'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getLeads() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // In a real app, verify `user` is an admin. We rely on middleware for basic protection.
    if (!user) throw new Error("Unauthorized");

    // Fetch leads ordered by most recent first
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching leads:", error);
        throw new Error("Failed to fetch leads");
    }

    return leads;
}

export async function getLeadTimeline(sessionId: string) {
    if (!sessionId) return [];

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    // Fetch events for this session, ordered chronologically
    const { data: events, error } = await supabase
        .from('lead_events')
        .select('*')
        .eq('session_id', sessionId)
        .order('timestamp', { ascending: true });

    if (error) {
        console.error("Error fetching lead timeline:", error);
        // Don't throw here, just return empty so the lead details still load even if timeline fails
        return [];
    }

    return events;
}

export async function deleteLead(leadId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

    if (error) {
        throw new Error("Failed to delete lead");
    }

    revalidatePath('/admin/leads');
    return { success: true };
}
