'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateSiteSettings } from '@/app/actions/settings';
import { Save, CheckCircle2 } from 'lucide-react';

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                await updateSiteSettings(formData);
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            } catch (error: any) {
                alert(error.message || "Failed to save settings");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl text-sm">
            <div className="space-y-4">
                <div>
                    <label className="block font-medium text-slate-700 mb-1">
                        Default GA4 Measurement ID
                    </label>
                    <input
                        type="text"
                        name="ga4_id"
                        defaultValue={initialSettings?.default_ga4_id || ''}
                        placeholder="G-XXXXXXXXXX"
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-slate-500 mt-1">Used for Google Analytics tracking if the page doesn't have a specific ID.</p>
                </div>

                <div>
                    <label className="block font-medium text-slate-700 mb-1">
                        Default Meta Pixel ID
                    </label>
                    <input
                        type="text"
                        name="pixel_id"
                        defaultValue={initialSettings?.default_pixel_id || ''}
                        placeholder="123456789012345"
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-slate-500 mt-1">Used for Facebook/Meta Ad tracking fallback.</p>
                </div>

                <div>
                    <label className="block font-medium text-slate-700 mb-1">
                        System Contact Email
                    </label>
                    <input
                        type="email"
                        name="contact_email"
                        defaultValue={initialSettings?.contact_email || ''}
                        placeholder="admin@example.com"
                        className="w-full px-3 py-2 border rounded-md focus:ring-primary focus:border-primary"
                    />
                    <p className="text-xs text-slate-500 mt-1">Primary contact for system notices.</p>
                </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
                <Button type="submit" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? 'Saving...' : 'Save Settings'}
                </Button>
                {saved && (
                    <span className="text-green-600 flex items-center font-medium animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Settings saved successfully
                    </span>
                )}
            </div>
        </form>
    );
}
