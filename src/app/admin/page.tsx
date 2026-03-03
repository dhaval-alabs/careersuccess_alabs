import { Metadata } from "next"
import { createClient } from '@/utils/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { FileText, Inbox, Users } from 'lucide-react'

export const metadata: Metadata = {
    title: "Dashboard - CMS",
    description: "Overview of your application",
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const supabase = await createClient()

    // Fetch counts via head requests for better performance
    const [{ count: pagesCount }, { count: leadsCount }, { count: usersCount }] = await Promise.all([
        supabase.from('landing_pages').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('*', { count: 'exact', head: true })
    ])

    const stats = [
        {
            title: "Total Pages",
            value: pagesCount || 0,
            icon: FileText,
            color: "text-blue-600",
            bg: "bg-blue-100"
        },
        {
            title: "Total Leads",
            value: leadsCount || 0,
            icon: Inbox,
            color: "text-emerald-600",
            bg: "bg-emerald-100"
        },
        {
            title: "Total Users",
            value: usersCount || 0,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-100"
        }
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Welcome back. Here is an overview of your platform.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="border shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-semibold text-slate-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm w-full h-[300px] flex items-center justify-center border-dashed">
                <p className="text-muted-foreground text-sm flex flex-col items-center gap-2">
                    <span className="font-semibold text-slate-700">Detailed Journey Tracking</span>
                    <span>View HubSpot or Google Analytics for advanced journey paths.</span>
                </p>
            </div>
        </div>
    )
}
