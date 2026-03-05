'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewPage() {
    const router = useRouter();
    const supabase = createClient();

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [campaignTag, setCampaignTag] = useState('');
    const [courseName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateSlug = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-');    // Replace multiple - with single -
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        // Only auto-generate slug if it hasn't been manually edited heavily
        if (!slug || generateSlug(title) === slug) {
            setSlug(generateSlug(newTitle));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // 1. Get current user
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error("Must be logged in to create a page");

            // 2. Default sections block based on the PRD specification
            // We'll create the 10 sections directly with their default JSON
            const defaultSections = [
                { type: 'hero', order_index: 0 },
                { type: 'trust_strip', order_index: 1 },
                { type: 'comparison_table', order_index: 2 },
                { type: 'curriculum_timeline', order_index: 3 },
                { type: 'tracks_fees', order_index: 4 },
                { type: 'learning_modes', order_index: 5 },
                { type: 'career_roles', order_index: 6 },
                { type: 'salary_stats', order_index: 7 },
                { type: 'faq_accordion', order_index: 8 },
                { type: 'cta_banner', order_index: 9 }
            ].map(s => ({ ...s, content: {} })); // Content can be populated later

            // 3. Insert into database
            const { data: page, error: insertError } = await supabase
                .from('landing_pages')
                .insert({
                    title,
                    slug,
                    campaign_tag: campaignTag,
                    course_name: courseName,
                    status: 'draft',
                    created_by: user.id
                })
                .select('id')
                .single();

            if (insertError) throw insertError;
            if (!page) throw new Error("Failed to create page record.");

            // 4. Insert default sections
            const sectionsToInsert = defaultSections.map(s => ({ ...s, page_id: page.id }));
            const { error: sectionError } = await supabase
                .from('page_sections')
                .insert(sectionsToInsert);

            if (sectionError) throw sectionError;

            // 5. Redirect to the editor
            router.push(`/admin/pages/${page.id}/edit`);

        } catch (err: any) {
            console.error("Error creating page:", err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen admin-premium-bg py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 font-sora">
                        Create New Landing Page
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg">
                        Initialize a new landing page. It will be pre-populated with the 10 standard sections.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="premium-card p-10 space-y-8">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100 text-sm animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}

                    <div className="grid gap-8">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-slate-700 font-medium ml-1">Page Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={handleTitleChange}
                                placeholder="e.g. Data Analytics Spring Cohort"
                                className="h-12 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10 transition-all"
                                required
                            />
                            <p className="text-xs text-slate-400 ml-1">Used internally and as the default SEO Title.</p>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="slug" className="text-slate-700 font-medium ml-1">URL Slug <span className="text-red-500">*</span></Label>
                            <div className="flex rounded-xl shadow-sm overflow-hidden border border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
                                <span className="inline-flex items-center px-4 bg-slate-50 text-slate-400 text-sm border-r border-slate-200">
                                    /lp/
                                </span>
                                <input
                                    id="slug"
                                    className="flex-1 h-12 px-4 text-sm outline-none bg-white"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    placeholder="data-analytics-spring"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="courseName" className="text-slate-700 font-medium ml-1">Course Name (Optional)</Label>
                                <Input
                                    id="courseName"
                                    value={courseName}
                                    onChange={(e) => setCourseName(e.target.value)}
                                    placeholder="e.g. PG in Data Analytics"
                                    className="h-12 rounded-xl border-slate-200"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="campaignTag" className="text-slate-700 font-medium ml-1">Campaign Tag (Optional)</Label>
                                <Input
                                    id="campaignTag"
                                    value={campaignTag}
                                    onChange={(e) => setCampaignTag(e.target.value)}
                                    placeholder="e.g. spring-2025-meta"
                                    className="h-12 rounded-xl border-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 flex items-center justify-end gap-4 border-t border-slate-100">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-12 px-6 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                            onClick={() => router.push('/admin/pages')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                            disabled={isLoading || !title || !slug}
                        >
                            {isLoading ? 'Creating...' : 'Create & Edit Template'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
