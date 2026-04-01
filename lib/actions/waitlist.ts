"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Adds a new user to the waitlist
 * @param email - User's email address
 * @param source - Signup source (homepage, demo, etc.)
 * @returns Success status, error message, or user data with position
 */
export async function addToWaitlist(email: string, source: string) {
  try {
    const supabase = await createClient()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: "Please enter a valid email address" }
    }

    // Insert user into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert([{ email, source }])
      .select()
      .single()

    if (error) {
      // Check for duplicate email constraint violation
      if (error.code === "23505") {
        return { success: false, error: "This email is already on the waitlist" }
      }
      console.error("❌ Waitlist signup error:", error)
      return { success: false, error: "Failed to join waitlist. Please try again." }
    }

    // Get waitlist position
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })

    return { success: true, data: { ...data, position: count || 0 } }
  } catch (error) {
    console.error("❌ Unexpected error in addToWaitlist:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Gets the user's position in the waitlist
 * Position is calculated based on signup time (earlier = lower number)
 */
export async function getWaitlistPosition(email: string) {
  try {
    const supabase = await createClient()

    const { data: userData } = await supabase
      .from("waitlist")
      .select("created_at")
      .eq("email", email)
      .single()

    if (!userData) {
      return { position: 0, total: 0 }
    }

    // Count users who signed up before this user
    const { count: position } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })
      .lt("created_at", userData.created_at)

    const { count: total } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true })

    return { 
      position: (position || 0) + 1, 
      total: total || 0 
    }
  } catch (error) {
    console.error("❌ Error getting waitlist position:", error)
    return { position: 0, total: 0 }
  }
}

/** Gets the total number of users on the waitlist */
export async function getWaitlistCount() {
  try {
    const supabase = await createClient()

    const { count, error } = await supabase.from("waitlist").select("*", { count: "exact", head: true })

    if (error) {
      console.error("❌ Error fetching waitlist count:", error)
      return { success: false, count: 0 }
    }

    return { success: true, count: count || 0 }
  } catch (error) {
    console.error("❌ Unexpected error in getWaitlistCount:", error)
    return { success: false, count: 0 }
  }
}
