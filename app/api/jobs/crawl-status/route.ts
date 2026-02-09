import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/jobs/crawl-status
 * Returns job stats from Supabase.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { count } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("is_deleted", false)

    const { data: sources } = await supabase
      .from("jobs")
      .select("source")
      .eq("is_deleted", false)

    const uniqueSources = [...new Set((sources || []).map((s) => s.source))]

    return NextResponse.json({
      success: true,
      totalJobs: count ?? 0,
      sources: uniqueSources.map((s) => ({
        name: s,
        status: "active",
      })),
    })
  } catch (error) {
    console.error("Error fetching crawl status:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch crawl status" },
      { status: 500 }
    )
  }
}
