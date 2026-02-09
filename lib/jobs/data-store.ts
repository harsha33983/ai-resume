/**
 * Job Data Store
 *
 * DATABASE SCHEMA (for production PostgreSQL/MySQL deployment):
 *
 * CREATE TABLE jobs (
 *   job_id          VARCHAR(64)  PRIMARY KEY,
 *   job_title       VARCHAR(500) NOT NULL,
 *   company_name    VARCHAR(255) NOT NULL,
 *   location        VARCHAR(255),
 *   job_type        VARCHAR(50),
 *   experience      VARCHAR(100),
 *   posted_date     TIMESTAMP,
 *   source_name     VARCHAR(100) NOT NULL,
 *   apply_url       TEXT NOT NULL,
 *   fingerprint     VARCHAR(64)  UNIQUE,  -- for dedup
 *   created_at      TIMESTAMP    DEFAULT NOW(),
 *   updated_at      TIMESTAMP    DEFAULT NOW(),
 *   is_deleted      BOOLEAN      DEFAULT FALSE,
 *   INDEX idx_title  (job_title),
 *   INDEX idx_company(company_name),
 *   INDEX idx_loc    (location),
 *   INDEX idx_type   (job_type),
 *   INDEX idx_source (source_name),
 *   INDEX idx_date   (posted_date DESC)
 * );
 *
 * CREATE TABLE crawl_logs (
 *   id           VARCHAR(64)  PRIMARY KEY,
 *   source       VARCHAR(100) NOT NULL,
 *   status       ENUM('success','failure','partial'),
 *   jobs_found   INT DEFAULT 0,
 *   jobs_new     INT DEFAULT 0,
 *   jobs_dup     INT DEFAULT 0,
 *   duration_ms  INT DEFAULT 0,
 *   error        TEXT,
 *   timestamp    TIMESTAMP    DEFAULT NOW()
 * );
 *
 * CREATE TABLE scraper_sources (
 *   name           VARCHAR(100) PRIMARY KEY,
 *   base_url       TEXT NOT NULL,
 *   type           ENUM('html','api'),
 *   enabled        BOOLEAN DEFAULT TRUE,
 *   last_crawled   TIMESTAMP,
 *   job_count      INT DEFAULT 0
 * );
 */

import type { Job, JobSearchParams, JobSearchResult, ScraperSource, CrawlLog } from "./types"
import { generateJobFingerprint } from "./scraper-service"

// ========== Seed Data (simulates real scraped jobs) ==========

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString()
}

