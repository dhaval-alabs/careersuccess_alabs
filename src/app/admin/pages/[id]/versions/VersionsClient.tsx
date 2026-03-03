'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { formatTypeLabel } from '@/lib/utils';
import { History, ArrowLeft, RotateCcw } from 'lucide-react';
import { restoreVersion } from '@/app/actions/workflow';

export default function VersionsClient({ page, versions }: { page: any, versions: any[] }) {
    const router = useRouter();
    const [selectedVersionId, setSelectedVersionId] = useState<string | null>(versions.length > 0 ? versions[0].id : null);
    const [isPending, startTransition] = useTransition();

    const selectedVersion = versions.find(v => v.id === selectedVersionId);

    const handleRestore = () => {
        if (!selectedVersion) return;
        const confirmRestore = confirm(`Are you sure you want to restore to Version ${selectedVersion.version_number}? This will overwrite current draft changes.`);
        if (!confirmRestore) return;

        startTransition(async () => {
            try {
                await restoreVersion(page.id, selectedVersion.id);
                alert("Version restored successfully from snapshot.");
                router.push(`/pages/${page.id}/edit`);
            } catch (error) {
                console.error(error);
                alert("Failed to restore version.");
            }
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-theme(spacing.24))]">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm shrink-0 rounded-t-lg">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/pages/${page.id}/edit`)}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
                    </Button>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900 truncate max-w-md">
                            Version History: {page.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden bg-slate-50 rounded-b-lg border border-t-0">
                {/* Left: Version List */}
                <div className="w-80 bg-white border-r overflow-y-auto shrink-0 flex flex-col">
                    <div className="p-4 border-b bg-slate-50/50 sticky top-0 z-10 backdrop-blur-sm">
                        <h2 className="font-semibold text-sm text-slate-700 uppercase tracking-wider">Previous Versions</h2>
                    </div>
                    <div className="flex-1 p-2 space-y-1">
                        {versions.length === 0 ? (
                            <div className="p-4 text-sm text-slate-500 text-center">No published versions yet.</div>
                        ) : (
                            versions.map((version) => (
                                <button
                                    key={version.id}
                                    onClick={() => setSelectedVersionId(version.id)}
                                    className={`w-full text-left px-4 py-3 rounded-md text-sm transition-all border ${selectedVersionId === version.id
                                        ? 'bg-primary/10 border-primary/20 text-primary shadow-sm'
                                        : 'bg-white border-transparent text-slate-600 hover:bg-slate-100'
                                        }`}
                                >
                                    <div className="font-medium flex justify-between items-center">
                                        <span>v{version.version_number}</span>
                                        <span className="text-xs text-slate-400 font-normal">
                                            {new Date(version.published_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1 truncate">
                                        By {version.published_by?.email || 'Unknown User'}
                                    </div>
                                    <div className="text-xs font-medium text-slate-600 mt-1 line-clamp-1">
                                        {version.change_summary}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Version Details */}
                <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
                    {selectedVersion ? (
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="flex items-center justify-between bg-white p-6 rounded-xl border shadow-sm">
                                <div>
                                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                                        Version {selectedVersion.version_number}
                                    </h2>
                                    <p className="text-muted-foreground mt-1">
                                        Published on {new Date(selectedVersion.published_at).toLocaleString()} by {selectedVersion.published_by?.email}
                                    </p>
                                </div>
                                <Button onClick={handleRestore} disabled={isPending} className="bg-amber-600 hover:bg-amber-700">
                                    <RotateCcw className="mr-2 h-4 w-4" /> Restore this version
                                </Button>
                            </div>

                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Page Metadata Snapshot</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div><span className="text-slate-500">Title:</span> {selectedVersion.snapshot.page?.title}</div>
                                    <div><span className="text-slate-500">Slug:</span> /{selectedVersion.snapshot.page?.slug}</div>
                                    <div><span className="text-slate-500">Campaign Tag:</span> {selectedVersion.snapshot.page?.campaign_tag || 'None'}</div>
                                    <div><span className="text-slate-500">Course Name:</span> {selectedVersion.snapshot.page?.course_name || 'None'}</div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl border shadow-sm">
                                <h3 className="font-semibold text-lg mb-4">Sections Snapshot ({selectedVersion.snapshot.sections?.length || 0})</h3>
                                <div className="space-y-2">
                                    {(selectedVersion.snapshot.sections || []).map((section: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border">
                                            <div className="font-medium text-sm">
                                                {idx + 1}. {formatTypeLabel(section.type)}
                                            </div>
                                            <div className="text-xs text-slate-500 font-mono">
                                                ID: {section.id.split('-')[0]}...
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <History className="h-12 w-12 mb-4 opacity-20" />
                            <p>Select a version from the left panel to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
