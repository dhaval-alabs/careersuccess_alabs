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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] admin-premium-bg overflow-hidden">
            {/* Editor Toolbar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <LayoutTemplate className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-md font-sora">
                            {page.title}
                        </h1>
                        <div className="text-sm text-slate-500 flex items-center gap-3 mt-0.5">
                            <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${page.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    page.scheduled_for ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        'bg-slate-50 text-slate-600 border-slate-200'
                                }`}>
                                {page.scheduled_for ? 'Scheduled' : page.status}
                            </span>
                            <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">/lp/{page.slug}</span>
                            {page.scheduled_for && (
                                <span className="text-[11px] text-purple-600 font-medium">
                                    <CalendarClock className="h-3 w-3 inline mr-1 -mt-0.5" />
                                    {new Date(page.scheduled_for).toLocaleString()}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="text-sm text-slate-400 mr-4 flex items-center gap-2 hidden lg:flex">
                        {isSaving ? (
                            <><CircleDashed className="h-4 w-4 animate-spin text-indigo-500" /> Saving...</>
                        ) : lastSaved ? (
                            <><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Saved {lastSaved.toLocaleTimeString()}</>
                        ) : null}
                    </div>

                    <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
                        <Button variant="ghost" size="sm" className="rounded-lg h-9 text-slate-600 hover:bg-white hover:shadow-sm" onClick={() => router.push(`/admin/pages/${page.id}/versions`)}>
                            <History className="mr-2 h-4 w-4" /> History
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg h-9 text-slate-600 hover:bg-white hover:shadow-sm" onClick={() => window.open(`/lp/${page.slug}?preview=true`, '_blank')} disabled={isPending || (page.status === 'published' && !lastSaved)}>
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button size="sm" className="rounded-lg h-9 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm" onClick={handleSave} disabled={isSaving || isPending}>
                            <Save className="mr-2 h-4 w-4" /> Save
                        </Button>
                    </div>

                    {/* Workflow Buttons */}
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>

                    <div className="flex items-center gap-2">
                        {page.status === 'draft' && (
                            <>
                                <Button variant="outline" size="sm" className="rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50 h-9" onClick={() => {
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
                                <Button variant="outline" size="sm" className="rounded-lg border-indigo-200 text-indigo-700 hover:bg-indigo-50 h-9" onClick={() => handleWorkflowAction('submit')} disabled={isPending || isSaving}>
                                    <Send className="mr-2 h-4 w-4" /> Submit
                                </Button>
                            </>
                        )}

                        {page.status === 'review' && (
                            <>
                                <Button variant="ghost" size="sm" className="rounded-lg text-rose-600 hover:bg-rose-50 h-9" onClick={() => handleWorkflowAction('reject')} disabled={isPending || isSaving}>
                                    <XCircle className="mr-2 h-4 w-4" /> Reject
                                </Button>
                                <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-9" onClick={() => handleWorkflowAction('publish')} disabled={isPending || isSaving}>
                                    <CheckSquare className="mr-2 h-4 w-4" /> Approve
                                </Button>
                            </>
                        )}

                        {page.status === 'published' && (
                            <Button variant="ghost" size="sm" className="rounded-lg text-rose-600 hover:bg-rose-50 h-9" onClick={() => handleWorkflowAction('unpublish')} disabled={isPending || isSaving}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Unpublish
                            </Button>
                        )}

                        {page.status === 'unpublished' && (
                            <Button size="sm" className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-9" onClick={() => handleWorkflowAction('publish')} disabled={isPending || isSaving}>
                                <CheckSquare className="mr-2 h-4 w-4" /> Republish
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Split Pane Editor */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-72 lg:w-85 bg-white border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
                    <div className="p-6">
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Configuration</h2>
                        <div
                            className={`group flex items-center px-4 py-3.5 rounded-2xl cursor-pointer transition-all duration-200 ${activeSectionId === 'settings'
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                            onClick={() => setActiveSectionId('settings')}
                        >
                            <Settings className={`h-5 w-5 mr-3 transition-colors ${activeSectionId === 'settings' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            <span className="font-medium text-sm">Page Settings</span>
                        </div>
                    </div>

                    <div className="px-6 py-2">
                        <div className="h-px bg-slate-100 mb-6"></div>
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Page Sections</h2>
                    </div>

                    <div className="flex-1 px-4 pb-8 space-y-2">
                        {sections.map((section, index) => (
                            <div key={section.id} className={`group relative rounded-2xl transition-all duration-200 overflow-hidden ${activeSectionId === section.id
                                ? 'bg-white shadow-md ring-1 ring-slate-100'
                                : 'hover:bg-slate-50'
                                }`}>
                                <div className="flex items-center px-4 py-4 gap-3">
                                    <div className="flex flex-col opacity-0 group-hover:opacity-40 hover:!opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveSection(index, -1); }}
                                            disabled={index === 0}
                                            className="text-slate-900 disabled:opacity-20 translate-y-0.5"
                                        >
                                            <span className="text-[10px] leading-none block">▲</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); moveSection(index, 1); }}
                                            disabled={index === sections.length - 1}
                                            className="text-slate-900 disabled:opacity-20 -translate-y-0.5"
                                        >
                                            <span className="text-[10px] leading-none block">▼</span>
                                        </button>
                                    </div>

                                    <button
                                        className="flex-1 text-left flex items-center truncate overflow-hidden"
                                        onClick={() => setActiveSectionId(section.id)}
                                    >
                                        <span className={`text-[11px] mr-3 font-mono font-bold ${activeSectionId === section.id ? 'text-indigo-600/50' : 'text-slate-300'}`}>
                                            {(index + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className={`truncate text-sm font-medium ${activeSectionId === section.id ? 'text-slate-900' : 'text-slate-600'} ${!section.is_visible ? 'line-through opacity-40' : ''}`}>
                                            {formatTypeLabel(section.type)}
                                        </span>
                                    </button>

                                    <button
                                        className={`shrink-0 p-2 rounded-lg transition-colors ${section.is_visible ? 'text-slate-300 hover:text-slate-600 hover:bg-slate-100' : 'text-rose-400 hover:text-rose-600 hover:bg-rose-50'}`}
                                        onClick={(e) => { e.stopPropagation(); toggleVisibility(section.id); }}
                                        title={section.is_visible ? "Hide section" : "Show section"}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </button>
                                </div>
                                {activeSectionId === section.id && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Section Editor Form */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth">
                    {activeSectionId === 'settings' ? (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sora">
                                    Page Settings
                                </h2>
                                <p className="text-slate-500 mt-2 text-lg">Configure SEO metadata and tracking for this specific page.</p>
                            </div>

                            <div className="space-y-8 pb-20">
                                <div className="premium-card p-8 sm:p-10 space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <LayoutTemplate className="h-5 w-5 text-indigo-500" />
                                            Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">Page Title (Internal)</label>
                                                <input type="text" value={page.title || ''} onChange={(e) => setPage({ ...page, title: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">URL Slug</label>
                                                <input type="text" value={page.slug || ''} onChange={(e) => setPage({ ...page, slug: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">Course Name</label>
                                                <input type="text" value={page.course_name || ''} onChange={(e) => setPage({ ...page, course_name: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">Campaign Tag</label>
                                                <input type="text" value={page.campaign_tag || ''} onChange={(e) => setPage({ ...page, campaign_tag: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="premium-card p-8 sm:p-10 space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Eye className="h-5 w-5 text-indigo-500" />
                                            SEO Metadata
                                        </h3>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Meta Title</label>
                                            <input type="text" value={page.meta_title || ''} onChange={(e) => setPage({ ...page, meta_title: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">Meta Description</label>
                                            <textarea value={page.meta_description || ''} onChange={(e) => setPage({ ...page, meta_description: e.target.value })} className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm h-32 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none resize-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700 ml-1">OG Image URL</label>
                                            <input type="text" value={page.og_image_url || ''} onChange={(e) => setPage({ ...page, og_image_url: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" placeholder="https://example.com/image.jpg" />
                                        </div>
                                    </div>
                                </div>

                                <div className="premium-card p-8 sm:p-10 space-y-8">
                                    <div className="space-y-6">
                                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                            <Send className="h-5 w-5 text-indigo-500" />
                                            Analytics & Tracking
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">GA4 Measurement ID</label>
                                                <input type="text" value={page.ga4_measurement_id || ''} onChange={(e) => setPage({ ...page, ga4_measurement_id: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" placeholder="G-XXXXXXXXXX" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700 ml-1">Meta Pixel ID</label>
                                                <input type="text" value={page.meta_pixel_id || ''} onChange={(e) => setPage({ ...page, meta_pixel_id: e.target.value })} className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none" placeholder="123456789" />
                                            </div>
                                        </div>
                                        <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 mt-4 transition-all hover:bg-white hover:border-indigo-100 hover:shadow-sm cursor-pointer group" onClick={() => setPage({ ...page, utm_passthrough: !page.utm_passthrough })}>
                                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all mr-3 ${page.utm_passthrough ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`}>
                                                {page.utm_passthrough && <CheckSquare className="h-3.5 w-3.5 text-white" />}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700">
                                                Enable UTM Passthrough (Append UTMs to outgoing links)
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeSection ? (
                        <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="mb-10">
                                <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sora">
                                    {formatTypeLabel(activeSection.type)}
                                </h2>
                                <p className="text-slate-500 mt-2 text-lg">Configure the content and layout for this page section.</p>
                            </div>
                            <div className="premium-card p-1 pb-10">
                                {(() => {
                                    const FormComponent = SectionFormRegistry[activeSection.type];
                                    if (FormComponent) {
                                        return (
                                            <div className="p-8 sm:p-10">
                                                <FormComponent
                                                    data={activeSection.content}
                                                    onChange={handleContentUpdate}
                                                />
                                            </div>
                                        );
                                    }
                                    return (
                                        <div className="p-10 text-center">
                                            <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <XCircle className="h-10 w-10 text-amber-500 opacity-50" />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-900 mb-2">Editor Implementation Pending</h3>
                                            <p className="text-slate-500 max-w-sm mx-auto">
                                                The visual editor for <strong>{formatTypeLabel(activeSection.type)}</strong> is currently being developed.
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 animate-in fade-in duration-700">
                            <div className="h-24 w-24 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 border border-slate-50">
                                <LayoutTemplate className="h-10 w-10 text-indigo-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sora">Ready to Edit</h3>
                            <p className="text-slate-400">Select a section from the left panel to begin configuring your page.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
