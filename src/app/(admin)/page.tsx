import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import { Plus, Search, MoreHorizontal, Edit, LayoutTemplate, Trash2, Eye } from 'lucide-react';
import { formatDate } from '@/lib/utils'; // We'll create this utility

export default async function PageList() {
    const supabase = await createClient();

    // Check auth to ensure they should be here
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        redirect('/login');
    }

    // Fetch pages
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
                return 'bg-green-100 text-green-800 border-green-200';
            case 'review':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'draft':
                return 'bg-slate-100 text-slate-800 border-slate-200';
            case 'unpublished':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Landing Pages</h1>
                    <p className="text-muted-foreground mt-1">Manage all public-facing course landing pages.</p>
                </div>
                <Link
                    href="/admin/pages/new"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    New Page
                </Link>
            </div>

            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4 border-b flex items-center justify-between gap-4 flex-wrap">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="search"
                            placeholder="Search pages by title or slug..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium">Page Title / Slug</th>
                                <th scope="col" className="px-6 py-4 font-medium">Status</th>
                                <th scope="col" className="px-6 py-4 font-medium">Author</th>
                                <th scope="col" className="px-6 py-4 font-medium">Last Modified</th>
                                <th scope="col" className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {pages && pages.length > 0 ? (
                                pages.map((page) => (
                                    <tr key={page.id} className="bg-white hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{page.title}</div>
                                            <div className="text-slate-500 text-xs mt-1 font-mono flex items-center gap-1">
                                                /lp/{page.slug}
                                                <a href={`/lp/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1" title="View Public Page">
                                                    <ExternalLinkIcon className="h-3 w-3 inline" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusStyles(page.status)}`}>
                                                {page.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {page.author?.name || page.author?.email || 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                                            {new Date(page.updated_at).toLocaleDateString()}
                                            <div className="text-xs mt-0.5">{new Date(page.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {page.status === 'published' && (
                                                    <Link href={`/lp/${page.slug}`} target="_blank" className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-md transition-colors" title="View Live">
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                )}
                                                <Link href={`/admin/pages/${page.id}/edit`} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-md transition-colors" title="Edit Content">
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <Link href={`/admin/pages/${page.id}/settings`} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-100 rounded-md transition-colors" title="Page Settings">
                                                    <LayoutTemplate className="h-4 w-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No landing pages found. Click "New Page" to create one.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function ExternalLinkIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" x2="21" y1="14" y2="3" />
        </svg>
    )
}
