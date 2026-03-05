import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import {
    Plus,
    Search,
    Edit,
    LayoutTemplate,
    Eye,
    ExternalLink,
    Calendar,
    User,
    History,
    Settings,
    MoreVertical,
    ChevronRight,
    ArrowUpRight,
    Globe
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function PageList() {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    const { data: pages, error } = await supabase
        .from('landing_pages')
        .select('*, author:created_by(name, email)')
        .order('updated_at', { ascending: false });

    if (error) {
        console.error("Error fetching pages:", error);
    }

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'published':
                return 'bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-100/50';
            case 'review':
                return 'bg-amber-50 text-amber-600 border-amber-100 ring-amber-100/50';
            case 'draft':
                return 'bg-slate-50 text-slate-500 border-slate-100 ring-slate-100/50';
            case 'unpublished':
                return 'bg-rose-50 text-rose-600 border-rose-100 ring-rose-100/50';
            default:
                return 'bg-slate-50 text-slate-500 border-slate-100 ring-slate-100/50';
        }
    };

    return (
        <div className="space-y-10 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-6 w-1 bg-indigo-600 rounded-full"></div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Marketing Engine</span>
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 font-sora tracking-tight">Landing Pages</h1>
                    <p className="text-slate-500 mt-2 text-lg font-medium">Design and manage your high-converting course funnels.</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="group inline-flex items-center justify-center gap-3 bg-slate-900 text-white hover:bg-indigo-600 px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-200 active:scale-95"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    <span>Create New Page</span>
                </Link>
            </div>

            {/* Main Content Card */}
            <div className="premium-card overflow-hidden border-none shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-slate-100">
                {/* Filters/Search Bar */}
                <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
                    <div className="relative group max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="search"
                            placeholder="Filter by title, slug or campaign..."
                            className="w-full pl-12 pr-6 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 transition-all placeholder:text-slate-400"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button variant="outline" className="rounded-xl h-12 px-5 font-bold text-slate-600 border-slate-200 bg-white">
                            Status: All
                        </Button>
                        <Button variant="outline" className="rounded-xl h-12 px-5 font-bold text-slate-600 border-slate-200 bg-white">
                            Sort: Newest First
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/30">
                                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Page Identity</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Status</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Last Modified</th>
                                <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Experience</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pages && pages.length > 0 ? (
                                pages.map((page) => (
                                    <tr key={page.id} className="group hover:bg-slate-50/30 transition-all duration-300">
                                        <td className="px-8 py-7">
                                            <div>
                                                <div className="font-bold text-slate-900 font-sora text-lg flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                                                    {page.title}
                                                    {page.status === 'published' && <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />}
                                                </div>
                                                <div className="flex items-center gap-3 mt-2.5">
                                                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg border border-slate-200/50 font-mono text-[10px] font-bold">
                                                        <Globe size={10} className="text-slate-400" />
                                                        /lp/{page.slug}
                                                    </div>
                                                    {page.campaign_tag && (
                                                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider px-2 py-0.5 bg-indigo-50 rounded-md border border-indigo-100">
                                                            {page.campaign_tag}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7">
                                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 text-[10px] font-bold rounded-full border ring-4 ring-transparent uppercase tracking-wider transition-all ${getStatusStyles(page.status)}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${page.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`}></div>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-7">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-[12px] font-bold text-slate-600 shadow-sm border border-white">
                                                    {(page.author?.name || page.author?.email || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-slate-700">
                                                        {page.author?.name || 'Admin'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                                                        <Calendar size={10} />
                                                        {formatRelativeTime(page.updated_at)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-7 text-right">
                                            <div className="flex justify-end gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/pages/${page.id}/edit`}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50/30 rounded-xl transition-all font-bold text-xs shadow-sm active:scale-95"
                                                    title="Design Editor"
                                                >
                                                    <Edit size={14} />
                                                    Edit
                                                </Link>
                                                <Link
                                                    href={`/admin/pages/${page.id}/versions`}
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-amber-600 hover:border-amber-100 hover:bg-amber-50/30 rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="Version History"
                                                >
                                                    <History size={16} />
                                                </Link>
                                                <a
                                                    href={`/lp/${page.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2.5 bg-white border border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50/30 rounded-xl transition-all shadow-sm active:scale-95"
                                                    title="View Live Page"
                                                >
                                                    <Eye size={16} />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-8 py-24 text-center bg-slate-50/10">
                                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mb-6 border border-slate-50">
                                            <LayoutTemplate size={32} className="text-slate-200" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 font-sora">No Funnels Yet</h3>
                                        <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8 font-medium leading-relaxed">Your landing pages will appear here. Start by creating a course funnel to capture high-quality leads.</p>
                                        <Link
                                            href="/admin/pages/new"
                                            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                                        >
                                            <Plus size={18} />
                                            Create First Page
                                        </Link>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                <div className="p-8 bg-slate-50/30 border-t border-slate-50 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {pages?.length || 0} pages</p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled className="rounded-lg h-9 w-9 p-0 border-slate-200"><ChevronRight className="rotate-180 h-4 w-4" /></Button>
                        <Button variant="outline" size="sm" disabled className="rounded-lg h-9 w-9 p-0 border-slate-200"><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Button({ children, variant = "default", size = "default", className, ...props }: any) {
    const variants: any = {
        default: "bg-slate-900 text-white hover:bg-slate-800",
        outline: "bg-transparent border border-slate-200 hover:bg-slate-50 text-slate-700",
        ghost: "bg-transparent hover:bg-slate-100 text-slate-600"
    };
    const sizes: any = {
        default: "px-4 py-2",
        sm: "px-2 py-1 text-xs",
        lg: "px-6 py-3"
    };

    return (
        <button
            className={`inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

