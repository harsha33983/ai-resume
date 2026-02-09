"use client"

import { useCallback, useEffect, useState } from "react"
import { AppNav } from "@/components/app-nav"
import { JobCard } from "@/components/jobs/job-card"
import { JobFilters } from "@/components/jobs/job-filters"
import { JobPagination } from "@/components/jobs/job-pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Briefcase,
  Building2,
  Globe,
  AlertTriangle,
} from "lucide-react"
import type { Job } from "@/lib/jobs/types"

interface ApiResponse {
  success: boolean
  jobs: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
  filters: {
    locations: string[]
    companies: string[]
    jobTypes: string[]
  }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Filters
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("all")
  const [company, setCompany] = useState("all")
  const [jobType, setJobType] = useState("all")

  // Filter options
  const [locations, setLocations] = useState<string[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [jobTypes, setJobTypes] = useState<string[]>([])

  const fetchJobs = useCallback(
    async (pageNum: number) => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (keyword) params.set("keyword", keyword)
      if (location !== "all") params.set("location", location)
      if (company !== "all") params.set("company", company)
      if (jobType !== "all") params.set("job_type", jobType)
      params.set("page", String(pageNum))
      params.set("limit", "12")

      try {
        const res = await fetch(`/api/jobs?${params.toString()}`)
        const data: ApiResponse = await res.json()

        if (data.success) {
          setJobs(data.jobs)
          setTotal(data.total)
          setPage(data.page)
          setTotalPages(data.totalPages)
          if (data.filters) {
            setLocations(data.filters.locations)
            setCompanies(data.filters.companies)
            setJobTypes(data.filters.jobTypes)
          }
        } else {
          setError("Failed to load jobs")
        }
      } catch {
        setError("Failed to connect to the server")
      } finally {
        setLoading(false)
      }
    },
    [keyword, location, company, jobType]
  )

  useEffect(() => {
    fetchJobs(1)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setPage(1)
    fetchJobs(1)
  }

  const handleClear = () => {
    setKeyword("")
    setLocation("all")
    setCompany("all")
    setJobType("all")
    setPage(1)
    // Fetch after clearing by calling without filters
    setTimeout(() => {
      fetch("/api/jobs?page=1&limit=12")
        .then((r) => r.json())
        .then((data: ApiResponse) => {
          if (data.success) {
            setJobs(data.jobs)
            setTotal(data.total)
            setPage(data.page)
            setTotalPages(data.totalPages)
          }
        })
    }, 0)
  }

  const hasFilters =
    keyword !== "" ||
    location !== "all" ||
    company !== "all" ||
    jobType !== "all"

  return (
    <div className="min-h-screen bg-background">
      <AppNav />
      <main className="mx-auto max-w-6xl px-4 py-8 lg:px-6">
        {/* Header */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                Job Board
              </h1>
              <p className="mt-1 text-pretty text-sm leading-relaxed text-muted-foreground">
                Browse jobs aggregated from public company career pages. Each listing links directly to the official application page.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="gap-1.5 text-xs">
                <Globe className="h-3 w-3" />
                {total} jobs found
              </Badge>
              <Badge variant="outline" className="gap-1.5 text-xs">
                <Building2 className="h-3 w-3" />
                {companies.length} companies
              </Badge>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <JobFilters
            keyword={keyword}
            setKeyword={setKeyword}
            location={location}
            setLocation={setLocation}
            company={company}
            setCompany={setCompany}
            jobType={jobType}
            setJobType={setJobType}
            locations={locations}
            companies={companies}
            jobTypes={jobTypes}
            onSearch={handleSearch}
            onClear={handleClear}
            hasFilters={hasFilters}
          />
        </section>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="mb-2 h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-5 w-24 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-8 w-28 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Cards Grid */}
        {!loading && jobs.length > 0 && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
            <div className="mt-8">
              <JobPagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p)
                  fetchJobs(p)
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }}
              />
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && jobs.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <Briefcase className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-foreground">
              No jobs found
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {/* Crawl Info Footer */}
        <section className="mt-12 rounded-xl border border-border bg-card p-6">
          <h2 className="text-sm font-semibold text-foreground">
            About This Job Board
          </h2>
          <div className="mt-3 grid gap-4 text-xs leading-relaxed text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="font-medium text-foreground">Legal & Ethical</p>
              <p className="mt-1">
                Jobs are collected only from publicly accessible company career
                pages that allow crawling. We respect robots.txt directives and
                use proper user-agent identification.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Data Policy</p>
              <p className="mt-1">
                We do NOT store full job descriptions from protected sites. Only
                basic metadata (title, company, location, type) and the official
                apply URL are stored.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground">Apply Redirect</p>
              <p className="mt-1">
                {"Clicking \"Apply on company website\" opens the official career "}
                page in a new tab. We never handle applications directly.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
