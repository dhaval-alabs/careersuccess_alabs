'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatTypeLabel } from '@/lib/utils';
import { History, ArrowLeft, RotateCcw, GitCompare, XCircle, Eye } from 'lucide-react';
import { restoreVersion } from '@/app/actions/workflow';
import { createClient } from '@/utils/supabase/client';
import { DiffViewer } from '@/components/admin/DiffViewer';

export default function VersionsClient({ page, versions }: { page: any, versions: any[] }) {
    const router = useRouter();
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(versions.length > 0 ? versions[0].id : null);
    const [isPending, startTransition] = useTransition();
    const [compareMode, setCompareMode] = useState(false);
    const [currentSections, setCurrentSections] = useState<any[]>([]);
    const [isLoadingSections, setIsLoadingSections] = useState(true);

    // Fetch current sections once so we have something to diff against
    useEffect(() => {
        const fetchSections = async () => {
            setIsLoadingSections(true);
            const supabase = createClient();
            const { data } = await supabase.from('page_sections').select('*').eq('page_id', page.id).order('display_order');
            if (data) setCurrentSections(data);
            setIsLoadingSections(false);
        };
        fetchSections();
    }, [page.id]);

    const selectedVersion = versions.find(v => v.id === selectedVersionId);

    const handleRestore = () => {
        if (!selectedVersion) return;
        const confirmRestore = confirm(`Are you sure you want to restore to Version ${selectedVersion.version_number}? This will overwrite current draft changes.`);
        if (!confirmRestore) return;

        startTransition(async () => {
            try {
                await restoreVersion(page.id, selectedVersion.id);
                alert("Version restored successfully from snapshot.");
                router.push(`/admin/pages/${page.id}/edit`);
            } catch (error) {
                console.error(error);
                alert("Failed to restore version.");
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))] admin-premium-bg overflow-hidden">
            {/* Toolbar */}
            <div className="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm shrink-0 z-30">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl h-10 px-4 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all border border-transparent hover:border-slate-200"
                        onClick={() => router.push(`/admin/pages/${page.id}/edit`)}
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
                    </Button>
                    <div className="h-6 w-px bg-slate-200"></div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-md font-sora">
                            Version History
                        </h1>
                        <p className="text-xs text-slate-400 mt-0.5 font-medium">{page.title}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left: Version List */}
                <div className="w-80 bg-white border-r border-slate-200 overflow-y-auto shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
                    <div className="p-6">
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Previous Versions</h2>
                        <div className="space-y-3">
                            {versions.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                        <History className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <p className="text-sm text-slate-400">No published versions yet.</p>
                                </div>
                            ) : (
                                versions.map((version) => (
                                    <button
                                        key={version.id}
                                        onClick={() => setSelectedVersionId(version.id)}
                                        className={`group w-full text-left p-4 rounded-2xl transition-all duration-200 relative border ${selectedVersionId === version.id
                                            ? 'bg-white shadow-md border-slate-100 ring-1 ring-slate-100'
                                            : 'bg-white border-transparent hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="font-bold text-sm flex justify-between items-center mb-1">
                                            <span className={selectedVersionId === version.id ? 'text-indigo-600' : 'text-slate-900'}>
                                                v{version.version_number}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                                {new Date(version.published_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-medium text-slate-500 mb-2 flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                            {version.published_by?.email || 'Unknown User'}
                                        </div>
                                        <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
                                            "{version.change_summary || 'No summary provided'}"
                                        </div>
                                        {selectedVersionId === version.id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full"></div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Version Details */}
                <div className="flex-1 overflow-y-auto p-8 lg:p-12 relative scroll-smooth">
                    {selectedVersion ? (
                        <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="premium-card p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center">
                                            <History className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <h2 className="text-3xl font-bold tracking-tight text-slate-900 font-sora">
                                            Version {selectedVersion.version_number}
                                        </h2>
                                    </div>
                                    <p className="text-slate-500 text-lg flex items-center gap-2">
                                        Published on <span className="font-medium text-slate-700">{new Date(selectedVersion.published_at).toLocaleString()}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        onClick={() => setCompareMode(!compareMode)}
                                        className={`rounded-xl h-12 px-6 font-medium transition-all ${compareMode ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                                    >
                                        <GitCompare className="mr-3 h-5 w-5" />
                                        {compareMode ? "Diffing Active" : "Compare"}
                                    </Button>
                                    <Button
                                        onClick={handleRestore}
                                        disabled={isPending}
                                        className="rounded-xl h-12 px-8 font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-200 transition-all active:scale-95"
                                    >
                                        <RotateCcw className="mr-3 h-5 w-5" /> Restore
                                    </Button>
                                </div>
                            </div>

                            <div className="premium-card p-8 sm:p-10">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                    Page Metadata Snapshot
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm">
                                    {compareMode ? (
                                        <>
                                            <div className="col-span-full">
                                                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Internal Title</div>
                                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                    <DiffViewer oldString={selectedVersion.snapshot.page?.title} newString={page.title} type="words" />
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">URL Slug</div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
                                                        <DiffViewer oldString={selectedVersion.snapshot.page?.slug} newString={page.slug} type="words" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Meta Title</div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <DiffViewer oldString={selectedVersion.snapshot.page?.meta_title} newString={page.meta_title} type="words" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-8">
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Campaign Tag</div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <DiffViewer oldString={selectedVersion.snapshot.page?.campaign_tag} newString={page.campaign_tag} type="words" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Course Name</div>
                                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                                        <DiffViewer oldString={selectedVersion.snapshot.page?.course_name} newString={page.course_name} type="words" />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 ml-1 group-hover:text-indigo-500 transition-colors">Title</span>
                                                    <p className="text-slate-800 font-medium px-1 leading-relaxed">{selectedVersion.snapshot.page?.title}</p>
                                                </div>
                                                <div className="group">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 ml-1 group-hover:text-indigo-500 transition-colors">URL Slug</span>
                                                    <p className="text-slate-800 font-mono text-xs bg-slate-50 px-3 py-2 rounded-lg inline-block">/lp/{selectedVersion.snapshot.page?.slug}</p>
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="group">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 ml-1 group-hover:text-indigo-500 transition-colors">Campaign Tag</span>
                                                    <p className="text-slate-800 font-medium px-1 leading-relaxed">{selectedVersion.snapshot.page?.campaign_tag || '—'}</p>
                                                </div>
                                                <div className="group">
                                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1 ml-1 group-hover:text-indigo-500 transition-colors">Course Name</span>
                                                    <p className="text-slate-800 font-medium px-1 leading-relaxed">{selectedVersion.snapshot.page?.course_name || '—'}</p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="premium-card p-8 sm:p-10 pb-16">
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-3 mb-8">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                    Sections Snapshot ({selectedVersion.snapshot.sections?.length || 0})
                                </h3>
                                <div className="grid gap-6">
                                    {(selectedVersion.snapshot.sections || []).map((section: any, idx: number) => {
                                        const matchingCurrent = compareMode
                                            ? currentSections.find(s => s.id === section.id) || currentSections[idx]
                                            : null;

                                        return (
                                            <div key={idx} className={`group rounded-2xl border transition-all duration-300 ${compareMode && matchingCurrent ? 'bg-indigo-50/20 border-indigo-100 p-8' : 'bg-slate-50/30 border-slate-100 p-8 hover:bg-white hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/50'}`}>
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-lg bg-white shadow-sm border border-slate-100 flex items-center justify-center font-bold text-xs text-indigo-600">
                                                            {(idx + 1).toString().padStart(2, '0')}
                                                        </div>
                                                        <h4 className="font-bold text-slate-900 font-sora">
                                                            {formatTypeLabel(section.type)}
                                                        </h4>
                                                    </div>
                                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-white px-3 py-1.5 rounded-full border border-slate-100">
                                                        ID: {section.id.split('-')[0]}
                                                    </div>
                                                </div>

                                                {compareMode && matchingCurrent ? (
                                                    <div className="animate-in fade-in zoom-in-95 duration-500">
                                                        <div className="text-[11px] font-bold text-indigo-500/60 uppercase tracking-wider mb-3 ml-1">Content Evolution</div>
                                                        <div className="rounded-2xl overflow-hidden border border-indigo-100/50 shadow-inner bg-white">
                                                            <DiffViewer
                                                                oldString={JSON.stringify(section.content, null, 2)}
                                                                newString={JSON.stringify(matchingCurrent.content, null, 2)}
                                                                type="json"
                                                                className="max-h-[400px] overflow-y-auto"
                                                            />
                                                        </div>
                                                    </div>
                                                ) : compareMode && !matchingCurrent ? (
                                                    <div className="mt-2 p-6 bg-rose-50/50 text-rose-600 rounded-2xl border border-rose-100 flex items-center gap-4">
                                                        <XCircle className="h-6 w-6 text-rose-400" />
                                                        <div>
                                                            <p className="font-bold text-sm">Component Removed</p>
                                                            <p className="text-xs opacity-70">This section no longer exists in the current draft.</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                                                        <div className="space-y-4">
                                                            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Data Structure</div>
                                                            <pre className="text-[11px] bg-white p-6 rounded-2xl border border-slate-200 overflow-x-auto text-slate-600 max-h-[300px]">
                                                                {JSON.stringify(section.content, null, 2)}
                                                            </pre>
                                                        </div>
                                                        <div className="bg-slate-100/50 rounded-2xl border border-slate-200 border-dashed flex flex-col items-center justify-center p-10 text-center">
                                                            <Eye className="h-8 w-8 text-slate-300 mb-4" />
                                                            <p className="text-xs text-slate-400 font-medium">Snapshot previews are not interactive.</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300 animate-in fade-in duration-700">
                            <div className="h-24 w-24 bg-white rounded-3xl shadow-xl shadow-slate-200/50 flex items-center justify-center mb-8 border border-slate-50">
                                <History className="h-10 w-10 text-indigo-200" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 font-sora">Explore History</h3>
                            <p className="text-slate-400">Select a snapshot from the sidebar to view full page state and diffs.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
