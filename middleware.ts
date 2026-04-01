import { NextRequest, NextResponse } from "next/server"

// In-memory rate limit store (per Vercel serverless instance)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const AI_RATE_LIMIT = 10 // requests per window
const AI_WINDOW_MS = 60 * 1000 // 1 minute

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  )
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limit all AI API routes
  if (pathname.startsWith("/api/ai/")) {
    const ip = getClientIp(request)
    const key = `ai:${ip}`
    const now = Date.now()
    const entry = rateLimitMap.get(key)

    if (entry && now < entry.resetTime) {
      if (entry.count >= AI_RATE_LIMIT) {
        return NextResponse.json(
          { error: "Too many requests. Please wait a moment before trying again." },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
              "X-RateLimit-Limit": String(AI_RATE_LIMIT),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": String(entry.resetTime),
            },
          }
        )
      }
      entry.count++
      rateLimitMap.set(key, entry)
    } else {
      rateLimitMap.set(key, { count: 1, resetTime: now + AI_WINDOW_MS })
    }

    const remaining = AI_RATE_LIMIT - (rateLimitMap.get(key)?.count ?? 1)
    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", String(AI_RATE_LIMIT))
    response.headers.set("X-RateLimit-Remaining", String(Math.max(0, remaining)))
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/ai/:path*"],
}
