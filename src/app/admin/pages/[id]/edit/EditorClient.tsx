'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { formatTypeLabel } from '@/lib/utils';
import { GripVertical, Save, Eye, CheckCircle2, CircleDashed, LayoutTemplate, Send, CheckSquare, XCircle, RotateCcw, History, Settings, CalendarClock } from 'lucide-react';
import { SectionFormRegistry } from '@/components/admin/forms';
import { submitForReview, publishPage, rejectPage, unpublishPage, schedulePage } from '@/app/actions/workflow';

export default function EditorClient({ initialPage, initialSections }: { initialPage: any, initialSections: any[] }) {
    const router = useRouter();
    const supabase = createClient();

    const [page, setPage] = useState(initialPage);
    const [sections, setSections] = useState(initialSections);
    const [activeSectionId, setActiveSectionId] = useState<string | null>(initialSections.length > 0 ? initialSections[0].id : null);

    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    const activeSection = activeSectionId === 'settings'
        ? null
        : sections.find(s => s.id === activeSectionId);

    const handleContentUpdate = (newContent: any) => {
        if (!activeSectionId) return;
        setSections(sections.map(s =>
            s.id === activeSectionId ? { ...s, content: newContent } : s
        ));
    };

    const moveSection = (index: number, direction: 1 | -1) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= sections.length) return;
        const newSections = [...sections];
        const temp = newSections[index];
        newSections[index] = newSections[newIndex];
        newSections[index].display_order = index; // Update display order
        newSections[newIndex] = temp;
        newSections[newIndex].display_order = newIndex;
        setSections(newSections);
    };

    const toggleVisibility = (id: string) => {
        setSections(sections.map(s =>
            s.id === id ? { ...s, is_visible: !s.is_visible } : s
        ));
    };

    const [isPending, startTransition] = useTransition();

    const handleWorkflowAction = (actionType: 'submit' | 'publish' | 'reject' | 'unpublish') => {
        startTransition(async () => {
            try {
                if (actionType === 'submit') {
                    await submitForReview(page.id);
                    setPage({ ...page, status: 'review' });
                } else if (actionType === 'publish') {
                    await publishPage(page.id);
                    setPage({ ...page, status: 'published' });
                } else if (actionType === 'unpublish') {
                    await unpublishPage(page.id);
                    setPage({ ...page, status: 'unpublished' });
                } else if (actionType === 'reject') {
                    const reason = prompt("Enter a reason for rejection:");
                    if (reason === null) return;
                    await rejectPage(page.id, reason);
                    setPage({ ...page, status: 'draft' });
                }
            } catch (error) {
                console.error("Workflow action failed:", error);
                alert("Workflow action failed. Look at console.");
            }
        });
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update page metadata
            const { error: pageError } = await supabase
                .from('landing_pages')
                .update({
                    title: page.title,
                    slug: page.slug,
                    campaign_tag: page.campaign_tag,
                    course_name: page.course_name,
                    meta_title: page.meta_title,
                    meta_description: page.meta_description,
                    og_image_url: page.og_image_url,
                    ga4_measurement_id: page.ga4_measurement_id,
                    meta_pixel_id: page.meta_pixel_id,
                    utm_passthrough: page.utm_passthrough
                })
                .eq('id', page.id);

            if (pageError) throw pageError;

            // Batch update all sections to handle reordering, visibility, and content
            for (let i = 0; i < sections.length; i++) {
                const s = sections[i];
                const { error } = await supabase
                    .from('page_sections')
                    .update({
                        content: s.content,
                        display_order: i,
                        is_visible: s.is_visible
                    })
                    .eq('id', s.id);
                if (error) throw error;
            }
            setLastSaved(new Date());
        } catch (error) {
            console.error("Error saving sections:", error);
            alert("Failed to save changes.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
            {/* Editor Toolbar */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm shrink-0 rounded-t-lg">
                <div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-md">
                        {page.title}
                    </h1>
                    <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full border text-xs capitalize ${page.status === 'published' ? 'bg-green-100 text-green-800' :
                            page.scheduled_for ? 'bg-purple-100 text-purple-800 border-purple-200' :
                                'bg-slate-100 text-slate-800'
                            }`}>
                            {page.scheduled_for ? 'Scheduled' : page.status}
                        </span>
                        <span className="font-mono text-xs">/lp/{page.slug}</span>
                        {page.scheduled_for && (
                            <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 ml-2">
                                For: {new Date(page.scheduled_for).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-500 mr-4 flex items-center gap-1.5 hidden md:flex">
                        {isSaving ? (
                            <><CircleDashed className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : lastSaved ? (
                            <><CheckCircle2 className="h-4 w-4 text-green-600" /> Saved {lastSaved.toLocaleTimeString()}</>
                        ) : null}
                    </div>

                    <Button variant="outline" onClick={() => router.push(`/admin/pages/${page.id}/versions`)}>
                        <History className="mr-2 h-4 w-4" /> History
                    </Button>
                    <Button variant="outline" onClick={() => window.open(`/lp/${page.slug}?preview=true`, '_blank')} disabled={isPending || (page.status === 'published' && !lastSaved)}>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving || isPending}>
                        <Save className="mr-2 h-4 w-4" /> Save Changes
                    </Button>

                    {/* Workflow Buttons */}
                    <div className="h-8 w-px bg-slate-200 mx-1"></div>

                    {page.status === 'draft' && (
                        <>
                            <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50" onClick={() => {
                                const rawDate = prompt("Enter publish date/time (YYYY-MM-DD HH:MM):", new Date(Date.now() + 86400000).toISOString().slice(0, 16).replace('T', ' '));
                                if (!rawDate) return;
                                const scheduledDate = new Date(rawDate).toISOString();
                                startTransition(async () => {
                                    try {
                                        await schedulePage(page.id, scheduledDate);
                                        setPage({ ...page, scheduled_for: scheduledDate, status: 'review' });
                                        alert("Page successfully scheduled!");
                                    } catch (e) {
                                        alert("Failed to schedule page.");
                                    }
                                });
                            }} disabled={isPending || isSaving}>
                                <CalendarClock className="mr-2 h-4 w-4" /> Schedule
                            </Button>
                            <Button variant="secondary" onClick={() => handleWorkflowAction('submit')} disabled={isPending || isSaving}>
                                <Send className="mr-2 h-4 w-4" /> Submit for Review
                            </Button>
                        </>
                    )}

                    {page.status === 'review' && (
                        <>
                            <Button variant="destructive" onClick={() => handleWorkflowAction('reject')} disabled={isPending || isSaving}>
                                <XCircle className="mr-2 h-4 w-4" /> Reject
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleWorkflowAction('publish')} disabled={isPending || isSaving}>
                                <CheckSquare className="mr-2 h-4 w-4" /> Approve & Publish
                            </Button>
                        </>
                    )}

                    {page.status === 'published' && (
                        <Button variant="destructive" onClick={() => handleWorkflowAction('unpublish')} disabled={isPending || isSaving}>
                            <RotateCcw className="mr-2 h-4 w-4" /> Unpublish
                        </Button>
                    )}

                    {page.status === 'unpublished' && (
                        <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleWorkflowAction('publish')} disabled={isPending || isSaving}>
                            <CheckSquare className="mr-2 h-4 w-4" /> Republish
                        </Button>
                    )}
                </div>
            </div>

            {/* Split Pane Editor */}
            <div className="flex flex-1 overflow-hidden bg-slate-50 rounded-b-lg border border-t-0">
                <div className="w-64 lg:w-80 bg-white border-r overflow-y-auto shrink-0 flex flex-col">
                    <div className="p-4 border-b bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                        <h2 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Configuration</h2>
                    </div>
                    <div className="p-2 border-b">
                        <div
                            className={`w-full text-left rounded-md text-sm transition-all flex items-center px-3 py-3 cursor-pointer ${activeSectionId === 'settings'
                                ? 'bg-primary/5 border border-primary/20 shadow-sm text-primary font-medium'
                                : 'bg-white border border-transparent hover:bg-slate-50 text-slate-600'
                                }`}
                            onClick={() => setActiveSectionId('settings')}
                        >
                            <Settings className="h-4 w-4 mr-3 opacity-70" />
                            Page Settings
                        </div>
                    </div>
                    <div className="p-4 border-b bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                        <h2 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Page Sections</h2>
                    </div>
                    <div className="flex-1 p-2 space-y-1">
                        {sections.map((section, index) => (
                            <div key={section.id} className={`w-full text-left rounded-md text-sm transition-all flex flex-col group border ${activeSectionId === section.id
                                ? 'bg-primary/5 border-primary/20 shadow-sm'
                                : 'bg-white border-transparent hover:bg-slate-50'
                                }`}>
                                <div className="flex items-center px-3 py-3 gap-2">
                                    <div className="flex flex-col opacity-20 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }}
                                            disabled={index === 0}
                                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                        >
                                            <span className="text-[10px] leading-none mb-1 block">▲</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }}
                                            disabled={index === sections.length - 1}
                                            className="text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                        >
                                            <span className="text-[10px] leading-none block">▼</span>
                                        </button>
                                    </div>
                                    <button
                                        className="flex-1 text-left flex items-center truncate overflow-hidden"
                                        onClick={() => setActiveSectionId(section.id)}
                                    >
                                        <span className={`text-xs mr-2 font-mono ${activeSectionId === section.id ? 'text-primary/70' : 'text-slate-400'}`}>{index + 1}.</span>
                                        <span className={`truncate ${activeSectionId === section.id ? 'text-primary font-medium' : 'text-slate-600'} ${!section.is_visible ? 'line-through opacity-50' : ''}`}>
                                            {formatTypeLabel(section.type)}
                                        </span>
                                    </button>
                                    <button
                                        className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity"
                                        onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                                        title={section.is_visible ? "Hide section" : "Show section"}
                                    >
                                        <Eye className={`h-3 w-3 ${section.is_visible ? 'text-slate-600' : 'text-red-400'}`} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Section Editor Form */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                    {activeSectionId === 'settings' ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Page Settings
                                    </h2>
                                    <p className="text-muted-foreground mt-1">Configure SEO metadata and tracking for this specific page.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border shadow-sm space-y-6">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2">Basic Info</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Page Title (Internal)</label>
                                            <input type="text" value={page.title || ''} onChange={(e) => setPage({ ...page, title: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">URL Slug</label>
                                            <input type="text" value={page.slug || ''} onChange={(e) => setPage({ ...page, slug: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Course Name</label>
                                            <input type="text" value={page.course_name || ''} onChange={(e) => setPage({ ...page, course_name: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Tag</label>
                                            <input type="text" value={page.campaign_tag || ''} onChange={(e) => setPage({ ...page, campaign_tag: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 mt-8">SEO Metadata</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                                        <input type="text" value={page.meta_title || ''} onChange={(e) => setPage({ ...page, meta_title: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                                        <textarea value={page.meta_description || ''} onChange={(e) => setPage({ ...page, meta_description: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm h-24" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">OG Image URL</label>
                                        <input type="text" value={page.og_image_url || ''} onChange={(e) => setPage({ ...page, og_image_url: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="https://example.com/image.jpg" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold border-b pb-2 mt-8">Analytics Overrides</h3>
                                    <p className="text-xs text-slate-500">Leave blank to use the global site defaults.</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">GA4 Measurement ID</label>
                                            <input type="text" value={page.ga4_measurement_id || ''} onChange={(e) => setPage({ ...page, ga4_measurement_id: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="G-XXXXXXXXXX" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Meta Pixel ID</label>
                                            <input type="text" value={page.meta_pixel_id || ''} onChange={(e) => setPage({ ...page, meta_pixel_id: e.target.value })} className="w-full px-3 py-2 border rounded-md text-sm" placeholder="123456789" />
                                        </div>
                                    </div>
                                    <div className="flex items-center mt-4">
                                        <input
                                            type="checkbox"
                                            id="utmPassthrough"
                                            checked={page.utm_passthrough}
                                            onChange={(e) => setPage({ ...page, utm_passthrough: e.target.checked })}
                                            className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded"
                                        />
                                        <label htmlFor="utmPassthrough" className="ml-2 block text-sm text-slate-900">
                                            Enable UTM Passthrough (Append UTMs to outgoing links)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeSection ? (
                        <div className="max-w-3xl mx-auto">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        {formatTypeLabel(activeSection.type)} Configuration
                                    </h2>
                                    <p className="text-muted-foreground mt-1">Configure the content and settings for this section.</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                {(() => {
                                    const FormComponent = SectionFormRegistry[activeSection.type];
                                    if (FormComponent) {
                                        return (
                                            <FormComponent
                                                data={activeSection.content}
                                                onChange={handleContentUpdate}
                                            />
                                        );
                                    }
                                    return (
                                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-800">
                                            Editor for {formatTypeLabel(activeSection.type)} is not yet implemented.
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <LayoutTemplate className="h-12 w-12 mb-4 opacity-20" />
                            <p>Select a section from the left panel to begin editing.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
