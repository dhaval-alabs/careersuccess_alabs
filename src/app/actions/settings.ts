'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateSiteSettings(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') {
        throw new Error("Forbidden");
    }

    const { error } = await supabase
        .from('site_settings')
        .update({
            default_ga4_id: formData.get('ga4_id')?.toString() || null,
            default_pixel_id: formData.get('pixel_id')?.toString() || null,
            contact_email: formData.get('contact_email')?.toString() || null,
            updated_at: new Date().toISOString()
        })
        .eq('id', 1);

    if (error) {
        console.error("Settings update error:", error);
        throw new Error("Failed to update site settings");
    }

    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'manage_user', // Using manage_user as a generic admin action
        target_type: 'settings',
        target_id: '1',
        metadata: { updated: 'site_settings' }
    });

    revalidatePath('/settings');
    // Also revalidate all landing pages since they might rely on these defaults
    revalidatePath('/lp/[slug]', 'page');

    return { success: true };
}
