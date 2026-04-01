import OpenAI from "openai"

export const MODEL = "gpt-3.5-turbo"
export const MODEL_FALLBACK = "gpt-4-turbo-preview"

// Initialize client only at request-time to avoid build-time credential requirements
function getOpenRouterClient() {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY environment variable")
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
    defaultHeaders: {
      "HTTP-Referer": "https://antaryatra.app",
      "X-Title": "AntarYatra",
    },
  })
}

// Tries primary model with fallback, returns mock response if all fail
export async function createCompletion(params: any) {
  try {
    const openrouter = getOpenRouterClient()
    return await openrouter.chat.completions.create({ model: MODEL, ...params })
  } catch (e: any) {
    console.log("Primary model failed, trying fallback...")
    try {
      const openrouter = getOpenRouterClient()
      return await openrouter.chat.completions.create({ model: MODEL_FALLBACK, ...params })
    } catch (fallbackError: any) {
      console.log("All API models failed, using local fallback")
      // Return a mock response matching OpenAI format when API fails
      return {
        choices: [{
          message: {
            content: JSON.stringify({
              insights: ["Your commitment to self-reflection shows real strength.", "Small, consistent steps lead to meaningful progress.", "Be patient and compassionate with yourself on this journey."],
              sentiment: "positive",
              suggestions: ["Practice deep breathing for 5 minutes today", "Write down one thing you're grateful for", "Reach out to someone you trust"]
            })
          }
        }]
      }
    }
  }
}
