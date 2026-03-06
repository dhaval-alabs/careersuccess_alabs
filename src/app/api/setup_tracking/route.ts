import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const supabase = createAdminClient()
        // We will execute a raw SQL query using the built-in postgres meta functions
        // To add gclid and source_keyword columns if they don't exist
        const query = `
            ALTER TABLE public.leads 
            ADD COLUMN IF NOT EXISTS gclid TEXT,
            ADD COLUMN IF NOT EXISTS source_keyword TEXT;
        `;

        // Supabase JS doesn't support raw SQL directly out of the box unless via RPC.
        // If we can't run RPC, we will gracefully handle this by just storing
        // tracking data in a JSON payload in our application logic instead

        return NextResponse.json({
            success: true,
            message: 'To add columns, run this SQL in Supabase Dashboard SQL Editor:',
            sql: query
        })
    } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message })
    }
}
