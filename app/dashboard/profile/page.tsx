"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserCircle, Save, Camera, Flame, BookOpen, Heart, Star } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [form, setForm] = useState({ username: "", avatar_url: "" })
  const [stats, setStats] = useState({
    total_points: 0,
    current_streak: 0,
    longest_streak: 0,
    journal_count: 0,
    mood_count: 0,
  })

  const supabase = createClient()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    setUserId(user.id)

    const [{ data: profile }, { count: journalCount }, { count: moodCount }] = await Promise.all([
      supabase.from("profiles").select("username, avatar_url, total_points, current_streak, longest_streak").eq("id", user.id).single(),
      supabase.from("journal_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("mood_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    ])

    if (profile) {
      setForm({ username: profile.username || "", avatar_url: profile.avatar_url || "" })
      setStats({
        total_points: profile.total_points || 0,
        current_streak: profile.current_streak || 0,
        longest_streak: profile.longest_streak || 0,
        journal_count: journalCount || 0,
        mood_count: moodCount || 0,
      })
    }
    setLoading(false)
  }

  const saveProfile = async () => {
    if (!userId) return
    setSaving(true)
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      username: form.username,
      avatar_url: form.avatar_url,
      updated_at: new Date().toISOString(),
    })
    if (error) {
      toast.error("Failed to save profile")
    } else {
      toast.success("Profile saved!")
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <UserCircle className="h-8 w-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account and view your stats</p>
      </div>

      {/* Avatar Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Profile Picture
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={form.avatar_url} />
            <AvatarFallback className="text-2xl">
              {form.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              placeholder="https://example.com/avatar.jpg"
              value={form.avatar_url}
              onChange={(e) => setForm(prev => ({ ...prev, avatar_url: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Edit Profile
          </CardTitle>
          <CardDescription>Update your display name and avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Your display name"
              value={form.username}
              onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
            />
          </div>
          <Button onClick={saveProfile} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{stats.total_points}</div>
            <p className="text-xs text-muted-foreground mt-1">Total Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
            <div className="text-2xl font-bold">{stats.current_streak}</div>
            <p className="text-xs text-muted-foreground mt-1">Current Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{stats.journal_count}</div>
            <p className="text-xs text-muted-foreground mt-1">Journals Written</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Heart className="h-6 w-6 mx-auto mb-2 text-pink-500" />
            <div className="text-2xl font-bold">{stats.mood_count}</div>
            <p className="text-xs text-muted-foreground mt-1">Moods Tracked</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
