"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Building2,
  MapPin,
  Clock,
  Briefcase,
  ExternalLink,
  CalendarDays,
} from "lucide-react"
import type { Job } from "@/lib/jobs/types"

function timeAgo(dateString: string | null): string {
  if (!dateString) return "Recently"
  const now = new Date()
  const posted = new Date(dateString)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "1 day ago"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function getCompanyInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

const companyColors: Record<string, string> = {
  Google: "bg-blue-500",
  Meta: "bg-blue-600",
  Stripe: "bg-indigo-500",
  OpenAI: "bg-emerald-600",
  Netflix: "bg-red-600",
  Spotify: "bg-green-600",
  Airbnb: "bg-rose-500",
  Amazon: "bg-orange-500",
  Apple: "bg-gray-700",
  Figma: "bg-purple-500",
  Cloudflare: "bg-orange-600",
  Vercel: "bg-gray-900",
  Shopify: "bg-green-700",
  Microsoft: "bg-blue-500",
  DeepMind: "bg-indigo-600",
  Datadog: "bg-violet-600",
  Twilio: "bg-red-500",
  Coinbase: "bg-blue-700",
  Notion: "bg-gray-900",
  Uber: "bg-gray-800",
  Square: "bg-gray-800",
  Oracle: "bg-red-700",
  Tesla: "bg-red-600",
  GitHub: "bg-gray-900",
}

function getCompanyColor(name: string): string {
  return companyColors[name] || "bg-primary"
}

export function JobCard({ job }: { job: Job }) {
  return (
    <Card className="group flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${getCompanyColor(job.company_name)}`}
          >
            {getCompanyInitials(job.company_name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
              {job.job_title}
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{job.company_name}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 pt-0">
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="gap-1 text-xs font-normal">
            <MapPin className="h-3 w-3" />
            {job.location}
          </Badge>
          {job.job_type && (
            <Badge variant="outline" className="gap-1 text-xs font-normal">
              <Briefcase className="h-3 w-3" />
              {job.job_type}
            </Badge>
          )}
          {job.experience && (
            <Badge variant="outline" className="gap-1 text-xs font-normal">
              <Clock className="h-3 w-3" />
              {job.experience}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {timeAgo(job.posted_date)}
          </span>
          <Button
            size="sm"
            asChild
            className="gap-1.5"
          >
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply on company website
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>

        <p className="text-[10px] text-muted-foreground/60">
          {"Source: "}
          {job.source_name}
        </p>
      </CardContent>
    </Card>
  )
}