const SEED_JOBS: Job[] = [
  {
    job_id: "j001",
    job_title: "Senior Frontend Engineer",
    company_name: "Google",
    location: "Mountain View, CA",
    job_type: "Full-time",
    experience: "5+ years",
    posted_date: daysAgo(1),
    source_name: "Google Careers",
    apply_url: "https://careers.google.com/jobs/results/",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j002",
    job_title: "Backend Software Engineer",
    company_name: "Meta",
    location: "Menlo Park, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(2),
    source_name: "Meta Careers",
    apply_url: "https://www.metacareers.com/jobs/",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
  {
    job_id: "j003",
    job_title: "Full Stack Developer",
    company_name: "Stripe",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "2+ years",
    posted_date: daysAgo(1),
    source_name: "Stripe Careers",
    apply_url: "https://stripe.com/jobs/search",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j004",
    job_title: "ML Engineer - NLP",
    company_name: "OpenAI",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "4+ years",
    posted_date: daysAgo(3),
    source_name: "OpenAI Careers",
    apply_url: "https://openai.com/careers/",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    is_deleted: false,
  },
  {
    job_id: "j005",
    job_title: "DevOps Engineer",
    company_name: "Netflix",
    location: "Los Gatos, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(2),
    source_name: "Netflix Jobs",
    apply_url: "https://jobs.netflix.com/",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
  {
    job_id: "j006",
    job_title: "Data Scientist",
    company_name: "Spotify",
    location: "New York, NY",
    job_type: "Full-time",
    experience: "2+ years",
    posted_date: daysAgo(4),
    source_name: "Spotify Careers",
    apply_url: "https://www.lifeatspotify.com/jobs",
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    is_deleted: false,
  },
  {
    job_id: "j007",
    job_title: "React Native Developer",
    company_name: "Airbnb",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(1),
    source_name: "Airbnb Careers",
    apply_url: "https://careers.airbnb.com/",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j008",
    job_title: "Cloud Infrastructure Engineer",
    company_name: "Amazon",
    location: "Seattle, WA",
    job_type: "Full-time",
    experience: "5+ years",
    posted_date: daysAgo(5),
    source_name: "Amazon Jobs",
    apply_url: "https://www.amazon.jobs/",
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
    is_deleted: false,
  },
  {
    job_id: "j009",
    job_title: "iOS Developer",
    company_name: "Apple",
    location: "Cupertino, CA",
    job_type: "Full-time",
    experience: "4+ years",
    posted_date: daysAgo(3),
    source_name: "Apple Careers",
    apply_url: "https://jobs.apple.com/",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    is_deleted: false,
  },
  {
    job_id: "j010",
    job_title: "Product Designer",
    company_name: "Figma",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(2),
    source_name: "Figma Careers",
    apply_url: "https://www.figma.com/careers/",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
  {
    job_id: "j011",
    job_title: "Security Engineer",
    company_name: "Cloudflare",
    location: "Austin, TX",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(1),
    source_name: "Cloudflare Careers",
    apply_url: "https://www.cloudflare.com/careers/",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j012",
    job_title: "Junior Software Engineer",
    company_name: "Vercel",
    location: "Remote",
    job_type: "Full-time",
    experience: "0-2 years",
    posted_date: daysAgo(1),
    source_name: "Vercel Careers",
    apply_url: "https://vercel.com/careers",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j013",
    job_title: "Platform Engineer",
    company_name: "Shopify",
    location: "Remote",
    job_type: "Full-time",
    experience: "4+ years",
    posted_date: daysAgo(6),
    source_name: "Shopify Careers",
    apply_url: "https://www.shopify.com/careers",
    created_at: daysAgo(6),
    updated_at: daysAgo(6),
    is_deleted: false,
  },
  {
    job_id: "j014",
    job_title: "QA Automation Engineer",
    company_name: "Microsoft",
    location: "Redmond, WA",
    job_type: "Full-time",
    experience: "2+ years",
    posted_date: daysAgo(4),
    source_name: "Microsoft Careers",
    apply_url: "https://careers.microsoft.com/",
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    is_deleted: false,
  },
  {
    job_id: "j015",
    job_title: "AI Research Intern",
    company_name: "DeepMind",
    location: "London, UK",
    job_type: "Internship",
    experience: "0-1 years",
    posted_date: daysAgo(2),
    source_name: "DeepMind Careers",
    apply_url: "https://deepmind.google/careers/",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
  {
    job_id: "j016",
    job_title: "Site Reliability Engineer",
    company_name: "Datadog",
    location: "New York, NY",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(3),
    source_name: "Datadog Careers",
    apply_url: "https://careers.datadoghq.com/",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    is_deleted: false,
  },
  {
    job_id: "j017",
    job_title: "Technical Writer",
    company_name: "Twilio",
    location: "Remote",
    job_type: "Contract",
    experience: "2+ years",
    posted_date: daysAgo(5),
    source_name: "Twilio Careers",
    apply_url: "https://www.twilio.com/company/jobs",
    created_at: daysAgo(5),
    updated_at: daysAgo(5),
    is_deleted: false,
  },
  {
    job_id: "j018",
    job_title: "Blockchain Developer",
    company_name: "Coinbase",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(7),
    source_name: "Coinbase Careers",
    apply_url: "https://www.coinbase.com/careers",
    created_at: daysAgo(7),
    updated_at: daysAgo(7),
    is_deleted: false,
  },
  {
    job_id: "j019",
    job_title: "Frontend Engineer - Design Systems",
    company_name: "Notion",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "3+ years",
    posted_date: daysAgo(2),
    source_name: "Notion Careers",
    apply_url: "https://www.notion.so/careers",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
  {
    job_id: "j020",
    job_title: "Go Backend Engineer",
    company_name: "Uber",
    location: "Chicago, IL",
    job_type: "Full-time",
    experience: "4+ years",
    posted_date: daysAgo(3),
    source_name: "Uber Careers",
    apply_url: "https://www.uber.com/us/en/careers/",
    created_at: daysAgo(3),
    updated_at: daysAgo(3),
    is_deleted: false,
  },
  {
    job_id: "j021",
    job_title: "Software Engineer - Payments",
    company_name: "Square",
    location: "San Francisco, CA",
    job_type: "Full-time",
    experience: "2+ years",
    posted_date: daysAgo(1),
    source_name: "Square Careers",
    apply_url: "https://careers.squareup.com/",
    created_at: daysAgo(1),
    updated_at: daysAgo(1),
    is_deleted: false,
  },
  {
    job_id: "j022",
    job_title: "Database Administrator",
    company_name: "Oracle",
    location: "Austin, TX",
    job_type: "Full-time",
    experience: "5+ years",
    posted_date: daysAgo(8),
    source_name: "Oracle Careers",
    apply_url: "https://www.oracle.com/careers/",
    created_at: daysAgo(8),
    updated_at: daysAgo(8),
    is_deleted: false,
  },
  {
    job_id: "j023",
    job_title: "Embedded Systems Engineer",
    company_name: "Tesla",
    location: "Palo Alto, CA",
    job_type: "Full-time",
    experience: "4+ years",
    posted_date: daysAgo(4),
    source_name: "Tesla Careers",
    apply_url: "https://www.tesla.com/careers",
    created_at: daysAgo(4),
    updated_at: daysAgo(4),
    is_deleted: false,
  },
  {
    job_id: "j024",
    job_title: "Staff Engineer - Infrastructure",
    company_name: "GitHub",
    location: "Remote",
    job_type: "Full-time",
    experience: "7+ years",
    posted_date: daysAgo(2),
    source_name: "GitHub Careers",
    apply_url: "https://github.com/about/careers",
    created_at: daysAgo(2),
    updated_at: daysAgo(2),
    is_deleted: false,
  },
]

// ========== In-Memory Store (production: use DB) ==========

let jobsStore: Job[] = [...SEED_JOBS]

const fingerprints = new Set<string>(
  SEED_JOBS.map((j) =>
    generateJobFingerprint(j.job_title, j.company_name, j.location)
  )
)

const crawlLogs: CrawlLog[] = [
  {
    id: "cl001",
    source: "Google Careers",
    status: "success",
    jobsFound: 12,
    jobsNew: 8,
    jobsDuplicate: 4,
    duration: 4500,
    error: null,
    timestamp: daysAgo(0),
  },
  {
    id: "cl002",
    source: "Meta Careers",
    status: "success",
    jobsFound: 9,
    jobsNew: 6,
    jobsDuplicate: 3,
    duration: 3800,
    error: null,
    timestamp: daysAgo(0),
  },
  {
    id: "cl003",
    source: "Stripe Careers",
    status: "partial",
    jobsFound: 5,
    jobsNew: 3,
    jobsDuplicate: 2,
    duration: 6200,
    error: "Timeout on page 3 of pagination",
    timestamp: daysAgo(1),
  },
]

const scraperSources: ScraperSource[] = [
  { name: "Google Careers", baseUrl: "https://careers.google.com", type: "html", enabled: true, lastCrawledAt: daysAgo(0), jobCount: 3 },
  { name: "Meta Careers", baseUrl: "https://www.metacareers.com", type: "html", enabled: true, lastCrawledAt: daysAgo(0), jobCount: 1 },
  { name: "Stripe Careers", baseUrl: "https://stripe.com/jobs", type: "html", enabled: true, lastCrawledAt: daysAgo(1), jobCount: 1 },
  { name: "OpenAI Careers", baseUrl: "https://openai.com/careers", type: "html", enabled: true, lastCrawledAt: daysAgo(0), jobCount: 1 },
  { name: "Netflix Jobs", baseUrl: "https://jobs.netflix.com", type: "api", enabled: true, lastCrawledAt: daysAgo(0), jobCount: 1 },
  { name: "Vercel Careers", baseUrl: "https://vercel.com/careers", type: "html", enabled: true, lastCrawledAt: daysAgo(0), jobCount: 1 },
]

// ========== Data Access Functions ==========

export function getAllJobs(): Job[] {
  return jobsStore.filter((j) => !j.is_deleted)
}

export function getJobById(id: string): Job | undefined {
  return jobsStore.find((j) => j.job_id === id && !j.is_deleted)
}

export function searchJobs(params: JobSearchParams): JobSearchResult {
  const { keyword, location, company, job_type, page = 1, limit = 12 } = params

  let filtered = jobsStore.filter((j) => !j.is_deleted)

  if (keyword) {
    const kw = keyword.toLowerCase()
    filtered = filtered.filter(
      (j) =>
        j.job_title.toLowerCase().includes(kw) ||
        j.company_name.toLowerCase().includes(kw)
    )
  }

  if (location) {
    const loc = location.toLowerCase()
    filtered = filtered.filter((j) =>
      j.location.toLowerCase().includes(loc)
    )
  }

  if (company) {
    const comp = company.toLowerCase()
    filtered = filtered.filter((j) =>
      j.company_name.toLowerCase().includes(comp)
    )
  }

  if (job_type) {
    const jt = job_type.toLowerCase()
    filtered = filtered.filter(
      (j) => j.job_type?.toLowerCase() === jt
    )
  }

  // Sort by posted_date descending
  filtered.sort((a, b) => {
    const da = a.posted_date ? new Date(a.posted_date).getTime() : 0
    const db = b.posted_date ? new Date(b.posted_date).getTime() : 0
    return db - da
  })

  const total = filtered.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const jobs = filtered.slice(offset, offset + limit)

  return { jobs, total, page, limit, totalPages }
}

export function upsertJob(job: Omit<Job, "job_id" | "created_at" | "updated_at" | "is_deleted">): { isNew: boolean; job: Job } {
  const fp = generateJobFingerprint(job.job_title, job.company_name, job.location)

  if (fingerprints.has(fp)) {
    // Update existing
    const existing = jobsStore.find(
      (j) =>
        generateJobFingerprint(j.job_title, j.company_name, j.location) === fp
    )
    if (existing) {
      existing.updated_at = new Date().toISOString()
      return { isNew: false, job: existing }
    }
  }

  const newJob: Job = {
    ...job,
    job_id: `j${String(jobsStore.length + 1).padStart(3, "0")}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
  }

  jobsStore.push(newJob)
  fingerprints.add(fp)
  return { isNew: true, job: newJob }
}

export function softDeleteJob(id: string): boolean {
  const job = jobsStore.find((j) => j.job_id === id)
  if (job) {
    job.is_deleted = true
    job.updated_at = new Date().toISOString()
    return true
  }
  return false
}

export function getScraperSources(): ScraperSource[] {
  return scraperSources
}

export function getCrawlLogs(): CrawlLog[] {
  return crawlLogs.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )
}

export function getUniqueLocations(): string[] {
  const locs = new Set(getAllJobs().map((j) => j.location))
  return Array.from(locs).sort()
}

export function getUniqueCompanies(): string[] {
  const comps = new Set(getAllJobs().map((j) => j.company_name))
  return Array.from(comps).sort()
}

export function getUniqueJobTypes(): string[] {
  const types = new Set(
    getAllJobs()
      .map((j) => j.job_type)
      .filter(Boolean) as string[]
  )
  return Array.from(types).sort()
}
