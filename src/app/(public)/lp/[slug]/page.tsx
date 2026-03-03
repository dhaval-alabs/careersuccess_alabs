import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { createClient } from '@/utils/supabase/server';
import { HeroBanner } from '@/components/public/sections/HeroBanner';
import { TrustStrip } from '@/components/public/sections/TrustStrip';
import { ComparisonTable } from '@/components/public/sections/ComparisonTable';
import { CurriculumTimeline } from '@/components/public/sections/CurriculumTimeline';
import { TracksFees } from '@/components/public/sections/TracksFees';
import { LearningModes } from '@/components/public/sections/LearningModes';
import { JobRoles } from '@/components/public/sections/JobRoles';
import { SalaryStats } from '@/components/public/sections/SalaryStats';
import { FAQAccordion } from '@/components/public/sections/FAQAccordion';
import { CTABanner } from '@/components/public/sections/CTABanner';
import { Footer } from '@/components/public/sections/Footer';
import { AnalyticsTracker } from '@/components/public/AnalyticsTracker';

// Enforce dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default async function LandingPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ preview?: string }> }) {
    const supabase = await createClient();
    const { slug } = await params;
    const resolvedSearchParams = await searchParams;
    const isPreview = resolvedSearchParams.preview === 'true';

    // 1. Fetch the page by slug (allow unpublished if preview=true)
    let pageQuery = supabase
        .from('landing_pages')
        .select('*')
        .eq('slug', slug);

    if (!isPreview) {
        pageQuery = pageQuery.eq('status', 'published');
    }

    const { data: page, error: pageError } = await pageQuery.single();

    if (pageError || !page) {
        notFound(); // 404 handling for unpublished or non-existent slugs
    }

    // 2. Fetch the sections for this page
    let sectionsQuery = supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', page.id)
        .order('order_index', { ascending: true });

    if (!isPreview) {
        sectionsQuery = sectionsQuery.eq('is_visible', true);
    }

    const { data: sections, error: sectionsError } = await sectionsQuery;

    if (sectionsError) {
        console.error('Error fetching sections:', sectionsError);
        // Even if sections fail, we might want to render what we can or wait
    }

    // 3. Fetch global site settings for fallbacks
    const { data: settings } = await supabase
        .from('site_settings')
        .select('default_ga4_id, default_pixel_id')
        .eq('id', 1)
        .single();

    // Map of component types to actual React components
    const sectionComponents: Record<string, React.ComponentType<any>> = {
        hero: HeroBanner,
        trust_strip: TrustStrip,
        comparison_table: ComparisonTable,
        curriculum_timeline: CurriculumTimeline,
        tracks_fees: TracksFees,
        learning_modes: LearningModes,
        career_roles: JobRoles,
        salary_stats: SalaryStats,
        faq_accordion: FAQAccordion,
        cta_banner: CTABanner
    };

    return (
        <main className="min-h-screen relative font-sans">
            <Suspense fallback={null}>
                <AnalyticsTracker
                    ga4Id={page.ga4_measurement_id || settings?.default_ga4_id}
                    metaPixelId={page.meta_pixel_id || settings?.default_pixel_id}
                    pageId={page.id}
                />
            </Suspense>
            {sections?.map((section) => {
                const Component = sectionComponents[section.type];
                if (!Component) return null;

                // Render the component, passing its JSON content as props
                return <Component key={section.id} {...(section.content || {})} />;
            })}

            {/* Always render footer */}
            <Footer />
        </main>
    );
}
