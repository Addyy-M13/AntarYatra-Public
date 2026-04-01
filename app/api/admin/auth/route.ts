import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import bcrypt from "bcryptjs"

// Rate limiting map (in production, use Redis or a proper rate limiting service)
const loginAttempts = new Map<string, { count: number; resetTime: number }>()
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Check rate limiting
    const now = Date.now()
    const attempts = loginAttempts.get(clientIp)
    
    if (attempts) {
      if (now < attempts.resetTime) {
        if (attempts.count >= MAX_ATTEMPTS) {
          return NextResponse.json(
            { success: false, error: "Too many failed attempts. Please try again in 15 minutes." },
            { status: 429 }
          )
        }
      } else {
        // Reset counter if lockout time has passed
        loginAttempts.delete(clientIp)
      }
    }

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

    if (!adminPassword && !adminPasswordHash) {
      return NextResponse.json(
        { success: false, error: "Admin authentication not configured. Check server logs." },
        { status: 500 }
      )
    }

    let isValid = false

    // Check hashed password (preferred method)
    if (adminPasswordHash) {
      isValid = await bcrypt.compare(password, adminPasswordHash)
    }
    // Fallback to plain text only
    else if (adminPassword) {
      isValid = password === adminPassword
    }

    if (isValid) {
      loginAttempts.delete(clientIp)

      // Generate a secure random token
      const token = crypto.randomBytes(32).toString("hex")

      return NextResponse.json({
        success: true,
        token,
      })
    }

    // Record failed attempt
    const currentAttempts = loginAttempts.get(clientIp) || { count: 0, resetTime: now + LOCKOUT_TIME }
    currentAttempts.count++
    currentAttempts.resetTime = now + LOCKOUT_TIME
    loginAttempts.set(clientIp, currentAttempts)

    return NextResponse.json(
      { success: false, error: "Invalid password", attemptsRemaining: MAX_ATTEMPTS - currentAttempts.count },
      { status: 401 }
    )
  } catch {
    return NextResponse.json({ success: false, error: "Authentication error" }, { status: 500 })
  }
}
