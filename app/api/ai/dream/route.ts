import { NextRequest, NextResponse } from "next/server"
import { createCompletion } from "@/lib/openrouter"

export async function POST(req: NextRequest) {
  try {
    const { content, emotions } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Dream content is required" }, { status: 400 })
    }

    const emotionsList = emotions?.length > 0 ? emotions.join(", ") : "not specified"

    const response = await createCompletion({
      max_tokens: 800,
      messages: [
        {
          role: "system",
          content: `You are a compassionate dream interpreter for AntarYatra, an Indian mental wellness platform.
Analyze the dream and respond with ONLY valid JSON in this exact format:
{
  "themes": ["theme1", "theme2", "theme3"],
  "symbols": [{"symbol": "...", "meaning": "..."}],
  "interpretation": "A warm, 3-4 sentence interpretation connecting the dream to the user's emotional state",
  "message": "A single empowering message from the dream (1 sentence)"
}
Rules:
- themes: identify 2-3 core psychological/emotional themes
- symbols: pick 2-3 significant symbols and their meaning in this context
- interpretation: be warm, curious, non-clinical. Reference Indian cultural symbolism when relevant
- message: make it feel like the dream is speaking directly to the user
- Return ONLY the JSON object, no markdown`,
        },
        {
          role: "user",
          content: `Dream description: "${content.trim()}"\nEmotions felt during dream: ${emotionsList}`,
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
        themes: ["Exploration", "Emotion", "Transformation"],
        symbols: [{ symbol: "The journey", meaning: "Your path of self-discovery" }],
        interpretation: rawText.slice(0, 400),
        message: "Your dreams are guiding you toward deeper self-understanding.",
      }
    }

    return NextResponse.json(parsed)
  } catch (error) {
    console.error("Dream API Error:", error)
    return NextResponse.json({ error: "Failed to interpret dream" }, { status: 500 })
  }
}
