import { Suspense } from 'react';
import { getLeads } from '@/app/actions/leads';
import LeadsClient from './LeadsClient';
import { Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <LeadsClient initialLeads={leads || []} />
        </Suspense>
    );
}
