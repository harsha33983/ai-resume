/**
 * Scraper Service Architecture
 *
 * This module defines the scraping pipeline with:
 * - robots.txt validation
 * - Request throttling
 * - Pagination handling
 * - Deduplication
 * - Retry logic with failure isolation
 *
 * In production, this would use Playwright for JS-rendered pages
 * and native fetch for static HTML / public API endpoints.
 *
 * SYSTEM ARCHITECTURE:
 * ┌──────────────────────────────────────────────────────────────┐
 * │                     Job Aggregation System                    │
 * ├──────────────────────────────────────────────────────────────┤
 * │                                                              │
 * │  ┌──────────┐   ┌──────────────┐   ┌──────────────────┐    │
 * │  │ Scheduler │──>│ Scraper Svc  │──>│ Jobs Data Store  │    │
 * │  │ (cron)   │   │              │   │ (DB / In-Memory) │    │
 * │  └──────────┘   │ ┌──────────┐ │   └────────┬─────────┘    │
 * │                  │ │ HTML     │ │            │               │
 * │                  │ │Scraper  │ │   ┌────────▼─────────┐    │
 * │                  │ │(Playwrt)│ │   │  REST API Layer   │    │
 * │                  │ └──────────┘ │   │ GET /api/jobs     │    │
 * │                  │ ┌──────────┐ │   │ GET /api/jobs/:id │    │
 * │                  │ │ API      │ │   │ GET /api/jobs/    │    │
 * │                  │ │Ingestion│ │   │     search        │    │
 * │                  │ └──────────┘ │   └────────┬─────────┘    │
 * │                  │ ┌──────────┐ │            │               │
 * │                  │ │robots.txt│ │   ┌────────▼─────────┐    │
 * │                  │ │Validator │ │   │    Frontend       │    │
 * │                  │ └──────────┘ │   │ Job Cards + Search│    │
 * │                  └──────────────┘   └──────────────────┘    │
 * │                                                              │
 * └──────────────────────────────────────────────────────────────┘
 */

import type { RobotsTxtRule } from "./types"

// ========== robots.txt Validation ==========

export function parseRobotsTxt(content: string): RobotsTxtRule[] {
  const rules: RobotsTxtRule[] = []
  let current: RobotsTxtRule | null = null

  for (const line of content.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const [directive, ...valueParts] = trimmed.split(":")
    const value = valueParts.join(":").trim()

    switch (directive.toLowerCase()) {
      case "user-agent":
        if (current) rules.push(current)
        current = {
          userAgent: value,
          allowed: [],
          disallowed: [],
          crawlDelay: null,
        }
        break
      case "allow":
        if (current) current.allowed.push(value)
        break
      case "disallow":
        if (current) current.disallowed.push(value)
        break
      case "crawl-delay":
        if (current) current.crawlDelay = Number.parseInt(value, 10) || null
        break
    }
  }
  if (current) rules.push(current)
  return rules
}

export function isPathAllowed(
  rules: RobotsTxtRule[],
  path: string,
  userAgent = "*"
): boolean {
  // Find most specific matching rule
  const agentRule = rules.find(
    (r) => r.userAgent.toLowerCase() === userAgent.toLowerCase()
  )
  const wildcardRule = rules.find((r) => r.userAgent === "*")
  const rule = agentRule || wildcardRule

  if (!rule) return true // No rules = allowed

  // Check disallowed paths
  for (const disallowed of rule.disallowed) {
    if (disallowed && path.startsWith(disallowed)) {
      // Check if there's a more specific allow rule
      for (const allowed of rule.allowed) {
        if (allowed && path.startsWith(allowed) && allowed.length > disallowed.length) {
          return true
        }
      }
      return false
    }
  }

  return true
}

export function getCrawlDelay(rules: RobotsTxtRule[], userAgent = "*"): number {
  const agentRule = rules.find(
    (r) => r.userAgent.toLowerCase() === userAgent.toLowerCase()
  )
  const wildcardRule = rules.find((r) => r.userAgent === "*")
  const rule = agentRule || wildcardRule
  return rule?.crawlDelay ?? 2 // Default 2 second delay
}

// ========== Request Throttling ==========

export class RequestThrottler {
  private lastRequest = 0
  private delayMs: number

  constructor(delayMs = 2000) {
    this.delayMs = delayMs
  }

  async throttle(): Promise<void> {
    const now = Date.now()
    const elapsed = now - this.lastRequest
    if (elapsed < this.delayMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.delayMs - elapsed)
      )
    }
    this.lastRequest = Date.now()
  }
}

// ========== Deduplication ==========

export function generateJobFingerprint(
  title: string,
  company: string,
  location: string
): string {
  const normalized = `${title.toLowerCase().trim()}|${company.toLowerCase().trim()}|${location.toLowerCase().trim()}`
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash |= 0
  }
  return `job_${Math.abs(hash).toString(36)}`
}

// ========== Retry Handler ==========

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<T> {
  let lastError: Error | null = null
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxRetries) {
        const delay = baseDelayMs * 2 ** attempt
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }
  throw lastError
}

// ========== Playwright Scraping Example (Architecture Reference) ==========

/**
 * Production Playwright scraper example:
 *
 * ```typescript
 * import { chromium } from 'playwright';
 *
 * async function scrapeCompanyCareers(url: string) {
 *   const browser = await chromium.launch({ headless: true });
 *   const context = await browser.newContext({
 *     userAgent: 'SmartJobPortalBot/1.0 (+https://yoursite.com/bot-info)'
 *   });
 *
 *   const page = await context.newPage();
 *   page.setDefaultTimeout(30000);
 *
 *   // Navigate with timeout
 *   await page.goto(url, { waitUntil: 'networkidle' });
 *
 *   // Extract job listings
 *   const jobs = await page.$$eval('.job-listing', (elements) =>
 *     elements.map((el) => ({
 *       title: el.querySelector('.job-title')?.textContent?.trim() ?? '',
 *       company: el.querySelector('.company')?.textContent?.trim() ?? '',
 *       location: el.querySelector('.location')?.textContent?.trim() ?? '',
 *       link: el.querySelector('a')?.href ?? '',
 *     }))
 *   );
 *
 *   // Handle pagination
 *   const nextBtn = await page.$('a.next-page');
 *   const hasNext = nextBtn !== null;
 *
 *   await browser.close();
 *   return { jobs, hasNext };
 * }
 * ```
 */

// ========== Pagination Handler ==========

export interface PaginationState {
  currentPage: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

export function calculatePagination(
  total: number,
  page: number,
  limit: number
): PaginationState {
  const totalPages = Math.ceil(total / limit)
  return {
    currentPage: page,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  }
}
