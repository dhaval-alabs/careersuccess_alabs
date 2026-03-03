import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// We intentionally use the service role key here because this is a background cron job
// and it needs admin privileges to publish pages and insert versions bypassing RLS.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const cronSecret = process.env.CRON_SECRET;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: Request) {
    // 1. Authenticate the cron request
    const authHeader = request.headers.get('authorization');
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    try {
        // 2. Find pages that are scheduled to be published and the time has passed
        // Status typically needs to be 'review' or 'scheduled' for this to apply. We'll check for scheduled_for IS NOT NULL.
        const { data: pagesToPublish, error: fetchError } = await supabase
            .from('landing_pages')
            .select('id, slug, title')
            .not('scheduled_for', 'is', null)
            .lte('scheduled_for', new Date().toISOString())
            .in('status', ['draft', 'review']); // Assuming scheduled pages could be marked as draft or review

        if (fetchError) {
            console.error("Cron Error fetch pages:", fetchError);
            return new Response('Error fetching pages', { status: 500 });
        }

        if (!pagesToPublish || pagesToPublish.length === 0) {
            return new Response('No pages to publish', { status: 200 });
        }

        console.log(`[Cron] Found ${pagesToPublish.length} pages scheduled for publishing.`);

        // 3. Process each page sequentially
        for (const page of pagesToPublish) {
            console.log(`[Cron] Publishing page: ${page.title} (${page.id})`);

            // Get full page data and sections for the snapshot
            const [{ data: pageData }, { data: sectionsData }] = await Promise.all([
                supabase.from('landing_pages').select('*').eq('id', page.id).single(),
                supabase.from('page_sections').select('*').eq('page_id', page.id).eq('is_visible', true).order('display_order')
            ]);

            if (!pageData) continue;

            // Calculate next version
            const { data: lastVersion } = await supabase
                .from('page_versions')
                .select('version_number')
                .eq('page_id', page.id)
                .order('version_number', { ascending: false })
                .limit(1)
                .single();

            const nextVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

            // Insert Version Snapshot
            // Note: published_by is null because it's a system action. We could optionally link it to the user who scheduled it later.
            await supabase.from('page_versions').insert({
                page_id: page.id,
                snapshot: { page: pageData, sections: sectionsData },
                version_number: nextVersionNumber,
                change_summary: `Scheduled system publish (Version ${nextVersionNumber})`
            });

            // Update page to published and clear the schedule
            await supabase
                .from('landing_pages')
                .update({
                    status: 'published',
                    published_at: new Date().toISOString(),
                    scheduled_for: null // Clear the schedule
                })
                .eq('id', page.id);

            // System audit log
            await supabase.from('audit_logs').insert({
                user_id: pageData.created_by, // Fallback to creator for system logs if we don't have the explicit scheduler
                action: 'cron_publish',
                target_type: 'page',
                target_id: page.id,
                metadata: { system: true, scheduled_time: pageData.scheduled_for }
            });

            // Revalidate frontend
            revalidatePath(`/pages/${page.id}/edit`);
            revalidatePath(`/pages`);
            revalidatePath(`/lp/${page.slug}`);
        }

        return new Response(`Successfully published ${pagesToPublish.length} pages`, { status: 200 });

    } catch (error) {
        console.error("Cron Execution Error:", error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
