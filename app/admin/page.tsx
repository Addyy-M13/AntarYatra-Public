import { Card } from "@/components/ui/card"
import { Users, BookOpen, Heart, Activity } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [
    { count: totalUsers },
    { count: journalEntries },
    { count: moodLogs },
    { count: activeToday },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("journal_entries").select("*", { count: "exact", head: true }),
    supabase.from("mood_entries").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("updated_at", todayStart.toISOString()),
  ])

  const stats = {
    totalUsers: totalUsers ?? 0,
    journalEntries: journalEntries ?? 0,
    moodLogs: moodLogs ?? 0,
    activeToday: activeToday ?? 0,
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor AntarYatra platform statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Journal Entries</p>
                <p className="text-2xl font-bold">{stats.journalEntries.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/10 rounded-lg">
                <Heart className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mood Logs</p>
                <p className="text-2xl font-bold">{stats.moodLogs.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Today</p>
                <p className="text-2xl font-bold">{stats.activeToday.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Platform Statistics</h2>
          <p className="text-muted-foreground">
            Welcome to the AntarYatra admin dashboard. More detailed analytics and management features coming soon.
          </p>
        </Card>
      </div>
    </div>
  )
}
