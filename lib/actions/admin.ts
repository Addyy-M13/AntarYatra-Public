"use server"

import { createClient } from "@/lib/supabase/server"

/**
 * Fetches paginated waitlist signups with optional status filtering
 * @param page - Page number (1-indexed)
 * @param limit - Number of results per page
 * @param status - Filter by status ('pending', 'contacted', 'converted', or 'all')
 */
export async function getWaitlistSignups(page = 1, limit = 20, status?: string) {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    let query = supabase
      .from("waitlist")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("❌ Error fetching waitlist signups:", error)
      return { success: false, error: error.message, data: [], total: 0 }
    }

    return { success: true, data: data || [], total: count || 0 }
  } catch (error) {
    console.error("❌ Error in getWaitlistSignups:", error)
    return { success: false, error: "Failed to fetch signups", data: [], total: 0 }
  }
}

/** Updates the status of a waitlist entry with optional admin notes */
export async function updateWaitlistStatus(id: string, status: string, notes?: string) {
  try {
    const supabase = await createClient()

    const updateData: Record<string, unknown> = { status }
    if (notes !== undefined) {
      updateData.admin_notes = notes
    }
    if (status === "contacted") {
      updateData.contacted_at = new Date().toISOString()
    }

    const { error } = await supabase.from("waitlist").update(updateData).eq("id", id)

    if (error) {
      console.error("❌ Error updating waitlist status:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Error in updateWaitlistStatus:", error)
    return { success: false, error: "Failed to update status" }
  }
}

/** Permanently deletes a waitlist entry */
export async function deleteWaitlistEntry(id: string) {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from("waitlist").delete().eq("id", id)

    if (error) {
      console.error("❌ Error deleting waitlist entry:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("❌ Error in deleteWaitlistEntry:", error)
    return { success: false, error: "Failed to delete entry" }
  }
}

/** Exports all waitlist data as CSV format */
export async function exportWaitlistToCSV() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.from("waitlist").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Error exporting waitlist:", error)
      return { success: false, error: error.message }
    }

    if (!data || data.length === 0) {
      return { success: false, error: "No data to export" }
    }

    // Convert to CSV format
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    const csv = [headers, ...rows].join("\n")

    return { success: true, csv }
  } catch (error) {
    console.error("❌ Error in exportWaitlistToCSV:", error)
    return { success: false, error: "Failed to export data" }
  }
}

/** Fetches aggregate statistics for the waitlist */
export async function getWaitlistStats() {
  try {
    const supabase = await createClient()

    const [totalResult, pendingResult, contactedResult, convertedResult] = await Promise.all([
      supabase.from("waitlist").select("*", { count: "exact", head: true }),
      supabase.from("waitlist").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("waitlist").select("*", { count: "exact", head: true }).eq("status", "contacted"),
      supabase.from("waitlist").select("*", { count: "exact", head: true }).eq("status", "converted"),
    ])

    return {
      success: true,
      stats: {
        total: totalResult.count || 0,
        pending: pendingResult.count || 0,
        contacted: contactedResult.count || 0,
        converted: convertedResult.count || 0,
      },
    }
  } catch (error) {
    console.error("❌ Error in getWaitlistStats:", error)
    return { success: false, error: "Failed to fetch stats" }
  }
}
