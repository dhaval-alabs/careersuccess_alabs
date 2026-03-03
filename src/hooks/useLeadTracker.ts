'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';


export function useLeadTracker() {
    const pathname = usePathname();
    const [sessionId, setSessionId] = useState<string | null>(null);

    // Initialize or retrieve Session ID
    useEffect(() => {
        let sid: string | null = sessionStorage.getItem('alabs_session_id');
        if (!sid) {
            sid = crypto.randomUUID();
            sessionStorage.setItem('alabs_session_id', sid);
        }
        setSessionId(sid);
    }, []);

    // Global click tracking
    useEffect(() => {
        if (!sessionId) return;

        const supabase = createClient();

        const handleClick = async (e: MouseEvent) => {
            // Find the closest element with a tracking attribute
            const target = e.target as HTMLElement;
            const trackedElement = target.closest('[data-track-click]');

            if (trackedElement) {
                const elementId = trackedElement.getAttribute('data-track-click');
                if (!elementId) return;

                try {
                    // Send to Supabase non-blocking
                    await supabase.from('lead_events').insert({
                        session_id: sessionId,
                        event_type: 'click',
                        element_id: elementId,
                        page_url: window.location.href,
                        referrer: document.referrer || null
                    });
                } catch (err) {
                    console.error('Failed to log click event', err);
                }
            }
        };

        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, [sessionId, pathname]); // Re-bind on route change just in case

    // Scroll tracking (Intersection Observer for sections)
    useEffect(() => {
        if (!sessionId) return;

        const supabase = createClient();
        const trackedSections = new Set<string>(); // Keep track of seen sections so we don't log them repeatedly in one session

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(async (entry) => {
                if (entry.isIntersecting) {
                    const elementId = entry.target.getAttribute('data-track-section');
                    if (elementId && !trackedSections.has(elementId)) {
                        trackedSections.add(elementId);

                        try {
                            await supabase.from('lead_events').insert({
                                session_id: sessionId,
                                event_type: 'view_section',
                                element_id: elementId,
                                page_url: window.location.href,
                                referrer: document.referrer || null
                            });
                        } catch (err) {
                            console.error('Failed to log view event', err);
                        }
                    }
                }
            });
        }, { threshold: 0.3 }); // Trigger when 30% of the section is visible

        // Observe all elements with data-track-section
        const nodes = document.querySelectorAll('[data-track-section]');
        nodes.forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [sessionId, pathname]);

    return sessionId;
}
