import { NextRequest } from "next/server"
import { createCompletion } from "@/lib/openrouter"

const TECHNIQUE_INSTRUCTIONS: Record<string, string> = {
  "thought-record": `Guide the user through a CBT Thought Record:
1. Identify the situation
2. Identify automatic thoughts
3. Identify emotions and their intensity (0-100%)
4. Examine evidence FOR and AGAINST the thought
5. Develop a balanced alternative thought
6. Re-rate emotion intensity`,
  "behavioral-activation": `Guide through Behavioral Activation:
1. Ask about recent activities and mood
2. Help identify avoided activities
3. Schedule small, achievable pleasant activities
4. Explore values and meaningful actions
5. Celebrate small wins`,
  "grounding": `Lead a 5-4-3-2-1 Grounding exercise:
1. Ask them to name 5 things they can see
2. 4 things they can touch/feel
3. 3 things they can hear
4. 2 things they can smell
5. 1 thing they can taste
Then check in on how they feel`,
  "reframing": `Guide Cognitive Reframing:
1. Identify the negative thought
2. Challenge its validity with gentle Socratic questioning
3. Explore alternative perspectives
4. Find a more balanced, compassionate view
5. Practice self-compassion`,
}

export async function POST(req: NextRequest) {
  try {
    const { messages, technique } = await req.json()

    const systemPrompt = `You are a warm, skilled CBT/DBT therapist companion for AntarYatra, an Indian mental wellness platform. You are NOT a replacement for real therapy — acknowledge this gently if the user seems in serious distress.

Technique focus: ${TECHNIQUE_INSTRUCTIONS[technique] ?? TECHNIQUE_INSTRUCTIONS["thought-record"]}

Guidelines:
- Be warm, non-judgmental, and culturally sensitive to Indian users
- Use simple, accessible language
- Ask one question at a time
- Validate emotions before moving forward
- Keep responses concise (2-4 sentences max)
- If user seems in crisis, gently refer to the /crisis page`

    const completionParams = {
      max_tokens: 400,
      stream: true as const,
      messages: [
        { role: "system" as const, content: systemPrompt },
        ...messages,
      ],
    }

    const stream = await createCompletion(completionParams)

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream as unknown as AsyncIterable<any>) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) controller.enqueue(encoder.encode(text))
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  } catch (error) {
    console.error("CBT API Error:", error)
    return new Response("Failed to get response", { status: 500 })
  }
}
