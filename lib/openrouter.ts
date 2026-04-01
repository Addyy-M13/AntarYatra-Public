import OpenAI from "openai"

export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://antaryatra.app",
    "X-Title": "AntarYatra",
  },
})

export const MODEL = "gpt-3.5-turbo"
export const MODEL_FALLBACK = "gpt-4-turbo-preview"

// Tries primary model with fallback, returns mock response if all fail
export async function createCompletion(params: any) {
  try {
    return await openrouter.chat.completions.create({ model: MODEL, ...params })
  } catch (e: any) {
    console.log("Primary model failed, trying fallback...")
    try {
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
