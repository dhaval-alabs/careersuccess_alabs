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
        <div className="max-w-2xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create New Landing Page</h1>
                <p className="text-muted-foreground mt-2">Initialize a new landing page. It will be pre-populated with the 10 standard sections.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 border rounded-xl shadow-sm space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200 text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="title">Page Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Data Analytics Spring Cohort"
                        required
                    />
                    <p className="text-xs text-muted-foreground">Used internally and as the default SEO Title.</p>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                    <div className="flex rounded-md shadow-sm">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground sm:text-sm">
                            /lp/
                        </span>
                        <Input
                            id="slug"
                            className="rounded-l-none"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="data-analytics-spring"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="courseName">Course Name (Optional)</Label>
                        <Input
                            id="courseName"
                            value={courseName}
                            onChange={(e) => setCourseName(e.target.value)}
                            placeholder="e.g. PG in Data Analytics"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="campaignTag">Campaign Tag (Optional)</Label>
                        <Input
                            id="campaignTag"
                            value={campaignTag}
                            onChange={(e) => setCampaignTag(e.target.value)}
                            placeholder="e.g. spring-2025-meta"
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t">
                    <Button type="button" variant="outline" onClick={() => router.push('/admin')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading || !title || !slug}>
                        {isLoading ? 'Creating...' : 'Create & Edit Template'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
