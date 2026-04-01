import { NextRequest, NextResponse } from "next/server"
import { createCompletion } from "@/lib/openrouter"

function extractJSON(raw: string): string {
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenceMatch) return fenceMatch[1].trim()
  const start = raw.search(/[{[]/)
  const end = Math.max(raw.lastIndexOf("}"), raw.lastIndexOf("]"))
  if (start !== -1 && end !== -1 && end > start) return raw.slice(start, end + 1)
  return raw.trim()
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Weekly insights mode
    if (body.type === "weekly") {
      const { moodData, journalCount, streak } = body

      const moodSummary = moodData?.length > 0
        ? moodData.map((d: any) => `${d.date}: mood ${d.mood_value}/5, energy ${d.energy_level ?? "N/A"}/5, stress ${d.stress_level ?? "N/A"}/5`).join("\n")
        : "No mood data this week."

      const response = await createCompletion({
        max_tokens: 500,
        messages: [
          {
            role: "system",
            content: `You are a compassionate mental wellness coach for AntarYatra, an Indian mental health platform.
Analyze the user's weekly wellness data and respond with ONLY valid JSON in this exact format:
{"insights": ["insight 1", "insight 2", "insight 3"]}
Rules:
- Return exactly 3 insights as an array of strings
- Each insight should be 1-2 sentences, warm and encouraging
- Reference specific patterns from the data
- Be culturally sensitive and supportive for Indian users
- Return ONLY the JSON object, no markdown`,
          },
          {
            role: "user",
            content: `Weekly wellness data:\n${moodSummary}\n\nJournal entries this week: ${journalCount}\nCurrent streak: ${streak} days`,
          },
        ],
      })

      const rawText = response.choices[0]?.message?.content ?? "{}"

      let parsed: { insights: string[] }
      try {
        parsed = JSON.parse(extractJSON(rawText))
      } catch {
        parsed = {
          insights: [
            "Keep up with your journaling practice — consistency is the key to self-awareness.",
            "Your wellness journey is unique. Every small step counts.",
            "Try to check in with your mood daily to spot patterns over time.",
          ],
        }
      }

      return NextResponse.json({ insights: Array.isArray(parsed.insights) ? parsed.insights : [] })
    }

    // Journal entry insights mode
    const { content, mood } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const moodLabel = mood ? ["", "Terrible", "Bad", "Neutral", "Good", "Great"][mood] ?? "Unknown" : "Not provided"

    const response = await createCompletion({
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `You are an empathetic AI wellness assistant for AntarYatra, an Indian mental health journaling platform.
Analyze the journal entry and respond with ONLY valid JSON in this exact format:
{"sentiment":"positive","insights":"A warm 2-3 sentence insight about the emotional content","suggestions":["suggestion 1","suggestion 2","suggestion 3"]}
Rules:
- sentiment must be exactly one of: positive, negative, neutral, mixed
- insights: supportive and non-judgmental, referencing specifics from the entry
- suggestions: 3 practical, actionable, culturally appropriate strings for Indian users
- Return ONLY the JSON object, no markdown`,
        },
        {
          role: "user",
          content: `Journal entry: "${content.trim()}"\nMood rating: ${moodLabel}`,
        },
      ],
    })

    const rawText = response.choices[0]?.message?.content ?? ""

    let parsed: { sentiment: string; insights: string; suggestions: string[] }
    try {
      parsed = JSON.parse(extractJSON(rawText))
    } catch {
      return NextResponse.json({
        sentiment: "neutral",
        insights: "Your thoughts have been noted. Keep expressing yourself — journaling is a powerful step toward self-awareness.",
        suggestions: ["Take a moment to breathe deeply", "Reflect on what made you feel this way", "Be kind and patient with yourself"],
      })
    }

    return NextResponse.json({
      sentiment: parsed.sentiment ?? "neutral",
      insights: parsed.insights ?? "Your entry has been analyzed. Keep writing!",
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    })
  } catch (error) {
    console.error("AI Insights Error:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
