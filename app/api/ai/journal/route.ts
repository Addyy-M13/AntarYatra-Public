import { NextResponse } from "next/server"
import { createCompletion } from "@/lib/openrouter"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { mode, entry } = body || {}

    if (!mode || (mode !== "prompt" && mode !== "feedback")) {
      return NextResponse.json({ error: "Invalid mode" }, { status: 400 })
    }

    if (mode === "prompt") {
      const response = await createCompletion({
        max_tokens: 300,
        messages: [
          {
            role: "system",
            content: `You are a compassionate mental wellness journaling guide for AntarYatra, an Indian mental health platform.
Generate a single, thoughtful journaling prompt that:
- Is warm, safe, and non-judgmental
- Encourages self-reflection and emotional awareness
- Is relevant to everyday Indian life and experiences
- Is specific enough to spark genuine reflection (not generic)
Return ONLY the prompt text itself, no preamble or explanation.`,
          },
          { role: "user", content: "Give me a journaling prompt for today." },
        ],
      })

      const text = response.choices[0]?.message?.content ?? ""
      return NextResponse.json({ text })
    }

    // feedback mode — streaming
    if (!entry || typeof entry !== "string" || entry.trim().length < 10) {
      return NextResponse.json({ error: "Entry too short for feedback" }, { status: 400 })
    }

    const stream = await createCompletion({
      max_tokens: 600,
      stream: true,
      messages: [
        {
          role: "system",
          content: `You are a compassionate AI journaling companion for AntarYatra, an Indian mental wellness platform.
When a user shares their journal entry:
1. Start with a brief emotional acknowledgment (1-2 sentences)
2. Reflect back what you noticed — emotions, patterns, or themes
3. Ask one gentle, open-ended question to deepen their reflection
Be warm, supportive, non-clinical, and never preachy. Keep the response under 150 words.`,
        },
        {
          role: "user",
          content: `Here is my journal entry:\n\n${entry.trim()}`,
        },
      ],
    })

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream as unknown as AsyncIterable<any>) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) controller.enqueue(new TextEncoder().encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (err) {
    console.error("AI journal route error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
