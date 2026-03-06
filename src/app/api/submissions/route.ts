import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/server';

// Simple in-memory store for rate limiting IP addresses
const rateLimitMap = new Map<string, number[]>();

export async function POST(req: Request) {
    try {
        const supabase = createAdminClient();

        const body = await req.json();
        const { page_id, data, utms } = body;

        if (!page_id || !data) {
            return NextResponse.json(
                { error: 'Missing required fields (page_id, data)' },
                { status: 400 }
            );
        }

        // Get IP address for security / rate limiting (basic hash)
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const ip_hash = Buffer.from(ip).toString('base64'); // Simple obfuscation

        // Rate Limiting Logic (In-Memory for simplicity, replace with Redis for production)
        const now = Date.now();
        const windowSize = 60 * 1000; // 1 minute
        const maxRequests = 5; // 5 submissions per minute

        const requestHistory = rateLimitMap.get(ip_hash) || [];
        const recentRequests = requestHistory.filter(timestamp => now - timestamp < windowSize);

        if (recentRequests.length >= maxRequests) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        recentRequests.push(now);
        rateLimitMap.set(ip_hash, recentRequests);

        const { error } = await supabase.from('form_submissions').insert({
            page_id,
            data,
            utm_source: utms?.utm_source || null,
            utm_medium: utms?.utm_medium || null,
            utm_campaign: utms?.utm_campaign || null,
            utm_content: utms?.utm_content || null,
            utm_term: utms?.utm_term || null,
            ip_hash
        });

        if (error) {
            console.error('Supabase insert error for form submission:', error);
            return NextResponse.json(
                { error: 'Database error' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true }, { status: 201 });

    } catch (error) {
        console.error('Submission API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
