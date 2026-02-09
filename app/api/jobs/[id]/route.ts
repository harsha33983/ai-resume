import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/jobs/{id}
 * Returns a single job from Supabase by ID.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: job, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .maybeSingle()

    if (error) throw error

    if (!job) {
      return NextResponse.json(
        { success: false, error: "Job not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      job: {
        job_id: job.id,
        job_title: job.title,
        company_name: job.company,
        location: job.location,
        job_type: job.job_type,
        experience: job.experience_level,
        description: job.description,
        skills: job.skills,
        salary_range: job.salary_range,
        posted_date: job.posted_at,
        source_name: job.source,
        apply_url: job.apply_url,
      },
    })
  } catch (error) {
    console.error("Error fetching job:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch job" },
      { status: 500 }
    )
  }
}
