import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import VersionsClient from './VersionsClient';

export const dynamic = 'force-dynamic';

export default async function PageVersions({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const [{ data: page }, { data: versions }] = await Promise.all([
        supabase.from('landing_pages').select('*').eq('id', id).single(),
        supabase.from('page_versions').select('*, published_by(email)').eq('page_id', id).order('version_number', { ascending: false })
    ]);

    if (!page) notFound();

    return (
        <VersionsClient
            page={page}
            versions={versions || []}
        />
    );
}
