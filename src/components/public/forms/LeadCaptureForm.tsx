'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useLeadTracker } from '@/hooks/useLeadTracker';

export interface LeadCaptureFormProps {
    sourceName: string; // e.g., 'hero_banner', 'cta_banner'
    children: React.ReactNode; // The user's legacy HTML form goes here
}

export function LeadCaptureForm({ sourceName, children }: LeadCaptureFormProps) {
    // 1. Initialize the tracker to ensure this session is recorded
    const sessionId = useLeadTracker();
    const formRef = useRef<HTMLFormElement>(null);
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        // Prevent default submission to handle it via AJAX/Supabase first
        e.preventDefault();

        if (!sessionId) {
            console.error('No session ID found for tracking');
            // Fallback: still let the form submit normally if tracking fails?
            // e.currentTarget.submit();
            // return;
        }

        setStatus('submitting');
        const formData = new FormData(e.currentTarget);

        // Extract basic data assuming standard field names. 
        // We also save the raw JSON in case they use custom names.
        const name = (formData.get('name') || formData.get('fullname') || formData.get('first_name') || '') as string;
        const email = (formData.get('email') || formData.get('email_address') || '') as string;
        const phone = (formData.get('phone') || formData.get('mobile') || formData.get('phone_number') || '') as string;

        // Convert FormData to a plain object for raw JSON storage
        const rawHtmlData: Record<string, string> = {};
        formData.forEach((value, key) => {
            rawHtmlData[key] = value.toString();
        });

        try {
            const supabase = createClient();

            // 2. Insert the lead into Supabase, mapped to their behavioral session ID
            const { error: dbError } = await supabase.from('leads').insert({
                session_id: sessionId || 'unknown_session',
                name: name || 'Unknown', // Fallback if they didn't map names correctly
                email: email || 'Unknown',
                phone: phone,
                form_source: sourceName,
                raw_html_data: rawHtmlData
            });

            if (dbError) throw dbError;

            setStatus('success');

            // 3. Optional: Actually submit the legacy form to its original action URL if one exists
            // This is useful if they still want it sent to their old CRM, Webhook, etc.
            const actionUrl = e.currentTarget.action;
            if (actionUrl && actionUrl !== window.location.href) {
                // Submit programmatically bypassing our React handler
                e.currentTarget.submit();
            }

        } catch (error) {
            console.error('Error submitting lead:', error);
            setStatus('error');
        }
    };

    return (
        <div className="lead-capture-wrapper relative">
            {/* We attach our custom onSubmit handler to a wrapper form, 
                or if the children is just the inputs, it works perfectly. */}
            <form ref={formRef} onSubmit={handleSubmit} className="relative z-10 w-full">

                {children}

                {/* Status Overlays */}
                {status === 'submitting' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-20">
                        <div className="w-6 h-6 border-2 border-[var(--teal)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {status === 'success' && (
                    <div className="absolute inset-0 bg-[var(--navy)]/95 backdrop-blur-md flex flex-col items-center justify-center rounded-lg z-20 text-white p-6 text-center">
                        <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-3 text-2xl">✓</div>
                        <h4 className="font-sora font-bold text-lg mb-1">Application Received</h4>
                        <p className="text-sm text-white/70">Our admissions team will contact you shortly.</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs text-center py-2 px-4 rounded-t-lg z-20">
                        There was an error submitting your details. Please try again.
                    </div>
                )}
            </form>
        </div>
    );
}
