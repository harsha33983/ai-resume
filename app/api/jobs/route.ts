import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/jobs
 * Returns jobs from Supabase with search/filter/pagination.
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const keyword = searchParams.get("keyword") || ""
    const location = searchParams.get("location") || ""
    const company = searchParams.get("company") || ""
    const jobType = searchParams.get("job_type") || ""
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "12", 10)
    const offset = (page - 1) * limit

    // Build query
    let query = supabase
      .from("jobs")
      .select("*", { count: "exact" })
      .eq("is_deleted", false)
      .order("posted_at", { ascending: false })

    if (keyword) {
      query = query.or(`title.ilike.%${keyword}%,company.ilike.%${keyword}%,description.ilike.%${keyword}%`)
    }
    if (location) {
      query = query.ilike("location", `%${location}%`)
    }
    if (company) {
      query = query.ilike("company", `%${company}%`)
    }
    if (jobType) {
      query = query.eq("job_type", jobType)
    }

    query = query.range(offset, offset + limit - 1)

    const { data: jobs, count, error } = await query

    if (error) throw error

    const total = count ?? 0
    const totalPages = Math.ceil(total / limit)

    // Get unique filter values
    const { data: allJobs } = await supabase
      .from("jobs")
      .select("location, company, job_type")
      .eq("is_deleted", false)

    const locations = [...new Set((allJobs || []).map((j) => j.location).filter(Boolean))].sort()
    const companies = [...new Set((allJobs || []).map((j) => j.company).filter(Boolean))].sort()
    const jobTypes = [...new Set((allJobs || []).map((j) => j.job_type).filter(Boolean))].sort()

    // Map DB columns to frontend Job type
    const mappedJobs = (jobs || []).map((j) => ({
      job_id: j.id,
      job_title: j.title,
      company_name: j.company,
      location: j.location,
      job_type: j.job_type,
      experience: j.experience_level,
      description: j.description,
      skills: j.skills,
      salary_range: j.salary_range,
      posted_date: j.posted_at,
      source_name: j.source,
      apply_url: j.apply_url,
    }))

    return NextResponse.json({
      success: true,
      jobs: mappedJobs,
      total,
      page,
      limit,
      totalPages,
      filters: {
        locations,
        companies,
        jobTypes,
      },
    })
  } catch (error) {
    console.error("Error fetching jobs:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    )
  }
}
