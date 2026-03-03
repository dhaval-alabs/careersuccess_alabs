import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'super_admin') {
        redirect('/'); // Redirect non-admins
    }

    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Site-Wide Settings</h1>
                <p className="text-muted-foreground mt-2">Configure global defaults for the CMS and published pages.</p>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b bg-slate-50">
                    <h2 className="font-semibold text-lg">Analytics & Fallbacks</h2>
                    <p className="text-sm text-slate-500 mt-1">If a landing page doesn't specify its own tracking IDs, these global defaults will be used.</p>
                </div>
                <div className="p-6">
                    <SettingsForm initialSettings={settings || {}} />
                </div>
            </div>
        </div>
    );
}
