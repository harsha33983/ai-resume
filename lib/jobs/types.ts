// ========== Job Aggregation Types ==========

export interface Job {
  job_id: string
  job_title: string
  company_name: string
  location: string
  job_type: string | null
  experience: string | null
  posted_date: string | null
  source_name: string
  apply_url: string
  // Internal tracking
  created_at: string
  updated_at: string
  is_deleted: boolean
}

export interface JobSearchParams {
  keyword?: string
  location?: string
  company?: string
  job_type?: string
  page?: number
  limit?: number
}

export interface JobSearchResult {
  jobs: Job[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ScraperSource {
  name: string
  baseUrl: string
  type: "html" | "api"
  enabled: boolean
  lastCrawledAt: string | null
  jobCount: number
}

export interface CrawlLog {
  id: string
  source: string
  status: "success" | "failure" | "partial"
  jobsFound: number
  jobsNew: number
  jobsDuplicate: number
  duration: number
  error: string | null
  timestamp: string
}

export interface RobotsTxtRule {
  userAgent: string
  allowed: string[]
  disallowed: string[]
  crawlDelay: number | null
}
