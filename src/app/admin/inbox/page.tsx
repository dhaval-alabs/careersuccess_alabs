import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import InboxClient from './InboxClient';

export const dynamic = 'force-dynamic';

export default async function SubmissionsInbox() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch submissions with page details
    const { data: submissions, error } = await supabase
        .from('form_submissions')
        .select(`
            *,
            landing_pages (
                title,
                course_name,
                campaign_tag
            )
        `)
        .order('submitted_at', { ascending: false });

    if (error) {
        console.error("Error fetching submissions:", error);
    }

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Submissions Inbox</h1>
                <p className="text-muted-foreground mt-2">View and export form submissions from all landing pages.</p>
            </div>

            <InboxClient initialSubmissions={submissions || []} />
        </div>
    );
}
