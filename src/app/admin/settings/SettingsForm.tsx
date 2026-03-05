'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { updateSiteSettings } from '@/app/actions/settings';
import { Save, CheckCircle2, Shield, Globe, Mail } from 'lucide-react';

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
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid gap-8">
                {/* Tracking Section */}
                <div className="premium-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Globe size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 font-sora">Marketing Tracking</h3>
                            <p className="text-slate-500 text-sm">Global analytics and advertising identifiers.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">GA4 Measurement ID</label>
                            <input
                                type="text"
                                name="ga4_id"
                                defaultValue={initialSettings?.default_ga4_id || ''}
                                placeholder="G-XXXXXXXXXX"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all shadow-sm"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">Primary Google Analytics connector.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Meta Pixel ID</label>
                            <input
                                type="text"
                                name="pixel_id"
                                defaultValue={initialSettings?.default_pixel_id || ''}
                                placeholder="123456789012345"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all shadow-sm"
                            />
                            <p className="text-[10px] text-slate-400 font-medium">Fallback Facebook tracking identifier.</p>
                        </div>
                    </div>
                </div>

                {/* Communication Section */}
                <div className="premium-card p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 font-sora">System Notifications</h3>
                            <p className="text-slate-500 text-sm">Configure how the platform contacts you.</p>
                        </div>
                    </div>

                    <div className="space-y-2 max-w-md">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Admin Contact Email</label>
                        <input
                            type="email"
                            name="contact_email"
                            defaultValue={initialSettings?.contact_email || ''}
                            placeholder="admin@analytixlabs.co.in"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-slate-100 focus:bg-white transition-all shadow-sm"
                        />
                        <p className="text-[10px] text-slate-400 font-medium">Destination for system alerts and critical updates.</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-6 pt-4 px-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-slate-200 disabled:opacity-50"
                >
                    <Save size={18} />
                    {isPending ? 'Saving Changes...' : 'Update Settings'}
                </button>
                {saved && (
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm animate-in fade-in slide-in-from-left-4">
                        <CheckCircle2 size={18} />
                        <span>Changes stored successfully</span>
                    </div>
                )}
            </div>
        </form>
    );
}

