"use client";

import { useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { useLeadTracker } from '@/hooks/useLeadTracker';
import Script from 'next/script';

export interface AnalyticsTrackerProps {
    ga4Id?: string;
    metaPixelId?: string;
    pageId: string;
}

export function AnalyticsTracker({ ga4Id, metaPixelId, pageId }: AnalyticsTrackerProps) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const sessionId = useLeadTracker();

    // 1. UTM Parameter Capture - Isolated for searchParams dependency
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const utmObj: Record<string, string> = {};
        const utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'keyword', 'matchtype'];

        let hasUtms = false;

        // Next.js searchParams misses parameters that fall after a '#' hash fragment (e.g. ad networks appending ?gclid=x to an anchor link)
        const fullHashAndSearch = window.location.search + window.location.hash;

        utmKeys.forEach(key => {
            let val = searchParams.get(key);

            // Backup regex check for parameters stuck inside the hash fragment
            if (!val) {
                const regex = new RegExp(`[?&]${key}=([^&#]*)`, 'i');
                const match = fullHashAndSearch.match(regex);
                if (match && match[1]) {
                    val = match[1];
                }
            }

            if (val) {
                utmObj[key] = val;
                hasUtms = true;
            }
        });

        if (hasUtms) {
            sessionStorage.setItem('current_utms', JSON.stringify(utmObj));
        }
    }, [searchParams]);

    // 2. Custom page_view event & tracking initialization - Isolated for pathname dependency
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // DataLayer for GA4
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'cms_page_view',
            page_id: pageId,
            page_path: pathname
        });

        // Meta Pixel tracking
        if ((window as any).fbq) {
            (window as any).fbq('trackCustom', 'CMSPageView', { page_id: pageId });
        }

        // Add click tracking to all CTA buttons
        const ctaButtons = document.querySelectorAll('a[href^="#enroll"], .btn-primary-custom, .btn-secondary-custom');

        const handleCtaClick = (e: Event) => {
            const target = e.currentTarget as HTMLAnchorElement;

            window.dataLayer.push({
                event: 'cta_click',
                page_id: pageId,
                cta_label: target.innerText || target.textContent,
                cta_href: target.getAttribute('href')
            });

            if ((window as any).fbq) {
                (window as any).fbq('trackCustom', 'CTAClick', {
                    page_id: pageId,
                    button_label: target.innerText
                });
            }
        };

        ctaButtons.forEach(btn => btn.addEventListener('click', handleCtaClick));

        return () => {
            ctaButtons.forEach(btn => btn.removeEventListener('click', handleCtaClick));
        };
    }, [pathname, pageId]);

    return (
        <>
            {/* GA4 Script Injection */}
            {ga4Id && (
                <>
                    <Script
                        src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
                        strategy="afterInteractive"
                    />
                    <Script id="ga4-init" strategy="afterInteractive">
                        {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga4Id}', {
                page_path: window.location.pathname,
              });
            `}
                    </Script>
                </>
            )}

            {/* Meta Pixel Script Injection */}
            {metaPixelId && (
                <Script id="meta-pixel" strategy="afterInteractive">
                    {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
                </Script>
            )}
        </>
    );
}
