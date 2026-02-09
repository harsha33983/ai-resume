"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface JobFiltersProps {
  keyword: string
  setKeyword: (v: string) => void
  location: string
  setLocation: (v: string) => void
  company: string
  setCompany: (v: string) => void
  jobType: string
  setJobType: (v: string) => void
  locations: string[]
  companies: string[]
  jobTypes: string[]
  onSearch: () => void
  onClear: () => void
  hasFilters: boolean
}

export function JobFilters({
  keyword,
  setKeyword,
  location,
  setLocation,
  company,
  setCompany,
  jobType,
  setJobType,
  locations,
  companies,
  jobTypes,
  onSearch,
  onClear,
  hasFilters,
}: JobFiltersProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-col gap-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by job title or company..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch()
            }}
            className="pl-9"
          />
        </div>

        {/* Filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="All Companies" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Companies</SelectItem>
              {companies.map((comp) => (
                <SelectItem key={comp} value={comp}>
                  {comp}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={jobType} onValueChange={setJobType}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {jobTypes.map((jt) => (
                <SelectItem key={jt} value={jt}>
                  {jt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2 sm:ml-auto">
            <Button onClick={onSearch}>Search</Button>
            {hasFilters && (
              <Button variant="ghost" size="icon" onClick={onClear}>
                <X className="h-4 w-4" />
                <span className="sr-only">Clear filters</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
