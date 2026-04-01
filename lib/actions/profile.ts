"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Generates a random username for new users
 */
function generateRandomUsername(): string {
  const adjectives = ['Happy', 'Calm', 'Brave', 'Quiet', 'Bright', 'Gentle', 'Peaceful', 'Hopeful', 'Mindful', 'Serene']
  const nouns = ['Journey', 'Path', 'Soul', 'Heart', 'Mind', 'Spirit', 'Star', 'Moon', 'Sky', 'Wave']
  const randomNum = Math.floor(Math.random() * 9000) + 1000
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adjective}${noun}${randomNum}`
}

/**
 * Ensures user has a profile with username (auto-generates if needed)
 */
export async function ensureProfile() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if profile exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle()

    if (profile?.username) {
      // Profile already exists with username
      return { success: true, username: profile.username }
    }

    // Generate random username
    let username = generateRandomUsername()
    let attempts = 0
    const maxAttempts = 10

    // Keep trying until we find a unique username
    while (attempts < maxAttempts) {
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", username.toLowerCase())
        .maybeSingle()

      if (!existing) {
        // Username is available
        break
      }

      // Try another username
      username = generateRandomUsername()
      attempts++
    }

    // Create/update profile with random username
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id,
        username: username.toLowerCase(),
        total_points: 0,
        current_streak: 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (upsertError) {
      console.error("❌ Error creating profile:", upsertError)
      return { success: false, error: "Failed to create profile" }
    }

    return { success: true, username: username.toLowerCase() }
  } catch (error) {
    console.error("❌ Unexpected error in ensureProfile:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Checks if user has completed username setup
 */
export async function hasUsername() {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, hasUsername: false }
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle()

    return { 
      success: true, 
      hasUsername: !!profile?.username,
      username: profile?.username 
    }
  } catch (error) {
    console.error("❌ Error checking username:", error)
    return { success: false, hasUsername: false }
  }
}

/**
 * Sets the username for the current user (first-time setup)
 */
export async function setUsername(username: string) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Validate username
    if (!username || username.length < 3) {
      return { success: false, error: "Username must be at least 3 characters" }
    }

    if (username.length > 20) {
      return { success: false, error: "Username must be less than 20 characters" }
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { success: false, error: "Username can only contain letters, numbers, and underscores" }
    }

    // Check if username is already taken (ignoring current user)
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username.toLowerCase())
      .neq("id", user.id)
      .maybeSingle()

    if (existing) {
      return { success: false, error: "Username is already taken" }
    }

    // First, ensure profile exists (upsert creates if not exists)
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert({ 
        id: user.id,
        username: username.toLowerCase(),
        total_points: 0,
        current_streak: 0,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (upsertError) {
      console.error("❌ Error upserting profile:", upsertError)
      return { success: false, error: "Failed to set username. Please try again." }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Unexpected error in setUsername:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
