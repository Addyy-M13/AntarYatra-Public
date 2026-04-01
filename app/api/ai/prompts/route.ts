import { NextRequest, NextResponse } from "next/server"
import { createCompletion } from "@/lib/openrouter"

export async function POST(req: NextRequest) {
  const { recentMood } = await req.json()

  const moodContext = recentMood
    ? `The user's recent mood score was ${recentMood}/5.`
    : "The user hasn't tracked their mood recently."

  try {
    const response = await createCompletion({
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are a compassionate journaling coach for an Indian mental wellness app called AntarYatra. ${moodContext}
Generate exactly 3 short, thoughtful journal writing prompts that are warm, culturally relevant, and emotionally appropriate. Each prompt should be 1 sentence, open-ended, and encourage reflection.
Return ONLY a JSON array of 3 strings, no other text: ["prompt1", "prompt2", "prompt3"]`,
        },
      ],
    })

    const text = response.choices[0]?.message?.content ?? "[]"
    const prompts = JSON.parse(text.match(/\[[\s\S]*\]/)?.[0] || "[]")
    return NextResponse.json({ prompts })
  } catch (error) {
    console.error("Prompts API Error:", error)
    return NextResponse.json({ prompts: [] })
  }
}
