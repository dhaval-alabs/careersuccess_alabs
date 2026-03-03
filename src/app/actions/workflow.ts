'use server';

import { createClient } from '@/utils/supabase/server';
// @ts-ignore
import { revalidatePath } from 'next/cache';

import { logAuditAction } from '@/app/actions/audit';

export async function submitForReview(pageId: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('landing_pages')
        .update({ status: 'review' })
        .eq('id', pageId);

    if (error) throw new Error("Failed to update status");

    await logAuditAction(supabase, user.id, 'submit_review', 'page', pageId);

    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages`);
    return { success: true };
}

export async function publishPage(pageId: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("Unauthorized");

    // Get the full page and visible sections for the snapshot
    const [{ data: page }, { data: sections }] = await Promise.all([
        supabase.from('landing_pages').select('*').eq('id', pageId).single(),
        supabase.from('page_sections').select('*').eq('page_id', pageId).eq('is_visible', true).order('display_order')
    ]);

    if (!page) throw new Error("Page not found");

    // Calculate next version number
    const { data: lastVersion } = await supabase
        .from('page_versions')
        .select('version_number')
        .eq('page_id', pageId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

    const nextVersionNumber = lastVersion ? lastVersion.version_number + 1 : 1;

    // Create the version snapshot
    const { error: versionError } = await supabase.from('page_versions').insert({
        page_id: pageId,
        snapshot: { page, sections },
        published_by: user.id,
        version_number: nextVersionNumber,
        change_summary: `Published version ${nextVersionNumber}`
    });

    if (versionError) {
        console.error("Version creation error:", versionError);
        throw new Error("Failed to create version snapshot");
    }

    // Update page status and published_at
    const { error: updateError } = await supabase
        .from('landing_pages')
        .update({ status: 'published', published_at: new Date().toISOString() })
        .eq('id', pageId);

    if (updateError) throw new Error("Failed to update page status");

    await logAuditAction(supabase, user.id, 'publish', 'page', pageId);

    // Revalidate routes
    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages`);
    // Note: To revalidate the public ISR route, we would technically hit `revalidatePath('/lp/[slug]')`
    // but Next 13/14 requires the exact path if ISR.
    revalidatePath(`/lp/${page.slug}`);

    return { success: true };
}

export async function rejectPage(pageId: string, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
        .from('landing_pages')
        .update({ status: 'draft' })
        .eq('id', pageId);

    if (error) throw new Error("Failed to reject page");

    await logAuditAction(supabase, user.id, 'reject', 'page', pageId, { reason });

    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages`);
    return { success: true };
}

export async function unpublishPage(pageId: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("Unauthorized");

    // Need slug to revalidate
    const { data: page } = await supabase.from('landing_pages').select('slug').eq('id', pageId).single();

    const { error } = await supabase
        .from('landing_pages')
        .update({ status: 'unpublished' })
        .eq('id', pageId);

    if (error) throw new Error("Failed to unpublish page");

    await logAuditAction(supabase, user.id, 'manage_user', 'page', pageId, { status: 'unpublished' }); // Using manage_user as a generic admin action for now

    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages`);
    if (page?.slug) revalidatePath(`/lp/${page.slug}`);

    return { success: true };
}

export async function schedulePage(pageId: string, scheduledDate: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("Unauthorized");

    // We can allow scheduling for pages in draft or review
    const { error } = await supabase
        .from('landing_pages')
        .update({ scheduled_for: scheduledDate, status: 'review' }) // Auto-submit to review if scheduled
        .eq('id', pageId);

    if (error) {
        console.error("Schedule error:", error);
        throw new Error("Failed to schedule page publication");
    }

    await logAuditAction(supabase, user.id, 'schedule_publish', 'page', pageId, { scheduled_for: scheduledDate });

    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages`);

    return { success: true };
}

export async function restoreVersion(pageId: string, versionId: string) {
    const supabase = await createClient();
    const { data: { user } } = await (supabase.auth as any).getUser();
    if (!user) throw new Error("Unauthorized");

    // Get the version snapshot
    const { data: version } = await supabase
        .from('page_versions')
        .select('snapshot, version_number')
        .eq('id', versionId)
        .single();

    if (!version) throw new Error("Version not found");

    const { page, sections } = version.snapshot;

    // 1. Restore page metadata
    const { error: pageError } = await supabase
        .from('landing_pages')
        .update({
            title: page.title,
            slug: page.slug,
            campaign_tag: page.campaign_tag,
            course_name: page.course_name,
            meta_title: page.meta_title,
            meta_description: page.meta_description,
            og_image_url: page.og_image_url,
            ga4_measurement_id: page.ga4_measurement_id,
            meta_pixel_id: page.meta_pixel_id,
            utm_passthrough: page.utm_passthrough,
            status: 'draft' // Put it back to draft after restore to allow previewing
        })
        .eq('id', pageId);

    if (pageError) throw new Error("Failed to restore page metadata");

    // 2. Delete existing sections
    const { error: deleteError } = await supabase
        .from('page_sections')
        .delete()
        .eq('page_id', pageId);

    if (deleteError) throw new Error("Failed to clear current sections for restore");

    // 3. Insert snapshot sections
    const sectionsToInsert = sections.map((s: any) => ({
        id: s.id,
        page_id: pageId,
        type: s.type,
        order_index: s.order_index,
        display_order: s.display_order || s.order_index,
        is_visible: s.is_visible,
        content: s.content
    }));

    if (sectionsToInsert.length > 0) {
        const { error: insertError } = await supabase
            .from('page_sections')
            .insert(sectionsToInsert);

        if (insertError) throw new Error("Failed to restore sections");
    }

    await logAuditAction(supabase, user.id, 'restore_version', 'page', pageId, { restored_version: version.version_number });

    revalidatePath(`/pages/${pageId}/edit`);
    revalidatePath(`/pages/${pageId}/versions`);
    revalidatePath(`/pages`);

    return { success: true };
}
