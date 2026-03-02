import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import EditorClient from './EditorClient';

export default async function EditPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    // Ensure authed
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Fetch Page
    const { data: page, error: pageError } = await supabase
        .from('landing_pages')
        .select('*')
        .eq('id', params.id)
        .single();

    if (pageError || !page) {
        notFound();
    }

    // Fetch Sections
    const { data: sections, error: sectionsError } = await supabase
        .from('page_sections')
        .select('*')
        .eq('page_id', params.id)
        .order('order_index', { ascending: true });

    if (sectionsError || !sections) {
        console.error("Error fetching sections", sectionsError);
    }

    return (
        <EditorClient initialPage={page} initialSections={sections || []} />
    );
}
