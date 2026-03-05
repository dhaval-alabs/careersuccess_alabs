import { createClient } from '@/utils/supabase/server';
import LeadsClient from './LeadsClient';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
    const supabase = await createClient();

    // Exact same query structure as the working dashboard
    const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Leads fetch error:", error);
    }

    return (
        <div className="fade-up">
            <LeadsClient initialLeads={leads || []} />
        </div>
    );
}
