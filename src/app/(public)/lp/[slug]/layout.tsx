import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = await createClient();

    const { data: page } = await supabase
        .from('landing_pages')
        .select('meta_title, meta_description, og_image_url')
        .eq('slug', params.slug)
        .single();

    if (!page) {
        return { title: 'Not Found' };
    }

    return {
        title: page.meta_title || 'AnalytixLabs Course',
        description: page.meta_description,
        openGraph: page.og_image_url ? {
            images: [{ url: page.og_image_url }],
        } : {}
    };
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="holo-bg">
                <div className="holo-blob holo-blob-1"></div>
                <div className="holo-blob holo-blob-2"></div>
                <div className="holo-blob holo-blob-3"></div>
                <div className="holo-blob holo-blob-4"></div>
            </div>
            <div className="holo-grid"></div>
            <div className="holo-shimmer"></div>

            {children}
        </>
    );
}
