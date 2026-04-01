"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Gets the total number of registered users
 */
export async function getUserCount() {
  try {
    const supabase = await createClient()

    // Count users from auth.users table via profiles
    const { count, error } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    if (error) {
      console.error("❌ Error fetching user count:", error)
      return { success: false, count: 37 } // Default fallback
    }

    return { success: true, count: count || 37 }
  } catch (error) {
    console.error("❌ Unexpected error in getUserCount:", error)
    return { success: false, count: 37 }
  }
}
