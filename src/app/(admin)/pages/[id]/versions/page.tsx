import { createClient } from '@/utils/supabase/server';
import { notFound, redirect } from 'next/navigation';
import VersionsClient from './VersionsClient';

export default async function PageVersions({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const [{ data: page }, { data: versions }] = await Promise.all([
        supabase.from('landing_pages').select('*').eq('id', params.id).single(),
        supabase.from('page_versions').select('*, published_by(email)').eq('page_id', params.id).order('version_number', { ascending: false })
    ]);

    if (!page) notFound();

    return (
        <VersionsClient
            page={page}
            versions={versions || []}
        />
    );
}
