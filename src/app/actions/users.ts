'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateUserRole(userId: string, newRole: 'editor' | 'publisher' | 'super_admin') {
    const supabase = await createClient();

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    // Super Admin Authorization Check
    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') {
        throw new Error("Forbidden: Only Super Admins can manage roles.");
    }

    // Can't demote yourself
    if (user.id === userId && newRole !== 'super_admin') {
        throw new Error("Cannot demote your own account.");
    }

    const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId);

    if (error) {
        console.error("Failed to update user role:", error);
        throw new Error("Database error updating role.");
    }

    // Audit Log
    await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'manage_user',
        target_type: 'user',
        target_id: userId,
        metadata: { new_role: newRole }
    });

    revalidatePath('/users');
    return { success: true };
}
