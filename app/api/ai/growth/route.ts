import { NextRequest, NextResponse } from "next/server"
import { createCompletion } from "@/lib/openrouter"

export async function POST(req: NextRequest) {
  try {
    const { earlyEntries, recentEntries, totalDays } = await req.json()

    if (!earlyEntries?.length || !recentEntries?.length) {
      return NextResponse.json({ error: "Need journal entries to generate report" }, { status: 400 })
    }

    const formatEntries = (entries: any[]) =>
      entries.map((e, i) => `Entry ${i + 1} (${e.created_at?.split("T")[0] ?? "unknown"}): "${e.content?.slice(0, 300)}..."`).join("\n\n")

    const response = await createCompletion({
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: `You are a compassionate growth analyst for AntarYatra, an Indian mental wellness platform.
Compare early vs recent journal entries and respond with ONLY valid JSON:
{
  "growthSummary": "2-3 sentence narrative of the user's emotional journey and growth",
  "strengthsGained": "paragraph describing 2-3 emotional/personal strengths that emerged",
  "themesResolved": "paragraph describing concerns or fears mentioned early that seem resolved now",
  "stillGrowing": "paragraph describing areas where they are still working (framed positively)",
  "celebrationMessage": "A single deeply personal, celebrating message for their journey (1-2 sentences)"
}
Rules:
- Be specific — reference actual content differences between early and recent entries
- Be warm, celebrating, and culturally sensitive for Indian users
- Return ONLY the JSON object, no markdown`,
        },
        {
          role: "user",
          content: `User has been journaling for ${totalDays ?? "several"} days.\n\nEARLY JOURNAL ENTRIES:\n${formatEntries(earlyEntries)}\n\nRECENT JOURNAL ENTRIES:\n${formatEntries(recentEntries)}`,
        },
      ],
    })

    const rawText = response.choices[0]?.message?.content ?? "{}"

    let parsed
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      parsed = JSON.parse(jsonMatch?.[0] ?? rawText)
    } catch {
      parsed = {
        growthSummary: "Your journaling journey shows meaningful self-reflection and growth.",
        strengthsGained: "You have developed self-awareness, emotional expression, and consistency.",
        themesResolved: "You have found your voice and begun to process past challenges.",
        stillGrowing: "You are continuing to build resilience and deepen self-compassion.",
        celebrationMessage: "Every word you've written is a step toward understanding yourself better.",
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Growth API Error:", error)
    return NextResponse.json({ error: "Failed to generate growth report" }, { status: 500 })
  }
}
