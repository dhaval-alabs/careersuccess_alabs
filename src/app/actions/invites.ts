'use server';

import { createClient } from '@supabase/supabase-js';
// @ts-ignore
import { revalidatePath } from 'next/cache';
import { logAuditAction } from './audit';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// Use service key to bypass RLS and use Admin API
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function inviteUser(email: string, role: string, inviterId: string) {
    if (!email || !role || !inviterId) {
        throw new Error("Missing required fields");
    }

    try {
        // 1. Send invite email via Supabase Auth Admin
        const { data: authData, error: inviteError } = await (supabaseAdmin.auth as any).admin.inviteUserByEmail(email, {
            data: { role: role } // Pass role in user_metadata for JWT claims later if needed
        });

        if (inviteError) {
            console.error("Auth Invite Error:", inviteError);
            throw new Error(inviteError.message || "Failed to send invitation.");
        }

        const newUserId = authData.user.id;

        // 2. Insert or update the public.users profile record
        // By default, Supabase triggers might insert a blank profile. We UPSERT to make sure the role is specifically set.
        const { error: profileError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: newUserId,
                email: email,
                name: email.split('@')[0], // Give them a default name
                role: role,
                updated_at: new Date().toISOString()
            }, { onConflict: 'id' });

        if (profileError) {
            console.error("Profile Upsert Error:", profileError);
            throw new Error("User was invited but failed to assign role.");
        }

        // 3. Log the audit action
        await logAuditAction(supabaseAdmin, inviterId, 'invite_user', 'user', newUserId, { invited_email: email, assigned_role: role });

        revalidatePath('/admin/users');
        return { success: true, user: { id: newUserId, email, role, name: email.split('@')[0], created_at: new Date().toISOString() } };

    } catch (error: any) {
        console.error("Invite User Action Error:", error);
        throw new Error(error.message || "An unexpected error occurred.");
    }
}
