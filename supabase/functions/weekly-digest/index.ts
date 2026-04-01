import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  )

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, username, current_streak, total_points")

  if (!profiles) return new Response("No profiles", { status: 200 })

  const results = []

  for (const profile of profiles) {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const dateStr = sevenDaysAgo.toISOString().split("T")[0]

    const { data: moods } = await supabase
      .from("mood_entries")
      .select("mood_value")
      .eq("user_id", profile.id)
      .gte("date", dateStr)

    const avgMood =
      moods && moods.length > 0
        ? (moods.reduce((s, m) => s + m.mood_value, 0) / moods.length).toFixed(1)
        : "N/A"

    const { count: journalCount } = await supabase
      .from("journal_entries")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .gte("created_at", sevenDaysAgo.toISOString())

    const { data: authUser } = await supabase.auth.admin.getUserById(profile.id)
    const email = authUser?.user?.email
    if (!email) continue

    const emailBody = `
Hi ${profile.username || "there"},

Here's your AntarYatra weekly digest 🌟

📊 This week's stats:
• Average mood: ${avgMood}/5
• Journal entries: ${journalCount || 0}
• Current streak: ${profile.current_streak || 0} days 🔥
• Total points: ${profile.total_points || 0} ⭐

Keep journaling and tracking your mood to maintain your streak!

With care,
The AntarYatra Team
    `.trim()

    results.push({ email, avgMood, journalCount, streak: profile.current_streak })

    // To enable actual email sending, uncomment and configure Resend:
    // await fetch("https://api.resend.com/emails", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     from: "noreply@antaryatra.com",
    //     to: email,
    //     subject: "Your AntarYatra Weekly Digest",
    //     text: emailBody,
    //   }),
    // })
  }

  return new Response(JSON.stringify({ sent: results.length, results }), {
    headers: { "Content-Type": "application/json" },
  })
})
